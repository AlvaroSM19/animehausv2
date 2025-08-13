'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAllCharacters, type AnimeCharacter } from '../../../lib/anime-data'
import { Search, RotateCcw, Trophy, Clock, Users, X } from 'lucide-react'

// Estilos CSS para la animación de error
const shakeAnimation = `
  @keyframes shake {
    0%, 20%, 40%, 60%, 80% { transform: translateX(0) }
    10%, 30%, 50%, 70% { transform: translateX(-8px) }
    15%, 35%, 55%, 75% { transform: translateX(8px) }
  }
  .shake {
    animation: shake 0.6s ease-in-out;
  }
`

type Player = 'X' | 'O'
type GameMode = 'setup' | 'playing' | 'finished'
type GameVariant = 'menu' | 'single' | 'multi'

interface GridCondition {
  id: string
  name: string
  description: string
  check: (character: AnimeCharacter) => boolean
}

interface GridCell {
  player: Player | null
  character: AnimeCharacter | null
  isValid: boolean
}

interface GameState {
  mode: GameMode
  currentPlayer: Player
  timeLeft: number
  winner: Player | 'draw' | null
  scores: { X: number; O: number }
}

// ---------------- Nuevas utilidades para condiciones dinámicas ----------------
interface SimpleCondition extends GridCondition {
  category: 'crew' | 'origin' | 'bounty_lt' | 'bounty_gte' | 'haki' | 'devilFruit' | 'noFruit'
}

function buildDynamicConditions(characters: AnimeCharacter[]): SimpleCondition[] {
  const conditions: SimpleCondition[] = []

  const MIN_GROUP = 4

  // Crew
  const crewMap: Record<string, number> = {}
  characters.forEach(c => { if (c.crew) crewMap[c.crew] = (crewMap[c.crew]||0)+1 })
  Object.entries(crewMap).forEach(([crew, count]) => {
    if (count >= MIN_GROUP) {
      conditions.push({
        id: `crew:${crew}`,
        name: crew,
        description: `Miembros de ${crew}`,
        check: (ch)=> ch.crew === crew,
        category: 'crew'
      })
    }
  })

  // Origin
  const originMap: Record<string, number> = {}
  characters.forEach(c => { if (c.origin) originMap[c.origin] = (originMap[c.origin]||0)+1 })
  Object.entries(originMap).forEach(([origin, count]) => {
    if (count >= MIN_GROUP) {
      conditions.push({
        id: `origin:${origin}`,
        name: origin,
        description: `Originarios de ${origin}`,
        check: (ch)=> ch.origin === origin,
        category: 'origin'
      })
    }
  })

  // Bounty thresholds
  const ltThresholds = [50_000_000, 100_000_000, 300_000_000]
  ltThresholds.forEach(th => {
    const count = characters.filter(c => c.bounty !== null && c.bounty! < th).length
    if (count >= MIN_GROUP) {
      conditions.push({
        id: `bounty_lt:${th}`,
        name: `< ${th/1_000_000}M`,
        description: `Recompensa menor a ${th.toLocaleString()}`,
        check: c => c.bounty !== null && c.bounty! < th,
        category: 'bounty_lt'
      })
    }
  })
  const gteThresholds = [300_000_000, 1_000_000_000]
  gteThresholds.forEach(th => {
    const count = characters.filter(c => c.bounty !== null && c.bounty! >= th).length
    if (count >= MIN_GROUP) {
      conditions.push({
        id: `bounty_gte:${th}`,
        name: `≥ ${th/1_000_000}M`,
        description: `Recompensa al menos ${th.toLocaleString()}`,
        check: c => c.bounty !== null && c.bounty! >= th,
        category: 'bounty_gte'
      })
    }
  })

  // Haki (general)
  const hakiCount = characters.filter(c => (c as any).haki === true || (c as any).hakiTypes?.length > 0).length
  if (hakiCount >= MIN_GROUP) {
    conditions.push({
      id: 'haki',
      name: 'Haki',
      description: 'Usuarios de Haki',
      check: c => (c as any).haki === true || (c as any).hakiTypes?.length > 0,
      category: 'haki'
    })
  }

  // Devil Fruit user / No Fruit
  const dfUsers = characters.filter(c => c.devilFruit && c.devilFruit !== 'None').length
  if (dfUsers >= MIN_GROUP) {
    conditions.push({
      id: 'devilFruit',
      name: 'Fruta',
      description: 'Usuarios de Fruta',
      check: c => Boolean(c.devilFruit && c.devilFruit !== 'None'),
      category: 'devilFruit'
    })
  }
  const noDfUsers = characters.filter(c => !c.devilFruit || c.devilFruit === 'None').length
  if (noDfUsers >= MIN_GROUP) {
    conditions.push({
      id: 'noFruit',
      name: 'Sin Fruta',
      description: 'Sin Fruta del Diablo',
      check: c => !c.devilFruit || c.devilFruit === 'None',
      category: 'noFruit'
    })
  }

  return conditions
}

