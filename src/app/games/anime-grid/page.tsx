'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAllCharacters, type AnimeCharacter } from '../../../lib/anime-data'
import { Search, RotateCcw, Trophy, Clock, Users, X, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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

// Nuevo pool simplificado de condiciones base (usado sólo como fallback multi)
const SIMPLIFIED_POOL: GridCondition[] = [
  { id: 'crew_any', name: 'Crew', description: 'Misma crew', check: c => Boolean(c.crew) },
  { id: 'origin_any', name: 'Origen', description: 'Mismo origen', check: c => Boolean(c.origin) },
  { id: 'haki_any', name: 'Haki', description: 'Usuario de Haki', check: c => Boolean((c as any).haki === true || (c as any).hakiTypes?.length) },
  { id: 'fruit_any', name: 'Fruta', description: 'Usuario de Fruta', check: c => Boolean(c.devilFruit && c.devilFruit !== 'None') },
  { id: 'bounty_gt_any', name: 'Bounty ≥ 300M', description: 'Recompensa mayor o igual a 300M', check: c => Boolean(c.bounty && c.bounty >= 300_000_000) },
  { id: 'bounty_lt_any', name: 'Bounty < 100M', description: 'Recompensa menor a 100M', check: c => Boolean(c.bounty && c.bounty < 100_000_000) }
]

// Eliminado ALL_COLUMN_CONDITIONS para simplificación

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
    // NUEVA LÓGICA: condiciones específicas (Crew > Big Mom Pirates, Origin > East Blue, etc.)
    // 1. Construir listas de crews y origins con grupos suficientemente grandes
    const MIN_GROUP = 3
    const charList = getAllCharacters()
    const crewCounts: Record<string, number> = {}
    const originCounts: Record<string, number> = {}
    const hakiTypeCounts: Record<string, number> = {}
    const fruitTypeCounts: Record<string, number> = {}

    // Clasificador simple de tipo de fruta (similar a onepiecedle)
    const classifyFruit = (c: AnimeCharacter): string | null => {
      if (!c.devilFruit) return null
      const f = c.devilFruit.toLowerCase()
      if (/(mera mera|moku moku|suna suna|goro goro|hie hie|yami yami|pika pika|magu magu|gasu gasu|yuki yuki|beta beta|numa numa)/.test(f)) return 'Logia'
      if (/(hito hito|inu inu|neko neko|zou zou|tori tori|ushi ushi|uma uma|hebi hebi|mushi mushi|ryu ryu|sara sara)/.test(f)) {
        if (/(phoenix|phoenix|nika|mythical|yamata)/.test(f)) return 'Mythical Zoan'
        return 'Zoan'
      }
      return 'Paramecia'
    }

    charList.forEach(c => {
      if (c.crew) crewCounts[c.crew] = (crewCounts[c.crew] ?? 0) + 1
      if (c.origin) {
        const prev = originCounts[c.origin] || 0
        originCounts[c.origin] = prev + 1
      }
      // Haki types
      (c as any).hakiTypes?.forEach((t: string) => {
        const norm = t.toLowerCase()
        hakiTypeCounts[norm] = (hakiTypeCounts[norm]||0)+1
      })
      const ft = classifyFruit(c)
      if (ft) fruitTypeCounts[ft] = (fruitTypeCounts[ft]||0)+1
    })

  const crewConditions: GridCondition[] = Object.entries(crewCounts)
      .filter(([_, n]) => n >= MIN_GROUP)
      .map(([crew]) => ({
        id: `crew:${crew}`,
    name: `Crew: ${crew}`,
    description: `Characters from the crew ${crew}`,
        check: ch => ch.crew === crew
      }))

  const originConditions: GridCondition[] = Object.entries(originCounts)
      .filter(([_, n]) => n >= MIN_GROUP)
      .map(([origin]) => ({
        id: `origin:${origin}`,
    name: `Origin: ${origin}`,
    description: `Born in ${origin}`,
        check: ch => ch.origin === origin
      }))

    const hakiConditions: GridCondition[] = Object.entries(hakiTypeCounts)
      .filter(([_, n]) => n >= MIN_GROUP)
      .map(([type]) => {
        const label = type.charAt(0).toUpperCase()+type.slice(1)
        return {
          id: `haki:${type}`,
          name: `Haki: ${label}`,
          description: `Must have ${label} Haki`,
          check: ch => (ch as any).hakiTypes?.map((t:string)=>t.toLowerCase()).includes(type)
        } satisfies GridCondition
      })

    // Combinaciones de Haki (Armament + Observation, etc.) si hay suficientes que tengan ambos
    const hakiCombos: [string[], string][] = [
      [['armament','observation'],'Armament + Observation'],
      [['conqueror','armament'],'Conqueror + Armament'],
      [['conqueror','observation'],'Conqueror + Observation'],
      [['conqueror','armament','observation'],'All Three']
    ]
    hakiCombos.forEach(([types,label]) => {
      const count = charList.filter(c => {
        const set = new Set(((c as any).hakiTypes||[]).map((t:string)=>t.toLowerCase()))
        return types.every(t=>set.has(t))
      }).length
      if (count >= MIN_GROUP) {
        hakiConditions.push({
          id: `hakiCombo:${types.join('+')}`,
          name: `Haki: ${label}`,
          description: `Must have ${label}`,
          check: c => {
            const set = new Set(((c as any).hakiTypes||[]).map((t:string)=>t.toLowerCase()))
            return types.every(t=>set.has(t))
          }
        })
      }
    })

  const fruitConditions: GridCondition[] = Object.entries(fruitTypeCounts)
      .filter(([_, n]) => n >= MIN_GROUP)
      .map(([ft]) => ({
        id: `fruit:${ft}`,
    name: `Fruit: ${ft}`,
    description: `${ft} type users`,
        check: ch => classifyFruit(ch) === ft
      }))

    // Pool global priorizando variedad
    let pool: GridCondition[] = [
      ...crewConditions,
      ...originConditions,
      ...hakiConditions,
      ...fruitConditions
    ]

    // Si el pool es insuficiente (dataset pequeño), fallback a lógica anterior para no romper el juego
    if (pool.length < 6) {
      const fallback: GridCondition[] = [
        { id: 'origin_any', name: 'Origin (Any)', description: 'Has an origin', check: c => Boolean(c.origin) },
        { id: 'crew_any', name: 'Crew (Any)', description: 'Belongs to a crew', check: c => Boolean(c.crew) },
        { id: 'haki_any', name: 'Haki (Any)', description: 'Any Haki user', check: c => (c as any).hakiTypes?.length > 0 },
        { id: 'fruit_any', name: 'Fruit (Any)', description: 'Devil Fruit user', check: c => Boolean(c.devilFruit && c.devilFruit !== 'None') },
        { id: 'fruit_none', name: 'No Fruit', description: 'No Devil Fruit', check: c => !c.devilFruit || c.devilFruit === 'None' },
        { id: 'bounty_300m', name: 'Bounty ≥ 300M', description: 'Bounty ≥ 300M', check: c => Boolean(c.bounty && c.bounty >= 300_000_000) }
      ]
      pool = fallback
    }

    // Seleccionar 6 condiciones distintas priorizando 2 crew, 2 origin, 1 haki, 1 fruit cuando sea posible
    const pickRandom = <T,>(arr: T[], n: number) => {
      const copy = [...arr].sort(()=>Math.random()-0.5)
      return copy.slice(0, Math.min(n, copy.length))
    }
    let selection: GridCondition[] = []
    selection.push(...pickRandom(crewConditions,2))
    selection.push(...pickRandom(originConditions,2))
    selection.push(...pickRandom(hakiConditions,1))
    selection.push(...pickRandom(fruitConditions,1))
    // Si faltan hasta 6, rellenar con pool general
    if (selection.length < 6) {
      const ids = new Set(selection.map(c=>c.id))
      for (const c of pool.sort(()=>Math.random()-0.5)) {
        if (selection.length >= 6) break
        if (!ids.has(c.id)) { selection.push(c); ids.add(c.id) }
      }
    }
    // Si por algún motivo excedimos, recortar aleatoriamente
    selection = selection.sort(()=>Math.random()-0.5).slice(0,6)

    // Mezclar y asignar filas/columnas
    const shuffled = [...selection].sort(()=>Math.random()-0.5)
    setRowConditions(shuffled.slice(0,3))
    setColConditions(shuffled.slice(3,6))
  }, [])

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
      
      <div className="min-h-screen text-amber-100 relative">
        {/* Remove local gradient/SVG background to show global wallpaper; add subtle dark overlay for readability */}
        <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-black/65 via-black/55 to-black/70 -z-10" />
        {/* Header */}
        <div className="border-b border-amber-700/40 bg-[#042836]/70 backdrop-blur-sm sticky top-0 z-40 shadow-lg shadow-black/40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link 
                  href="/"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Home
                </Link>
                <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow">ONE PIECE TIC TAC TOE</h1>
              </div>
              <div className="flex gap-2">
                {variant !== 'menu' && (
                  <button
                    onClick={startNewGame}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-semibold shadow shadow-black/40 hover:brightness-110 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    New Game
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fondo propio eliminado para mostrar wallpaper global */}
        <div className="relative z-10 max-w-6xl mx-auto p-6">
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
          <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-yellow-500/30">
            
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
                                : 'bg-gradient-to-br from-purple-800 to-purple-900 border-purple-600/70 hover:border-yellow-400 hover:shadow-yellow-500/25'
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
                          <div className="w-full h-full flex flex-col items-center justify-center relative select-none">
                            {gameState.mode === 'setup' ? (
                              <>
                                <div className="text-3xl mb-1">🎯</div>
                                <div className="text-xs text-gray-300 font-semibold">Listo</div>
                              </>
                            ) : (
                              <>
                                <span className="text-5xl font-black text-yellow-300 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">?</span>
                                <span className="mt-1 text-[10px] font-extrabold tracking-wider text-yellow-200/90">ONE PIECE</span>
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
            <div className="bg-gray-800 rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col border-2 border-yellow-600 shadow-2xl relative">
              <button
                onClick={() => setShowPicker(false)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {selectedCell && (
                <div className="mb-4 p-4 bg-purple-900/30 rounded-lg border border-purple-600">
                  <p className="text-sm text-center text-white font-medium">
                    Necesitas: <span className="font-bold text-orange-400">{rowConditions[selectedCell.row]?.name}</span>
                    {' + '}
                    <span className="font-bold text-blue-400">{colConditions[selectedCell.col]?.name}</span>
                  </p>
                  {variant==='multi' && (
                    <p className="text-xs text-center text-gray-300 mt-1">
                      Tiempo restante: <span className="font-bold text-yellow-400">{gameState.timeLeft}s</span>
                    </p>
                  )}
                  {(() => {
                    const validCharacters = characters.filter(char => 
                      checkCharacterValidForCell(char, selectedCell.row, selectedCell.col)
                    )
                    return (
                      <p className="text-xs text-center text-green-300 mt-1">
                        Personajes válidos disponibles: <span className="font-bold">{validCharacters.length}</span>
                      </p>
                    )
                  })()}
                </div>
              )}

              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Escribe al menos 2 letras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 text-base font-medium"
                />
              </div>

              <div className="flex-1 overflow-y-auto rounded-md">
                {searchTerm.trim().length < 2 ? (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium">
                    Escribe al menos 2 letras para buscar.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-700/60">
                    {filteredCharacters.slice(0,150).map(character => (
                      <li key={character.name}>
                        <button
                          onClick={() => handleCharacterSelect(character)}
                          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-700/60 transition-colors text-left"
                        >
                          {character.imageUrl ? (
                            <img
                              src={character.imageUrl}
                              alt={character.name}
                              className="w-12 h-12 object-cover rounded-lg border-2 border-gray-600 shadow"
                              onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center border-2 border-gray-500">🏴‍☠️</div>
                          )}
                          <span className="font-semibold text-white text-sm tracking-wide">{character.name}</span>
                        </button>
                      </li>
                    ))}
                    {filteredCharacters.length === 0 && (
                      <li className="px-4 py-6 text-center text-gray-400 text-sm">Sin resultados</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center space-y-2 bg-gray-800/50 p-6 rounded-xl border border-gray-600">
          <h3 className="text-xl font-bold text-yellow-400 mb-3">📋 Reglas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300 font-medium">
            <p>🎯 Cada casilla necesita un personaje que cumpla AMBAS condiciones (fila + columna)</p>
            {variant==='multi' && <p>⏰ Tienes 30 segundos por turno para elegir tu personaje</p>}
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
