'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, HelpCircle, Search, ArrowUp, ArrowDown, Check } from 'lucide-react'
import { getAllCharacters, type AnimeCharacter } from '../../../lib/anime-data'

interface GuessEntry {
  character: AnimeCharacter
  result: AttributeResult
}

interface AttributeResult {
  crew: boolean | null
  origin: boolean | null
  haki: 'match' | 'partial' | 'none' | 'unknown'
  devilFruit: boolean | null
  bountyDir: 'up' | 'down' | 'equal' | 'unknown'
}

const MAX_ATTEMPTS = 10

export default function OnePiecedlePage() {
  const all = useMemo(() => getAllCharacters(), [])
  const [target, setTarget] = useState<AnimeCharacter | null>(null)
  const [input, setInput] = useState('')
  const [filtered, setFiltered] = useState<AnimeCharacter[]>([])
  const [guesses, setGuesses] = useState<GuessEntry[]>([])
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing')
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    const t = all[Math.floor(Math.random()*all.length)]
    setTarget(t)
  }, [all])

  // Build a set of already guessed character ids to avoid repeats
  const guessedIds = useMemo(() => new Set(guesses.map(g => g.character.id)), [guesses])

  useEffect(() => {
    const term = input.trim().toLowerCase()
    if (!term) { setFiltered([]); return }
    // Exclude already guessed characters
    setFiltered(
      all
        .filter(c => !guessedIds.has(c.id) && c.name.toLowerCase().includes(term))
        .slice(0,8)
    )
  }, [input, all, guessedIds])

  // Devil fruit type (general classification) in English
  const getDevilFruitType = (character: AnimeCharacter): string => {
    if (!character.devilFruit) return 'No Fruit'
    
    const fruit = character.devilFruit.toLowerCase()
    const name = character.name.toLowerCase()
    
    // Special official reclassification (Gomu Gomu no Mi -> Mythical Zoan: Nika)
    if (name.includes('luffy') || name.includes('monkey d. luffy')) {
      return 'Mythical Zoan'
    }
    
    // Other known Mythical Zoans
    if (fruit.includes('hito hito no mi') && !name.includes('chopper') ||
        fruit.includes('inu inu no mi') && fruit.includes('kyubi') ||
        fruit.includes('tori tori no mi') && fruit.includes('phoenix') ||
        fruit.includes('hebi hebi no mi') && fruit.includes('yamata') ||
        fruit.includes('uo uo no mi')) {
      return 'Mythical Zoan'
    }
    
    // Logia
    if (fruit.includes('mera mera') || fruit.includes('moku moku') || fruit.includes('suna suna') ||
        fruit.includes('goro goro') || fruit.includes('hie hie') || fruit.includes('yami yami') ||
        fruit.includes('pika pika') || fruit.includes('magu magu') || fruit.includes('numa numa') ||
        fruit.includes('gasu gasu') || fruit.includes('yuki yuki') || fruit.includes('beta beta')) {
      return 'Logia'
    }
    
    // Zoan regulares
    if (fruit.includes('hito hito') || fruit.includes('inu inu') || fruit.includes('neko neko') ||
        fruit.includes('zou zou') || fruit.includes('tori tori') || fruit.includes('uma uma') ||
        fruit.includes('ushi ushi') || fruit.includes('hebi hebi') || fruit.includes('mushi mushi') ||
        fruit.includes('ryu ryu') || fruit.includes('sara sara')) {
      return 'Zoan'
    }
    
    // Default Paramecia (most fruits)
    return 'Paramecia'
  }

  const evaluate = (guess: AnimeCharacter, target: AnimeCharacter): AttributeResult => {
    // Bounty direction relative to target bounty
    let bountyDir: AttributeResult['bountyDir'] = 'unknown'
    if (guess.bounty && target.bounty) {
      if (guess.bounty === target.bounty) bountyDir = 'equal'
      else if (target.bounty > guess.bounty) bountyDir = 'up'
      else bountyDir = 'down'
    }
    // Crew / Origin simple equality (null treated as value)
    const crewMatch = (guess.crew || '') === (target.crew || '')
    const originMatch = (guess.origin || '') === (target.origin || '')
    // Haki types overlap logic
    const gTypes = new Set(guess.hakiTypes.map(t => t.toLowerCase()))
    const tTypes = new Set(target.hakiTypes.map(t => t.toLowerCase()))
    let hakiStatus: AttributeResult['haki'] = 'unknown'
    if (gTypes.size === 0 && tTypes.size === 0) {
      hakiStatus = 'match'
    } else if (gTypes.size === 0 && tTypes.size > 0) {
      hakiStatus = 'none'
    } else {
      let overlap = 0
      gTypes.forEach(t => { if (tTypes.has(t)) overlap++ })
      if (overlap === 0) hakiStatus = 'none'
      else if (overlap === tTypes.size && gTypes.size === tTypes.size) hakiStatus = 'match'
      else hakiStatus = 'partial'
    }
    // Devil fruit type comparison instead of specific fruit names
    const devilFruitMatch = getDevilFruitType(guess) === getDevilFruitType(target)
    return {
      crew: crewMatch,
      origin: originMatch,
      haki: hakiStatus,
      devilFruit: devilFruitMatch,
      bountyDir
    }
  }

  const submit = (c: AnimeCharacter) => {
    if (!target || gameState !== 'playing') return
    if (guesses.length >= MAX_ATTEMPTS) return
    if (guessedIds.has(c.id)) return // prevent duplicate guess
    const res = evaluate(c, target)
    const entry: GuessEntry = { character: c, result: res }
    setGuesses(g => [entry, ...g])
    setInput('')
    setFiltered([])
    if (c.id === target.id) setGameState('won')
    else if (guesses.length + 1 >= MAX_ATTEMPTS) setGameState('lost')
  }

  const reset = () => {
    setTarget(all[Math.floor(Math.random()*all.length)])
    setGuesses([])
    setGameState('playing')
    setInput('')
    setFiltered([])
  }

  const crewBox = (guess: AnimeCharacter, match: boolean | null) => {
    const color = match ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    return (
      <div className={`px-3 py-2 rounded flex flex-col items-center justify-center min-w-[120px] ${color}`}>
        <span className="text-[10px] uppercase tracking-wide opacity-80 mb-1">Crew</span>
        <span className="text-[11px] font-semibold text-center leading-tight line-clamp-2">{guess.crew || '—'}</span>
      </div>
    )
  }

  const originBox = (guess: AnimeCharacter, match: boolean | null) => {
    const color = match ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    return (
      <div className={`px-3 py-2 rounded flex flex-col items-center justify-center min-w-[120px] ${color}`}>
        <span className="text-[10px] uppercase tracking-wide opacity-80 mb-1">Origin</span>
        <span className="text-[11px] font-semibold text-center leading-tight line-clamp-2">{guess.origin || '—'}</span>
      </div>
    )
  }

  const hakiBox = (guess: AnimeCharacter, status: AttributeResult['haki']) => {
    let color = 'bg-zinc-700 text-white'
    if (status === 'match') color = 'bg-green-600 text-white'
    else if (status === 'partial') color = 'bg-orange-500 text-white'
    else if (status === 'none') color = 'bg-red-600 text-white'
    const typesLower = guess.hakiTypes.map(t => t.toLowerCase())
    const icons: string[] = []
    if (typesLower.includes('conqueror')) icons.push('👑')
    if (typesLower.includes('observation')) icons.push('👁️')
    if (typesLower.includes('armament')) icons.push('🛡️')
    return (
      <div className={`px-3 py-2 rounded flex flex-col items-center justify-center min-w-[120px] ${color}`}>
        <span className="text-[10px] uppercase tracking-wide opacity-80 mb-1">Haki</span>
        <span className="text-sm font-semibold flex gap-1">{icons.length ? icons.join('') : '—'}</span>
      </div>
    )
  }

  const fruitBox = (guess: AnimeCharacter, match: boolean | null) => {
    const color = match ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    const fruitType = getDevilFruitType(guess)
    return (
      <div className={`px-3 py-2 rounded flex flex-col items-center justify-center min-w-[140px] ${color}`}>
        <span className="text-[10px] uppercase tracking-wide opacity-80 mb-1">Devil Fruit</span>
        <span className="text-[10px] font-semibold text-center leading-tight line-clamp-3">{fruitType}</span>
      </div>
    )
  }

  const bountyBox = (guess: AnimeCharacter, targetChar: AnimeCharacter | null, dir: AttributeResult['bountyDir']) => {
    const base = 'px-3 py-2 rounded flex flex-col items-center justify-center min-w-[140px]'
    let color = 'bg-zinc-700 text-zinc-200'
    let icon: JSX.Element | null = null
    let displayValue: string = guess.bounty ? guess.bounty.toLocaleString() : '—'

    // Caso 1: guess sin bounty, target con bounty => target es mayor (flecha arriba verde ya cubierto por dir==='up' pero queremos mostrar target bounty)
    if (!guess.bounty && targetChar?.bounty) {
      displayValue = targetChar.bounty.toLocaleString()
      color = 'bg-red-600 text-white'
      icon = <ArrowDown className="w-4 h-4" />
    // Caso 2: guess con bounty, target sin bounty => target es menor -> rojo flecha abajo
    } else if (guess.bounty && !targetChar?.bounty) {
      // mantenemos el bounty del guess
      color = 'bg-red-600 text-white'
      icon = <ArrowDown className="w-4 h-4" />
    } else {
      if (dir === 'up') { color = 'bg-green-600 text-white'; icon = <ArrowUp className="w-4 h-4"/> }
      else if (dir === 'down') { color = 'bg-red-600 text-white'; icon = <ArrowDown className="w-4 h-4"/> }
      else if (dir === 'equal') { color = 'bg-green-700 text-white'; icon = <Check className="w-4 h-4"/> }
    }
    return (
      <div className={`${base} ${color}`}>
        <span className="text-[10px] uppercase tracking-wide opacity-80 mb-1">Bounty</span>
        <div className="flex items-center gap-1 text-xs font-semibold">
          <span>{displayValue}</span>
          {icon}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-amber-100 flex flex-col relative">
      {/* Overlay solo para oscurecer el wallpaper. Lo mandamos detrás con -z-10 */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/55 to-black/70" />
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
              <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow">ONEPIECEDLE</h1>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <button onClick={() => setShowHelp(s=>!s)} className="p-1 rounded hover:bg-amber-300/10"><HelpCircle className="w-5 h-5"/></button>
              <button 
                onClick={reset} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-semibold shadow shadow-black/40 hover:brightness-110 transition"
              >
                <RotateCcw className="w-4 h-4" />
                New Game
              </button>
            </div>
          </div>
        </div>
      </div>

  <div className="w-full max-w-3xl mx-auto p-4 flex-1 flex flex-col relative z-10">
        {showHelp && (
          <div className="mb-6 p-4 rounded-lg bg-[#06394f]/60 border border-amber-700/40 text-sm leading-relaxed shadow shadow-black/40">
            Guess the target character in up to {MAX_ATTEMPTS} attempts. Green = attribute matches, Red = no match. For Bounty, the number shows the guessed character&apos;s bounty and the arrow shows if the target is higher (green ↑), lower (red ↓) or equal (✓). Correct character wins instantly.
          </div>
        )}

  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 text-sm md:text-base uppercase tracking-wide text-amber-100 font-bold">
          <div className="flex items-center gap-3 flex-wrap">
            <span>Attempts: {guesses.length} / {MAX_ATTEMPTS}</span>
            {gameState === 'won' && <span className="text-green-400 font-semibold">You Win!</span>}
            {gameState === 'lost' && target && <span className="text-red-400 font-semibold">You Lost - It was {target.name}</span>}
          </div>
          <div className="flex items-center gap-4 flex-wrap text-sm md:text-base normal-case font-semibold">
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-green-600 inline-block"></span><span className="text-green-300">Match</span></div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-orange-500 inline-block"></span><span className="text-orange-300">Partial</span></div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-red-600 inline-block"></span><span className="text-red-300">No Match</span></div>
          </div>
        </div>

        {/* Hints */}
        {gameState === 'playing' && target && (
          <div className="mb-4 flex flex-col gap-3">
            {guesses.length >= 4 && (
              <div className="relative w-40 h-40 mx-auto rounded-lg overflow-hidden ring-1 ring-amber-600/40">
                <img
                  src={target.imageUrl}
                  alt="Pista personaje"
                  className="w-full h-full object-cover filter blur-md brightness-75"
                  style={{ WebkitFilter: 'blur(12px)' }}
                />
              </div>
            )}
      {guesses.length >= 8 && guesses.length < MAX_ATTEMPTS && (
              <div className="px-3 py-2 text-center text-sm rounded-lg bg-[#06394f]/60 border border-amber-700/40 shadow shadow-black/30">
        <span className="text-amber-200/80">First letter hint: </span>
                <span className="font-bold text-amber-300">{target.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
        )}

        {/* Input */}
        {gameState === 'playing' && guesses.length < MAX_ATTEMPTS && (
          <div className="mb-6 relative">
            <div className="flex items-center gap-2 bg-[#06394f]/60 border border-amber-700/40 rounded-lg px-3 py-2 shadow shadow-black/30">
              <Search className="w-5 h-5 text-amber-300/80"/>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a character..."
                className="flex-1 bg-transparent outline-none text-sm placeholder-zinc-500"
              />
            </div>
            {filtered.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-[#042836]/95 backdrop-blur border border-amber-700/40 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filtered.map(c => (
                  <button key={c.id} onClick={() => submit(c)} className="w-full text-left px-3 py-2 text-sm hover:bg-amber-300/10 flex items-center gap-3">
                    <img src={c.imageUrl} alt={c.name} className="w-8 h-8 object-cover rounded"/>
                    <span>{c.name}</span>
                    {c.crew && <span className="ml-auto text-xs text-zinc-400">{c.crew}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Guesses table */}
        <div className="space-y-3 flex-1 overflow-y-auto pb-6">
          {guesses.map(g => (
            <div key={g.character.id} className="p-4 rounded-lg bg-[#06394f]/55 border border-amber-700/40 flex flex-col gap-3 shadow shadow-black/30">
              <div className="flex items-center gap-3">
                <img src={g.character.imageUrl} alt={g.character.name} className="w-14 h-14 object-cover rounded ring-1 ring-amber-600/40"/>
                <div className="flex flex-col">
                  <p className="font-semibold text-sm leading-tight">{g.character.name}</p>
                  {g.character.crew && <p className="text-[10px] text-amber-300/60 uppercase tracking-wide">{g.character.crew}</p>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {crewBox(g.character, g.result.crew)}
                {originBox(g.character, g.result.origin)}
                {bountyBox(g.character, target, g.result.bountyDir)}
                {hakiBox(g.character, g.result.haki)}
                {fruitBox(g.character, g.result.devilFruit)}
              </div>
            </div>
          ))}
        </div>

        {gameState === 'won' && target && (
          <div className="mt-8 p-6 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-center space-y-4 shadow shadow-black/40">
            <h2 className="text-xl font-bold text-green-400">Correct! {target.name}</h2>
            <button onClick={reset} className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm inline-flex items-center gap-2"><RotateCcw className="w-4 h-4"/> Play Again</button>
          </div>
        )}
        {gameState === 'lost' && target && (
          <div className="mt-8 p-6 rounded-lg bg-rose-500/15 border border-rose-500/40 text-center space-y-4 shadow shadow-black/40">
            <h2 className="text-xl font-bold text-red-400">It was {target.name}</h2>
            <button onClick={reset} className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm inline-flex items-center gap-2"><RotateCcw className="w-4 h-4"/> Retry</button>
          </div>
        )}
      </div>
    </div>
  )
}