// Pool de condiciones para que sean aleatorias cada partida
const ALL_ROW_CONDITIONS: GridCondition[] = [
  {
    id: 'marine',
    name: 'Marina',
    description: 'Personaje de la Marina',
    check: (char) => Boolean(
      char.crew?.toLowerCase().includes('marine') || 
      char.crew?.toLowerCase().includes('navy') ||
      char.origin?.toLowerCase().includes('marine') ||
      char.name.toLowerCase().includes('akainu') ||
      char.name.toLowerCase().includes('aokiji') ||
      char.name.toLowerCase().includes('kizaru') ||
      char.name.toLowerCase().includes('sengoku') ||
      char.name.toLowerCase().includes('garp') ||
      char.name.toLowerCase().includes('smoker') ||
      char.name.toLowerCase().includes('tashigi') ||
      char.name.toLowerCase().includes('coby') ||
      char.name.toLowerCase().includes('helmeppo')
    )
  },
  {
    id: 'pirate',
    name: 'Pirata',
    description: 'Personaje pirata',
    check: (char) => Boolean(
      char.crew?.toLowerCase().includes('pirates') ||
      char.crew?.toLowerCase().includes('pirate') ||
      char.crew?.toLowerCase().includes('straw hat') ||
      char.name.toLowerCase().includes('luffy') ||
      char.name.toLowerCase().includes('zoro') ||
      char.name.toLowerCase().includes('nami') ||
      char.name.toLowerCase().includes('usopp') ||
      char.name.toLowerCase().includes('sanji') ||
      char.name.toLowerCase().includes('chopper') ||
      char.name.toLowerCase().includes('robin') ||
      char.name.toLowerCase().includes('franky') ||
      char.name.toLowerCase().includes('brook') ||
      char.name.toLowerCase().includes('jinbe')
    )
  },
  {
    id: 'powerful',
    name: 'Poderoso',
    description: 'Personaje muy fuerte',
    check: (char) => Boolean(
      char.haki === true || 
      (char.hakiTypes && char.hakiTypes.length > 0) ||
      (char.devilFruit && char.devilFruit !== 'None' && char.devilFruit !== '') ||
      (char.bounty && char.bounty >= 50000000) ||
      char.name.toLowerCase().includes('luffy') ||
      char.name.toLowerCase().includes('zoro') ||
      char.name.toLowerCase().includes('sanji') ||
      char.name.toLowerCase().includes('law') ||
      char.name.toLowerCase().includes('kid') ||
      char.name.toLowerCase().includes('hancock') ||
      char.name.toLowerCase().includes('mihawk')
    )
  },
  {
    id: 'yonko',
    name: 'Yonko',
    description: 'Emperador del mar',
    check: (char) => Boolean(
      char.crew?.toLowerCase().includes('yonko') ||
      char.crew?.toLowerCase().includes('emperor') ||
      char.name.toLowerCase().includes('luffy') ||
      char.name.toLowerCase().includes('shanks') ||
      char.name.toLowerCase().includes('kaido') ||
      char.name.toLowerCase().includes('bigmom') ||
      char.name.toLowerCase().includes('whitebeard') ||
      char.name.toLowerCase().includes('blackbeard')
    )
  },
  {
    id: 'revolutionary',
    name: 'Revolucionario',
    description: 'Ejército Revolucionario',
    check: (char) => Boolean(
      char.crew?.toLowerCase().includes('revolutionary') ||
      char.name.toLowerCase().includes('dragon') ||
      char.name.toLowerCase().includes('sabo') ||
      char.name.toLowerCase().includes('ivankov') ||
      char.name.toLowerCase().includes('kuma')
    )
  },
  {
    id: 'shichibukai',
    name: 'Shichibukai',
    description: 'Ex o actual Shichibukai',
    check: (char) => Boolean(
      char.crew?.toLowerCase().includes('shichibukai') ||
      char.crew?.toLowerCase().includes('warlord') ||
      char.name.toLowerCase().includes('mihawk') ||
      char.name.toLowerCase().includes('hancock') ||
      char.name.toLowerCase().includes('crocodile') ||
      char.name.toLowerCase().includes('jinbe') ||
      char.name.toLowerCase().includes('moria') ||
      char.name.toLowerCase().includes('kuma') ||
      char.name.toLowerCase().includes('doflamingo')
    )
  },
  {
    id: 'supernova',
    name: 'Supernova',
    description: 'Peor Generación',
    check: (char) => Boolean(
      char.name.toLowerCase().includes('luffy') ||
      char.name.toLowerCase().includes('zoro') ||
      char.name.toLowerCase().includes('law') ||
      char.name.toLowerCase().includes('kid') ||
      char.name.toLowerCase().includes('killer') ||
      char.name.toLowerCase().includes('hawkins') ||
      char.name.toLowerCase().includes('drake') ||
      char.name.toLowerCase().includes('apoo') ||
      char.name.toLowerCase().includes('bonney') ||
      char.name.toLowerCase().includes('capone') ||
      char.name.toLowerCase().includes('urouge')
    )
  },
  {
    id: 'cp9',
    name: 'CP9/Gov',
    description: 'Gobierno Mundial',
    check: (char) => Boolean(
      char.crew?.toLowerCase().includes('cp9') ||
      char.crew?.toLowerCase().includes('cipher pol') ||
      char.crew?.toLowerCase().includes('world government') ||
      char.name.toLowerCase().includes('lucci') ||
      char.name.toLowerCase().includes('kaku') ||
      char.name.toLowerCase().includes('kalifa') ||
      char.name.toLowerCase().includes('jabra') ||
      char.name.toLowerCase().includes('blueno') ||
      char.name.toLowerCase().includes('fukurou') ||
      char.name.toLowerCase().includes('kumadori') ||
      char.name.toLowerCase().includes('spandam')
    )
  },
  {
    id: 'fishman',
    name: 'Hombre Pez',
    description: 'Tritón o Sirena',
    check: (char) => Boolean(
      char.crew?.toLowerCase().includes('fishman') ||
      char.crew?.toLowerCase().includes('fish-man') ||
      char.origin?.toLowerCase().includes('fishman') ||
      char.name.toLowerCase().includes('jinbe') ||
      char.name.toLowerCase().includes('arlong') ||
      char.name.toLowerCase().includes('fisher') ||
      char.name.toLowerCase().includes('hody') ||
      char.name.toLowerCase().includes('camie') ||
      char.name.toLowerCase().includes('pappag')
    )
  },
  {
    id: 'villain',
    name: 'Villano',
    description: 'Antagonista principal',
    check: (char) => Boolean(
      char.name.toLowerCase().includes('crocodile') ||
      char.name.toLowerCase().includes('enel') ||
      char.name.toLowerCase().includes('lucci') ||
      char.name.toLowerCase().includes('moria') ||
      char.name.toLowerCase().includes('kaido') ||
      char.name.toLowerCase().includes('bigmom') ||
      char.name.toLowerCase().includes('doflamingo') ||
      char.name.toLowerCase().includes('katakuri') ||
      char.name.toLowerCase().includes('blackbeard') ||
      char.name.toLowerCase().includes('akainu')
    )
  },
  {
    id: 'rookie',
    name: 'Novato',
    description: 'Personaje joven o novato',
    check: (char) => Boolean(
      char.name.toLowerCase().includes('luffy') ||
      char.name.toLowerCase().includes('coby') ||
      char.name.toLowerCase().includes('helmeppo') ||
      char.name.toLowerCase().includes('tashigi') ||
      char.name.toLowerCase().includes('chopper') ||
      char.name.toLowerCase().includes('carrot') ||
      char.name.toLowerCase().includes('yamato') ||
      char.name.toLowerCase().includes('bonney')
    )
  },
  {
    id: 'veteran',
    name: 'Veterano',
    description: 'Personaje con experiencia',
    check: (char) => Boolean(
      char.name.toLowerCase().includes('garp') ||
      char.name.toLowerCase().includes('sengoku') ||
      char.name.toLowerCase().includes('whitebeard') ||
      char.name.toLowerCase().includes('rayleigh') ||
      char.name.toLowerCase().includes('crocus') ||
      char.name.toLowerCase().includes('brook') ||
      char.name.toLowerCase().includes('kokoro') ||
      char.name.toLowerCase().includes('tsuru')
    )
  },
  {
    id: 'navigator',
    name: 'Navegante',
    description: 'Navegante o cartógrafo',
    check: (char) => Boolean(
      char.name.toLowerCase().includes('nami') ||
      char.name.toLowerCase().includes('haredas') ||
      char.name.toLowerCase().includes('devon') ||
      char.name.toLowerCase().includes('bepo')
    )
  },
  {
    id: 'archaeologist',
    name: 'Arqueólogo',
    description: 'Estudioso de historia',
    check: (char) => Boolean(
      char.name.toLowerCase().includes('robin') ||
      char.name.toLowerCase().includes('clover') ||
      char.name.toLowerCase().includes('olivia') ||
      char.name.toLowerCase().includes('saul')
    )
  },
  {
    id: 'high_bounty_row',
    name: 'Recompensa Alta (500-6000M)',
    description: '500-6000 millones berries',
    check: (char) => Boolean(
      (char.bounty && char.bounty >= 500000000 && char.bounty <= 6000000000) ||
      char.name.toLowerCase().includes('luffy') ||
      char.name.toLowerCase().includes('law') ||
      char.name.toLowerCase().includes('kid') ||
      char.name.toLowerCase().includes('katakuri') ||
      char.name.toLowerCase().includes('queen') ||
      char.name.toLowerCase().includes('king') ||
      char.name.toLowerCase().includes('marco')
    )
  },
  {
    id: 'medium_bounty_row',
    name: 'Recompensa Media (200-500M)',
    description: '200-500 millones berries',
    check: (char) => Boolean(
      (char.bounty && char.bounty >= 200000000 && char.bounty <= 500000000) ||
      char.name.toLowerCase().includes('katakuri') ||
      char.name.toLowerCase().includes('queen') ||
      char.name.toLowerCase().includes('king') ||
      char.name.toLowerCase().includes('marco') ||
      char.name.toLowerCase().includes('ace') ||
      char.name.toLowerCase().includes('sabo') ||
      char.name.toLowerCase().includes('jinbe')
    )
  },
  {
    id: 'low_bounty_row',
    name: 'Recompensa Baja (0-200M)',
    description: '0-200 millones berries',
    check: (char) => Boolean(
      (char.bounty && char.bounty > 0 && char.bounty < 200000000) ||
      char.name.toLowerCase().includes('chopper') ||
      char.name.toLowerCase().includes('brook') ||
      char.name.toLowerCase().includes('franky') ||
      char.name.toLowerCase().includes('nami') ||
      char.name.toLowerCase().includes('usopp') ||
      char.name.toLowerCase().includes('bepo') ||
      char.name.toLowerCase().includes('penguin') ||
      char.name.toLowerCase().includes('zoro') ||
      char.name.toLowerCase().includes('sanji')
    )
  }
]

