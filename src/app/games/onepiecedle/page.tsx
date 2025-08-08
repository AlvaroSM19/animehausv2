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

  useEffect(() => {
    const term = input.trim().toLowerCase()
    if (!term) { setFiltered([]); return }
    setFiltered(all.filter(c => c.name.toLowerCase().includes(term)).slice(0,8))
  }, [input, all])

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
    // Devil fruit equality (presence + name)
    const devilFruitMatch = (guess.devilFruit || '') === (target.devilFruit || '')
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
        <span className="text-[10px] uppercase tracking-wide opacity-80 mb-1">Origen</span>
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
    return (
      <div className={`px-3 py-2 rounded flex flex-col items-center justify-center min-w-[140px] ${color}`}>
        <span className="text-[10px] uppercase tracking-wide opacity-80 mb-1">Fruta</span>
        <span className="text-[10px] font-semibold text-center leading-tight line-clamp-3">{guess.devilFruit ? guess.devilFruit : 'Sin fruta'}</span>
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
    <div className="min-h-screen bg-gradient-to-b from-[#05344d] via-[#065e7c] to-[#f5d9a5] text-amber-100 flex flex-col">
      <div className="border-b border-amber-700/40 bg-[#042836]/70 backdrop-blur-sm sticky top-0 z-40 shadow shadow-black/40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm flex items-center gap-1 text-amber-300/80 hover:text-amber-100 transition-colors">
              <ArrowLeft className="w-4 h-4"/> Home
            </Link>
            <h1 className="text-lg font-extrabold tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">OnePiecedle</h1>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <button onClick={reset} className="px-3 py-1 rounded bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-semibold shadow shadow-black/40 hover:brightness-110 inline-flex items-center gap-1"><RotateCcw className="w-3 h-3"/>Reset</button>
            <button onClick={() => setShowHelp(s=>!s)} className="p-1 rounded hover:bg-amber-300/10"><HelpCircle className="w-5 h-5"/></button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto p-4 flex-1 flex flex-col">
        {showHelp && (
          <div className="mb-6 p-4 rounded-lg bg-[#06394f]/60 border border-amber-700/40 text-sm leading-relaxed shadow shadow-black/40">
            Adivina el personaje en máximo {MAX_ATTEMPTS} intentos. Verde = atributo coincide, Rojo = no coincide. En Bounty la cifra muestra el bounty del personaje que adivinaste y la flecha indica si el personaje objetivo tiene un bounty superior (flecha verde ↑), inferior (flecha roja ↓) o igual (✓). Si aciertas el personaje ganas inmediatamente.
          </div>
        )}

  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 text-[11px] uppercase tracking-wide text-amber-200/70">
          <div className="flex items-center gap-3 flex-wrap">
            <span>Intentos: {guesses.length} / {MAX_ATTEMPTS}</span>
            {gameState === 'won' && <span className="text-green-400 font-semibold">¡Ganaste!</span>}
            {gameState === 'lost' && target && <span className="text-red-400 font-semibold">Perdiste - Era {target.name}</span>}
          </div>
          <div className="flex items-center gap-2 flex-wrap text-[10px] normal-case">
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-600 inline-block"></span><span className="text-amber-200/80">Bien</span></div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-orange-500 inline-block"></span><span className="text-amber-200/80">Parcial</span></div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-600 inline-block"></span><span className="text-amber-200/80">Mal</span></div>
          </div>
        </div>

        {/* Input */}
        {gameState === 'playing' && guesses.length < MAX_ATTEMPTS && (
          <div className="mb-6 relative">
            <div className="flex items-center gap-2 bg-[#06394f]/60 border border-amber-700/40 rounded-lg px-3 py-2 shadow shadow-black/30">
              <Search className="w-5 h-5 text-amber-300/80"/>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Escribe un personaje..."
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
            <h2 className="text-xl font-bold text-green-400">¡Correcto! {target.name}</h2>
            <button onClick={reset} className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm inline-flex items-center gap-2"><RotateCcw className="w-4 h-4"/> Jugar de nuevo</button>
          </div>
        )}
        {gameState === 'lost' && target && (
          <div className="mt-8 p-6 rounded-lg bg-rose-500/15 border border-rose-500/40 text-center space-y-4 shadow shadow-black/40">
            <h2 className="text-xl font-bold text-red-400">Era {target.name}</h2>
            <button onClick={reset} className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm inline-flex items-center gap-2"><RotateCcw className="w-4 h-4"/> Reintentar</button>
          </div>
        )}
      </div>
    </div>
  )
}