const ALL_COLUMN_CONDITIONS: GridCondition[] = [
  {
    id: 'devil_fruit',
    name: 'Fruta Diablo',
    description: 'Usuario de Fruta del Diablo',
    check: (char) => Boolean(
      (char.devilFruit && char.devilFruit !== 'None' && char.devilFruit !== '') ||
      char.name.toLowerCase().includes('luffy') ||
      char.name.toLowerCase().includes('chopper') ||
      char.name.toLowerCase().includes('robin') ||
      char.name.toLowerCase().includes('brook') ||
      char.name.toLowerCase().includes('law') ||
      char.name.toLowerCase().includes('kid') ||
      char.name.toLowerCase().includes('hancock') ||
      char.name.toLowerCase().includes('crocodile') ||
      char.name.toLowerCase().includes('ace') ||
      char.name.toLowerCase().includes('sabo')
    )
  },
  {
    id: 'fighter',
    name: 'Luchador',
    description: 'Especialista en combate',
    check: (char) => Boolean(
      char.features?.some(feature => 
        feature.toLowerCase().includes('sword') || 
        feature.toLowerCase().includes('blade') ||
        feature.toLowerCase().includes('katana') ||
        feature.toLowerCase().includes('fight') ||
        feature.toLowerCase().includes('martial')
      ) || 
      char.name.toLowerCase().includes('zoro') || 
      char.name.toLowerCase().includes('mihawk') ||
      char.name.toLowerCase().includes('sanji') ||
      char.name.toLowerCase().includes('luffy') ||
      char.name.toLowerCase().includes('jinbe') ||
      char.name.toLowerCase().includes('marco') ||
      char.name.toLowerCase().includes('katakuri') ||
      char.name.toLowerCase().includes('king') ||
      char.name.toLowerCase().includes('queen')
    )
  },
  {
    id: 'famous',
    name: 'Famoso',
    description: 'Personaje reconocido',
    check: (char) => Boolean(
      (char.bounty && char.bounty >= 30000000) ||
      char.crew?.toLowerCase().includes('captain') ||
      char.crew?.toLowerCase().includes('admiral') ||
      char.crew?.toLowerCase().includes('yonko') ||
      char.crew?.toLowerCase().includes('shichibukai') ||
      char.name.toLowerCase().includes('luffy') ||
      char.name.toLowerCase().includes('zoro') ||
      char.name.toLowerCase().includes('nami') ||
      char.name.toLowerCase().includes('sanji') ||
      char.name.toLowerCase().includes('hancock') ||
      char.name.toLowerCase().includes('mihawk') ||
      char.name.toLowerCase().includes('shanks') ||
      char.name.toLowerCase().includes('whitebeard')
    )
  },
  {
    id: 'swordsman',
    name: 'Espadachín',
    description: 'Usa espadas',
    check: (char) => Boolean(
      char.features?.some(feature => 
        feature.toLowerCase().includes('sword') || 
        feature.toLowerCase().includes('blade') ||
        feature.toLowerCase().includes('katana')
      ) || 
      char.name.toLowerCase().includes('zoro') || 
      char.name.toLowerCase().includes('mihawk') ||
      char.name.toLowerCase().includes('vista') ||
      char.name.toLowerCase().includes('shiryu') ||
      char.name.toLowerCase().includes('ryuma') ||
      char.name.toLowerCase().includes('brook')
    )
  },
  {
    id: 'captain',
    name: 'Capitán',
    description: 'Líder de tripulación',
    check: (char) => Boolean(
      char.crew?.toLowerCase().includes('captain') ||
      char.name.toLowerCase().includes('luffy') ||
      char.name.toLowerCase().includes('law') ||
      char.name.toLowerCase().includes('kid') ||
      char.name.toLowerCase().includes('shanks') ||
      char.name.toLowerCase().includes('whitebeard') ||
      char.name.toLowerCase().includes('roger') ||
      char.name.toLowerCase().includes('rocks')
    )
  },
  {
    id: 'female',
    name: 'Mujer',
    description: 'Personaje femenino',
    check: (char) => Boolean(
      char.name.toLowerCase().includes('nami') ||
      char.name.toLowerCase().includes('robin') ||
      char.name.toLowerCase().includes('hancock') ||
      char.name.toLowerCase().includes('vivi') ||
      char.name.toLowerCase().includes('perona') ||
      char.name.toLowerCase().includes('reiju') ||
      char.name.toLowerCase().includes('ulti') ||
      char.name.toLowerCase().includes('yamato') ||
      char.name.toLowerCase().includes('carrot') ||
      char.name.toLowerCase().includes('bigmom') ||
      char.name.toLowerCase().includes('tashigi') ||
      char.name.toLowerCase().includes('kalifa')
    )
  },
  {
    id: 'logia',
    name: 'Logia',
    description: 'Fruta tipo Logia',
    check: (char) => Boolean(
      char.name.toLowerCase().includes('ace') ||
      char.name.toLowerCase().includes('sabo') ||
      char.name.toLowerCase().includes('akainu') ||
      char.name.toLowerCase().includes('aokiji') ||
      char.name.toLowerCase().includes('kizaru') ||
      char.name.toLowerCase().includes('blackbeard') ||
      char.name.toLowerCase().includes('crocodile') ||
      char.name.toLowerCase().includes('enel') ||
      char.name.toLowerCase().includes('smoker') ||
      char.name.toLowerCase().includes('caesar')
    )
  },
  {
    id: 'zoan',
    name: 'Zoan',
    description: 'Fruta tipo Zoan',
    check: (char) => Boolean(
      char.name.toLowerCase().includes('luffy') || // Hito Hito no Mi Model: Nika (Zoan Mítica)
      char.name.toLowerCase().includes('chopper') ||
      char.name.toLowerCase().includes('lucci') ||
      char.name.toLowerCase().includes('kaku') ||
      char.name.toLowerCase().includes('jabra') ||
      char.name.toLowerCase().includes('marco') ||
      char.name.toLowerCase().includes('king') ||
      char.name.toLowerCase().includes('queen') ||
      char.name.toLowerCase().includes('kaido') ||
      char.name.toLowerCase().includes('yamato') ||
      char.name.toLowerCase().includes('drake')
    )
  },
  {
    id: 'paramecia',
    name: 'Paramecia',
    description: 'Fruta tipo Paramecia',
    check: (char) => Boolean(
      char.name.toLowerCase().includes('robin') ||
      char.name.toLowerCase().includes('law') ||
      char.name.toLowerCase().includes('kid') ||
      char.name.toLowerCase().includes('hancock') ||
      char.name.toLowerCase().includes('doflamingo') ||
      char.name.toLowerCase().includes('katakuri') ||
      char.name.toLowerCase().includes('whitebeard') ||
      char.name.toLowerCase().includes('bigmom') ||
      char.name.toLowerCase().includes('brook')
    )
  },
  {
    id: 'haki_user',
    name: 'Haki',
    description: 'Usuario de Haki',
    check: (char) => Boolean(
      char.haki === true || 
      (char.hakiTypes && char.hakiTypes.length > 0) ||
      char.name.toLowerCase().includes('luffy') ||
      char.name.toLowerCase().includes('zoro') ||
      char.name.toLowerCase().includes('sanji') ||
      char.name.toLowerCase().includes('shanks') ||
      char.name.toLowerCase().includes('rayleigh') ||
      char.name.toLowerCase().includes('katakuri') ||
      char.name.toLowerCase().includes('kaido')
    )
  },
  {
    id: 'east_blue',
    name: 'East Blue',
    description: 'Originario de East Blue',
    check: (char) => Boolean(
      char.origin?.toLowerCase().includes('east blue') ||
      char.name.toLowerCase().includes('luffy') ||
      char.name.toLowerCase().includes('zoro') ||
      char.name.toLowerCase().includes('nami') ||
      char.name.toLowerCase().includes('usopp') ||
      char.name.toLowerCase().includes('sanji') ||
      char.name.toLowerCase().includes('garp') ||
      char.name.toLowerCase().includes('dragon')
    )
  },
  {
    id: 'grand_line',
    name: 'Grand Line',
    description: 'De la Grand Line',
    check: (char) => Boolean(
      char.origin?.toLowerCase().includes('grand line') ||
      char.name.toLowerCase().includes('chopper') ||
      char.name.toLowerCase().includes('robin') ||
      char.name.toLowerCase().includes('franky') ||
      char.name.toLowerCase().includes('brook') ||
      char.name.toLowerCase().includes('vivi') ||
      char.name.toLowerCase().includes('crocodile')
    )
  },
  {
    id: 'high_bounty',
    name: 'Recompensa Alta (500-6000M)',
    description: '500-6000 millones berries',
    check: (char) => Boolean(
      (char.bounty && char.bounty >= 500000000 && char.bounty <= 6000000000) ||
      char.name.toLowerCase().includes('luffy') ||
      char.name.toLowerCase().includes('law') ||
      char.name.toLowerCase().includes('kid') ||
      char.name.toLowerCase().includes('katakuri') ||
      char.name.toLowerCase().includes('queen') ||
      char.name.toLowerCase().includes('king') ||
      char.name.toLowerCase().includes('marco')
    )
  },
  {
    id: 'medium_bounty',
    name: 'Recompensa Media (200-500M)',
    description: '200-500 millones berries',
    check: (char) => Boolean(
      (char.bounty && char.bounty >= 200000000 && char.bounty <= 500000000) ||
      char.name.toLowerCase().includes('katakuri') ||
      char.name.toLowerCase().includes('queen') ||
      char.name.toLowerCase().includes('king') ||
      char.name.toLowerCase().includes('marco') ||
      char.name.toLowerCase().includes('ace') ||
      char.name.toLowerCase().includes('sabo') ||
      char.name.toLowerCase().includes('jinbe')
    )
  },
  {
    id: 'low_bounty',
    name: 'Recompensa Baja (0-200M)',
    description: '0-200 millones berries',
    check: (char) => Boolean(
      (char.bounty && char.bounty > 0 && char.bounty < 200000000) ||
      char.name.toLowerCase().includes('chopper') ||
      char.name.toLowerCase().includes('brook') ||
      char.name.toLowerCase().includes('franky') ||
      char.name.toLowerCase().includes('nami') ||
      char.name.toLowerCase().includes('usopp') ||
      char.name.toLowerCase().includes('bepo') ||
      char.name.toLowerCase().includes('penguin') ||
      char.name.toLowerCase().includes('zoro') ||
      char.name.toLowerCase().includes('sanji')
    )
  },
  {
    id: 'young',
    name: 'Joven',
    description: 'Personaje joven',
    check: (char) => Boolean(
      char.name.toLowerCase().includes('luffy') ||
      char.name.toLowerCase().includes('chopper') ||
      char.name.toLowerCase().includes('carrot') ||
      char.name.toLowerCase().includes('yamato') ||
      char.name.toLowerCase().includes('bonney') ||
      char.name.toLowerCase().includes('coby') ||
      char.name.toLowerCase().includes('helmeppo') ||
      char.name.toLowerCase().includes('tashigi')
    )
  },
  {
    id: 'old',
    name: 'Veterano',
    description: 'Personaje mayor',
    check: (char) => Boolean(
      char.name.toLowerCase().includes('whitebeard') ||
      char.name.toLowerCase().includes('garp') ||
      char.name.toLowerCase().includes('sengoku') ||
      char.name.toLowerCase().includes('rayleigh') ||
      char.name.toLowerCase().includes('brook') ||
      char.name.toLowerCase().includes('kureha') ||
      char.name.toLowerCase().includes('crocus') ||
      char.name.toLowerCase().includes('tsuru')
    )
  },
  {
    id: 'royal',
    name: 'Realeza',
    description: 'De familia real',
    check: (char) => Boolean(
      char.name.toLowerCase().includes('vivi') ||
      char.name.toLowerCase().includes('cobra') ||
      char.name.toLowerCase().includes('neptune') ||
      char.name.toLowerCase().includes('shirahoshi') ||
      char.name.toLowerCase().includes('riku') ||
      char.name.toLowerCase().includes('viola') ||
      char.name.toLowerCase().includes('rebecca')
    )
  },
  {
    id: 'scientist',
    name: 'Científico',
    description: 'Inventor o científico',
    check: (char) => Boolean(
      char.name.toLowerCase().includes('vegapunk') ||
      char.name.toLowerCase().includes('caesar') ||
      char.name.toLowerCase().includes('franky') ||
      char.name.toLowerCase().includes('judge') ||
      char.name.toLowerCase().includes('queen') ||
      char.name.toLowerCase().includes('chopper')
    )
  },
  {
    id: 'giant',
    name: 'Gigante',
    description: 'Raza gigante',
    check: (char) => Boolean(
      char.name.toLowerCase().includes('dorry') ||
      char.name.toLowerCase().includes('brogy') ||
      char.name.toLowerCase().includes('oars') ||
      char.name.toLowerCase().includes('saul') ||
      char.name.toLowerCase().includes('hajrudin') ||
      char.name.toLowerCase().includes('morley')
    )
  }
]

export default function AnimeGridPage() {
  const [characters, setCharacters] = useState<AnimeCharacter[]>([])
  const [variant, setVariant] = useState<GameVariant>('menu')
  const [grid, setGrid] = useState<GridCell[][]>(() => 
    Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({ 
      player: null, 
      character: null, 
      isValid: false 
    })))
  )
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null)
  const [showIncorrectAnimation, setShowIncorrectAnimation] = useState<{row: number, col: number, character: AnimeCharacter} | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [gameState, setGameState] = useState<GameState>({
    mode: 'setup',
    currentPlayer: 'X',
    timeLeft: 30,
    winner: null,
    scores: { X: 0, O: 0 }
  })
  
  // Condiciones aleatorias para esta partida
  const [rowConditions, setRowConditions] = useState<GridCondition[]>([])
  const [colConditions, setColConditions] = useState<GridCondition[]>([])

  const generateRandomConditions = useCallback(() => {
    // Para variante single usamos condiciones dinámicas restringidas
    if (variant === 'single') {
      const dynamic = buildDynamicConditions(characters)
      // Mezclar y elegir 6 diferentes priorizando diversidad de categorías
      const shuffled = [...dynamic].sort(()=>Math.random()-0.5)
      const picked: SimpleCondition[] = []
      const categoryUsage: Record<string, number> = {}
      for (const cond of shuffled) {
        const catKey = cond.category
        if (picked.length < 6) {
          // Limitar a máximo 2 por categoría
          if ((categoryUsage[catKey]||0) >= 2) continue
          picked.push(cond)
          categoryUsage[catKey] = (categoryUsage[catKey]||0)+1
        }
      }
      while (picked.length < 6 && shuffled.length) {
        const extra = shuffled.pop()!
        if (!picked.includes(extra)) picked.push(extra)
      }
      const rows = picked.slice(0,3)
      const cols = picked.slice(3,6)
      setRowConditions(rows)
      setColConditions(cols)
      return
    }
    // Función Fisher-Yates shuffle mejorada para distribución equitativa
    const shuffleArray = (array: GridCondition[]) => {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    // Combinar TODAS las condiciones disponibles
    const allConditions = [...ALL_ROW_CONDITIONS, ...ALL_COLUMN_CONDITIONS]
    
    // Intentar generar 6 condiciones ÚNICAS y COMPATIBLES que garanticen todas las soluciones
    let attempts = 0
    let validRowConditions: GridCondition[] = []
    let validColConditions: GridCondition[] = []
    
    while (attempts < 200 && validRowConditions.length === 0) {
      // Shufflear todas las condiciones disponibles
      const shuffledAll = shuffleArray(allConditions)
      
      // Seleccionar condiciones únicas por nombre Y compatibles lógicamente
      const selectedConditions: GridCondition[] = []
      const usedNames = new Set<string>()
      const categoryCount = {
        bounty: 0, // Solo permitir UNA condición de recompensa
        haki: 0,   // Podría limitar haki también si es necesario
        other: 0
      }
      
      for (const condition of shuffledAll) {
        // Verificar si es una condición de recompensa
        const isBountyCondition = condition.name.toLowerCase().includes('recompensa')
        const isHakiCondition = condition.name.toLowerCase().includes('haki')
        
        // Aplicar reglas de compatibilidad
        if (isBountyCondition && categoryCount.bounty >= 1) {
          continue // Ya tenemos una condición de recompensa, saltar
        }
        
        if (!usedNames.has(condition.name) && selectedConditions.length < 6) {
          selectedConditions.push(condition)
          usedNames.add(condition.name)
          
          // Actualizar contadores de categorías
          if (isBountyCondition) categoryCount.bounty++
          else if (isHakiCondition) categoryCount.haki++
          else categoryCount.other++
        }
      }
      
      // Si no conseguimos 6 condiciones únicas y compatibles, saltamos este intento
      if (selectedConditions.length < 6) {
        attempts++
        continue
      }
      
      // Dividir aleatoriamente en filas y columnas
      const testRowConditions = selectedConditions.slice(0, 3)
      const testColConditions = selectedConditions.slice(3, 6)
      
      // GARANTÍA ABSOLUTA: NO hay duplicados de nombre ni condiciones incompatibles
      const allNames = selectedConditions.map(c => c.name)
      const uniqueNames = new Set(allNames)
      const bountyConditions = selectedConditions.filter(c => c.name.toLowerCase().includes('recompensa'))
      
      if (uniqueNames.size !== 6 || bountyConditions.length > 1) {
        attempts++
        continue // Falló la validación de unicidad o compatibilidad
      }
      
      // Verificar que TODAS las 9 combinaciones tengan solución
      let allCombinationsHaveSolution = true
      
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const hasSolution = characters.some(char => 
            testRowConditions[row].check(char) && testColConditions[col].check(char)
          )
          if (!hasSolution) {
            allCombinationsHaveSolution = false
            break
          }
        }
        if (!allCombinationsHaveSolution) break
      }
      
      // Solo si TODAS las combinaciones tienen solución
      if (allCombinationsHaveSolution) {
        validRowConditions = testRowConditions
        validColConditions = testColConditions
        console.log('✅ Condiciones COMPATIBLES generadas (máximo 1 recompensa):', {
          filas: testRowConditions.map(r => `${r.id}: ${r.name}`),
          columnas: testColConditions.map(c => `${c.id}: ${c.name}`),
          totalCondiciones: 6,
          condicionesRecompensa: bountyConditions.length,
          nombresUnicos: new Set([...testRowConditions, ...testColConditions].map(c => c.name)).size,
          intento: attempts + 1
        })
        break
      }
      
      attempts++
    }
    
    // Si no encontramos una combinación válida, usar condiciones garantizadas COMPATIBLES
    if (validRowConditions.length === 0) {
      console.log('⚠️ Usando condiciones por defecto COMPATIBLES (máximo 1 recompensa) después de', attempts, 'intentos')
      validRowConditions = [
        ALL_ROW_CONDITIONS.find(c => c.id === 'pirate')!,
        ALL_ROW_CONDITIONS.find(c => c.id === 'powerful')!,
        ALL_ROW_CONDITIONS.find(c => c.id === 'marine')!
      ]
      validColConditions = [
        ALL_COLUMN_CONDITIONS.find(c => c.id === 'devil_fruit')!,
        ALL_COLUMN_CONDITIONS.find(c => c.id === 'fighter')!,
        ALL_COLUMN_CONDITIONS.find(c => c.id === 'low_bounty')! // Solo UNA condición de recompensa
      ]
      
      // Verificar que las condiciones por defecto son compatibles
      const defaultNames = [
        ...validRowConditions.map(c => c.name),
        ...validColConditions.map(c => c.name)
      ]
      const uniqueDefaultNames = new Set(defaultNames)
      const defaultBountyConditions = [...validRowConditions, ...validColConditions]
        .filter(c => c.name.toLowerCase().includes('recompensa'))
      
      console.log('🔒 Condiciones por defecto - Total:', defaultNames.length, 
                  'Nombres únicos:', uniqueDefaultNames.size,
                  'Condiciones de recompensa:', defaultBountyConditions.length)
    }
    
    setRowConditions(validRowConditions)
    setColConditions(validColConditions)
  }, [characters])

  useEffect(() => {
    setCharacters(getAllCharacters())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (characters.length > 0) {
      generateRandomConditions()
    }
  }, [characters, generateRandomConditions])

  // Timer countdown (solo multijugador)
  useEffect(() => {
    if (variant !== 'multi') return
    if (gameState.mode !== 'playing' || gameState.timeLeft <= 0) return

    const timer = setTimeout(() => {
      if (gameState.timeLeft <= 1) {
        switchPlayer()
      } else {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }))
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [gameState.timeLeft, gameState.mode, variant])

  const checkCharacterValidForCell = (character: AnimeCharacter, row: number, col: number): boolean => {
    if (!rowConditions[row] || !colConditions[col]) return false
    return rowConditions[row].check(character) && colConditions[col].check(character)
  }

  const switchPlayer = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayer: prev.currentPlayer === 'X' ? 'O' : 'X',
      timeLeft: 30
    }))
  }

  const checkWinner = (newGrid: GridCell[][]): Player | 'draw' | null => {
    const flat = newGrid.flat()
    if (variant === 'single') {
      // Victoria single: todas las celdas llenas y válidas
      if (flat.every(c => c.isValid)) return 'X'
      return null
    }
    // Multi: lógica tic tac toe clásica
    const lines = [ [0,1,2],[3,4,5],[6,7,8], [0,3,6],[1,4,7],[2,5,8], [0,4,8],[2,4,6] ]
    for (const [a,b,c] of lines) {
      if (flat[a]?.player && flat[a].player === flat[b]?.player && flat[a].player === flat[c]?.player && flat[a].isValid && flat[b].isValid && flat[c].isValid) {
        return flat[a].player
      }
    }
    if (flat.every(cell => cell.player !== null)) return 'draw'
    return null
  }

  const handleCellClick = (row: number, col: number) => {
  if (gameState.mode !== 'playing') return
  if (grid[row][col].player) return
    
    setSelectedCell({ row, col })
    setShowPicker(true)
  }

  const handleCharacterSelect = (character: AnimeCharacter) => {
    if (!selectedCell || gameState.mode !== 'playing') return
    
    const { row, col } = selectedCell
    const isValid = checkCharacterValidForCell(character, row, col)
    
    if (isValid) {
      // Si es correcto, colocar el personaje y marcar la casilla como del jugador actual
      const newGrid = [...grid]
      newGrid[row][col] = { player: variant==='single' ? 'X' : gameState.currentPlayer, character, isValid: true }
      setGrid(newGrid)
      
      // Verificar ganador
      const winner = checkWinner(newGrid)
      if (winner) {
        setGameState(prev => ({
          ...prev,
          mode: 'finished',
          winner,
          scores: variant==='single' ? prev.scores : (winner !== 'draw' ? { ...prev.scores, [winner]: prev.scores[winner] + 1 } : prev.scores)
        }))
      } else {
        if (variant === 'multi') switchPlayer()
      }
      
      setShowPicker(false)
      setSelectedCell(null)
      setSearchTerm('')
    } else {
      // Si es incorrecto, mostrar animación de error
  setShowIncorrectAnimation({ row, col, character })
  console.log(`❌ ${gameState.currentPlayer} falló con ${character.name} en [${row}, ${col}]`)
      
      // Ocultar el picker inmediatamente
      setShowPicker(false)
      setSelectedCell(null)
      setSearchTerm('')
      
      // Después de 1.5 segundos, quitar la animación y cambiar turno
      setTimeout(() => {
        setShowIncorrectAnimation(null)
        if (variant==='multi') switchPlayer()
      }, 1500)
    }
  }

  const startNewGame = () => {
    setGrid(Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({ 
      player: null, 
      character: null, 
      isValid: false 
    }))))
    generateRandomConditions()
    setGameState(prev => ({
      ...prev,
      mode: 'playing',
      currentPlayer: 'X',
      timeLeft: 30,
      winner: null
    }))
  }

  const resetScores = () => {
    setGameState(prev => ({
      ...prev,
      mode: 'setup',
      scores: { X: 0, O: 0 },
      winner: null
    }))
  }

  const filteredCharacters = characters.filter(char =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <style jsx>{`
        @keyframes shake {
          0%, 20%, 40%, 60%, 80% { transform: translateX(0) }
          10%, 30%, 50%, 70% { transform: translateX(-8px) }
          15%, 35%, 55%, 75% { transform: translateX(8px) }
        }
        .shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
      
      <div className="min-h-screen relative text-white p-6 font-sans">
        {/* Tic Tac Toe Battle Background */}
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/anime-grid-bg.svg')`
            }}
          ></div>
          {/* Dark overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85"></div>
        </div>

        {/* Content with relative positioning */}
        <div className="relative z-10 max-w-6xl mx-auto">
        {variant==='menu' && (
          <div className="text-center py-24">
            <h1 className="text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-xl">ANIME GRID</h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto mb-10">Elige un modo de juego: llena todas las casillas cumpliendo las condiciones (Solitario) o compite por líneas válidas (Multijugador).</p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <button onClick={()=>{setVariant('single'); setGameState(p=>({...p, mode:'setup'})); generateRandomConditions();}} className="group relative px-10 py-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-700 transition-all shadow-2xl border border-emerald-400/40 w-72">
                <span className="text-3xl mb-3 block">🧩</span>
                <span className="text-2xl font-bold block mb-2">Solitario</span>
                <span className="text-sm text-emerald-100/90 leading-snug">Rellena las 9 casillas con personajes que cumplan las condiciones de fila y columna.</span>
                <span className="absolute -top-3 -right-3 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold border border-white/20">Nuevo</span>
              </button>
              <button onClick={()=>{setVariant('multi'); setGameState(p=>({...p, mode:'setup'})); generateRandomConditions();}} className="px-10 py-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-700 transition-all shadow-2xl border border-indigo-400/40 w-72">
                <span className="text-3xl mb-3 block">⚔️</span>
                <span className="text-2xl font-bold block mb-2">Multijugador</span>
                <span className="text-sm text-indigo-100/90 leading-snug">Turnos de 30s. Coloca personajes correctos para formar líneas y ganar.</span>
              </button>
            </div>
          </div>
        )}
        {variant!=='menu' && (
          <>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 text-yellow-400 drop-shadow-lg">ANIME GRID</h1>
            {variant==='single' ? (
              <p className="text-lg text-gray-300 mb-6 font-medium">Rellena todas las casillas cumpliendo las condiciones. Sin límite de turnos.</p>
            ) : (
              <p className="text-lg text-gray-300 mb-6 font-medium">¡Batalla épica de conocimiento pirata! • 30 segundos por turno</p>
            )}
            <button onClick={()=>{setVariant('menu'); setGameState(p=>({...p, mode:'setup', winner:null})); setGrid(Array(3).fill(null).map(()=>Array(3).fill(null).map(()=>({player:null, character:null, isValid:false}))))}} className="text-xs text-gray-400 underline hover:text-gray-200">Volver al menú</button>
          </div>
          </>
        )}

        {variant!=='menu' && (
          <div className="flex flex-col items-center gap-6 mb-8">
            {variant==='multi' && (
              <div className="flex items-center gap-6 bg-gray-800 px-6 py-4 rounded-xl border-2 border-yellow-600">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-400" />
                  <span className="text-lg font-bold">X: <span className="text-blue-400">{gameState.scores.X}</span></span>
                </div>
                <div className="w-px h-8 bg-gray-600" />
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-red-400" />
                  <span className="text-lg font-bold">O: <span className="text-red-400">{gameState.scores.O}</span></span>
                </div>
                {gameState.mode==='playing' && (
                  <div className={`ml-6 flex items-center gap-2 px-4 py-2 rounded-lg border ${gameState.currentPlayer==='X' ? 'bg-blue-900 border-blue-500' : 'bg-red-900 border-red-500'}`}>
                    <Clock className="w-5 h-5" />
                    <span className="font-bold text-sm">Turno {gameState.currentPlayer}: {gameState.timeLeft}s</span>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-3 flex-wrap justify-center">
              {gameState.mode === 'setup' ? (
                <button onClick={startNewGame} className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-bold text-lg shadow-lg">
                  <Trophy className="w-5 h-5" />
                  {variant==='multi' ? 'Iniciar Batalla' : 'Comenzar'}
                </button>
              ) : (
                <button onClick={startNewGame} className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-black rounded-lg transition-colors font-bold text-lg shadow-lg">
                  <RotateCcw className="w-5 h-5" />
                  Nueva Partida
                </button>
              )}
              {variant==='multi' && (
                <button onClick={resetScores} className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold text-lg shadow-lg">
                  <X className="w-5 h-5" /> Reset
                </button>
              )}
            </div>
          </div>
        )}

  {/* Winner Announcement */}
  {variant!=='menu' && gameState.winner && (
          <div className="text-center mb-8">
            <div className={`inline-block px-8 py-4 rounded-2xl border-2 shadow-2xl ${
              gameState.winner === 'draw' 
                ? 'bg-gray-700 border-gray-400 text-gray-200' 
                : gameState.winner === 'X'
                  ? 'bg-blue-700 border-blue-400 text-blue-100'
                  : 'bg-red-700 border-red-400 text-red-100'
            }`}>
              <h2 className="text-3xl font-bold mb-2">
                {gameState.winner === 'draw' 
                  ? '🤝 ¡EMPATE!' 
                  : `🎉 ¡JUGADOR ${gameState.winner} GANA!`}
              </h2>
              <p className="text-lg">
                {gameState.winner === 'draw' 
                  ? 'Ambos piratas demostraron gran conocimiento' 
                  : `¡Excelente conocimiento de One Piece!`}
              </p>
            </div>
          </div>
        )}

  {/* Grid Container */}
  {variant!=='menu' && (
  <div className="flex justify-center mb-8">
          <div className="bg-gray-900/90 p-8 rounded-3xl shadow-2xl border border-yellow-500/30">
            
            {/* Column Headers */}
            {gameState.mode !== 'setup' && colConditions.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="w-32"></div>
                {colConditions.map((condition, index) => (
                  <div key={index} className="w-32 h-32 flex items-center justify-center">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg border border-blue-400/50 w-full h-full flex items-center justify-center text-center">
                      {condition.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grid Rows */}
            <div className="space-y-3">
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-4 gap-3 items-center">
                  
                  {/* Row Header */}
                  {gameState.mode !== 'setup' && rowConditions.length > 0 && (
                    <div className="w-32 h-32 flex items-center justify-center">
                      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg border border-orange-400/50 w-full h-full flex items-center justify-center text-center">
                        {rowConditions[rowIndex]?.name}
                      </div>
                    </div>
                  )}

                  {/* Grid Cells */}
                  {row.map((cell, colIndex) => {
                    // Verificar si esta casilla está mostrando animación de error
                    const isShowingError = showIncorrectAnimation?.row === rowIndex && showIncorrectAnimation?.col === colIndex
                    const displayCharacter = isShowingError ? showIncorrectAnimation.character : cell.character
                    
                    return (
                      <div
                        key={colIndex}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={`
                          w-32 h-32 rounded-2xl cursor-pointer
                          flex flex-col items-center justify-center
                          transition-all duration-300 hover:scale-105
                          border-2 shadow-lg relative overflow-hidden
                          ${isShowingError ? 'shake bg-gradient-to-br from-red-600 to-red-700 border-red-400 shadow-red-500/50' :
                            gameState.mode === 'setup' 
                              ? 'bg-gray-700 border-gray-500 hover:border-gray-400' 
                              : cell.player 
                                ? (cell.isValid 
                                  ? 'bg-gradient-to-br from-green-600 to-green-700 border-green-400 shadow-green-500/25' 
                                  : 'bg-gradient-to-br from-red-600 to-red-700 border-red-400 shadow-red-500/25') 
                                : 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-500 hover:border-yellow-400 hover:shadow-yellow-500/25'
                          }
                        `}
                      >
                        {/* Player Symbol */}
                        {cell.player && !isShowingError && (
                          <div className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm border ${
                            cell.player === 'X' 
                              ? 'bg-blue-500 text-white border-blue-300 shadow-lg' 
                              : 'bg-red-500 text-white border-red-300 shadow-lg'
                          }`}>
                            {cell.player}
                          </div>
                        )}

                        {/* Error indicator para animación */}
                        {isShowingError && (
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm bg-red-600 text-white border-red-300 shadow-lg">
                            ❌
                          </div>
                        )}

                        {/* Character Content */}
                        {displayCharacter ? (
                          <div className="text-center w-full h-full flex flex-col items-center justify-center p-3">
                            {displayCharacter.imageUrl ? (
                              <img 
                                src={displayCharacter.imageUrl} 
                                alt={displayCharacter.name}
                                className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-md mb-1"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gray-600 rounded-full border-2 border-white shadow-md mb-1 flex items-center justify-center">
                                <span className="text-lg">🏴‍☠️</span>
                              </div>
                            )}
                            <div className="text-xs font-bold text-white text-center leading-tight max-w-full truncate">
                              {displayCharacter.name}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            {gameState.mode === 'setup' ? (
                              <>
                                <div className="text-3xl mb-1">🎯</div>
                                <div className="text-xs text-gray-400 font-medium">Listo</div>
                              </>
                            ) : (
                              <>
                                <div className="text-3xl mb-1 text-gray-400">?</div>
                                <div className="text-xs text-gray-400 font-medium">
                                  {gameState.mode === 'playing' ? 'Elegir' : 'Vacío'}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
  </div>
  )}

        {/* Character Picker Modal */}
        {showPicker && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col border-2 border-yellow-600 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${
                  gameState.currentPlayer === 'X' ? 'text-blue-400' : 'text-red-400'
                }`}>
                  🏴‍☠️ Jugador {gameState.currentPlayer} - Elige tu Pirata
                </h3>
                <button
                  onClick={() => setShowPicker(false)}
                  className="text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 p-2 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedCell && (
                <div className="mb-6 p-4 bg-purple-900/30 rounded-lg border border-purple-600">
                  <p className="text-lg text-center text-white font-medium">
                    🎯 Necesitas: <span className="font-bold text-orange-400">{rowConditions[selectedCell.row]?.name}</span>
                    {' + '}
                    <span className="font-bold text-blue-400">{colConditions[selectedCell.col]?.name}</span>
                  </p>
                  <p className="text-sm text-center text-gray-300 mt-2">
                    ⏰ Tiempo restante: <span className="font-bold text-yellow-400">{gameState.timeLeft}s</span>
                  </p>
                  {(() => {
                    const validCharacters = characters.filter(char => 
                      checkCharacterValidForCell(char, selectedCell.row, selectedCell.col)
                    )
                    return (
                      <p className="text-sm text-center text-green-300 mt-1">
                        💡 Personajes válidos disponibles: <span className="font-bold">{validCharacters.length}</span>
                      </p>
                    )
                  })()}
                </div>
              )}

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre de pirata..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 text-lg font-medium"
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-4">
                  {filteredCharacters.slice(0, 60).map((character) => (
                    <button
                      key={character.name}
                      onClick={() => handleCharacterSelect(character)}
                      className="p-3 rounded-xl border-2 border-gray-600 bg-gray-700 hover:bg-gray-600 hover:border-yellow-400 text-center transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      {character.imageUrl ? (
                        <img 
                          src={character.imageUrl} 
                          alt={character.name}
                          className="w-16 h-16 object-cover rounded-full mx-auto mb-2 border-2 border-gray-500"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center border-2 border-gray-500">
                          <span className="text-xl">🏴‍☠️</span>
                        </div>
                      )}
                      <div className="font-bold text-sm text-white leading-tight">{character.name}</div>
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        {character.crew || 'Independiente'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center space-y-2 bg-gray-800/50 p-6 rounded-xl border border-gray-600">
          <h3 className="text-xl font-bold text-yellow-400 mb-3">📋 Reglas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300 font-medium">
            <p>🎯 Cada casilla necesita un personaje que cumpla AMBAS condiciones (fila + columna)</p>
            <p>⏰ Tienes 30 segundos por turno para elegir tu personaje</p>
            <p>🏆 Consigue 3 en línea con personajes VÁLIDOS para ganar</p>
          </div>
          <p className="text-yellow-300 font-bold mt-4">
            💡 Las condiciones cambian en cada partida. ¡Demuestra tu conocimiento de One Piece!
          </p>
        </div>
        </div>
      </div>
    </>
  )
}
