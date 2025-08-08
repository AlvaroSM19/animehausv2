'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { getAllCharacters, type AnimeCharacter, formatBounty, getRandomCharacter } from '../../../lib/anime-data'
import { ArrowLeft, RotateCcw, Trophy, Target, Search } from 'lucide-react'

interface AttributeResult {
  value: string
  status: 'correct' | 'partial' | 'wrong'
}

interface GuessEvaluation {
  character: AnimeCharacter
  crew: AttributeResult
  origin: AttributeResult
  bountyTier: AttributeResult
  haki: AttributeResult
  devilFruit: AttributeResult
  isTarget: boolean
}

const getBountyTier = (bounty: number | null): { label: string; tier: number } => {
  if (!bounty || bounty === 0) return { label: 'No Bounty', tier: 0 }
  if (bounty < 10_000_000) return { label: '<10M', tier: 1 }
  if (bounty < 100_000_000) return { label: '10M-99M', tier: 2 }
  if (bounty < 500_000_000) return { label: '100M-499M', tier: 3 }
  if (bounty < 1_000_000_000) return { label: '500M-999M', tier: 4 }
  return { label: '≥1B', tier: 5 }
}

const statusClasses: Record<AttributeResult['status'], string> = {
  correct: 'bg-green-500/20 border-green-500 text-green-300',
  partial: 'bg-yellow-500/20 border-yellow-500 text-yellow-300',
  wrong: 'bg-red-500/20 border-red-500 text-red-300'
}

export default function DeductionGamePage() {
  const allCharacters = useMemo(() => getAllCharacters(), [])
  const [target, setTarget] = useState<AnimeCharacter | null>(null)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [guesses, setGuesses] = useState<GuessEvaluation[]>([])
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing')
  const [bestAttempts, setBestAttempts] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('deduction-best')
      return v ? parseInt(v) : null
    }
    return null
  })

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return allCharacters.slice(0, 30)
    return allCharacters.filter(c => c.name.toLowerCase().includes(q)).slice(0, 30)
  }, [allCharacters, query])

  const startNew = () => {
    const newTarget = getRandomCharacter()
    setTarget(newTarget)
    setGuesses([])
    setGameState('playing')
    setQuery('')
    setSelectedId('')
  }

  useEffect(() => { startNew() }, [])

  const evaluateGuess = (character: AnimeCharacter): GuessEvaluation | null => {
    if (!target) return null

    const crew: AttributeResult = character.crew && target.crew && character.crew === target.crew
      ? { value: character.crew, status: 'correct' }
      : { value: character.crew || '—', status: 'wrong' }

    const origin: AttributeResult = character.origin && target.origin && character.origin === target.origin
      ? { value: character.origin, status: 'correct' }
      : { value: character.origin || '—', status: 'wrong' }

    const btGuess = getBountyTier(character.bounty)
    const btTarget = getBountyTier(target.bounty)
    let bountyStatus: AttributeResult['status'] = 'wrong'
    if (btGuess.tier === btTarget.tier) bountyStatus = 'correct'
    else if (Math.abs(btGuess.tier - btTarget.tier) === 1) bountyStatus = 'partial'
    const bountyTier: AttributeResult = { value: btGuess.label, status: bountyStatus }

    const haki: AttributeResult = character.haki === target.haki
      ? { value: character.haki ? 'Yes' : 'No', status: 'correct' }
      : { value: character.haki ? 'Yes' : 'No', status: 'wrong' }

    let devilFruitStatus: AttributeResult['status'] = 'wrong'
    if (!character.devilFruit && !target.devilFruit) devilFruitStatus = 'correct'
    else if (character.devilFruit && target.devilFruit) {
      devilFruitStatus = character.devilFruit === target.devilFruit ? 'correct' : 'partial'
    }
    const devilFruit: AttributeResult = { value: character.devilFruit ? character.devilFruit.split(' ')[0] : 'None', status: devilFruitStatus }

    return {
      character,
      crew,
      origin,
      bountyTier,
      haki,
      devilFruit,
      isTarget: character.id === target.id
    }
  }

  const submitGuess = () => {
    if (!selectedId) return
    const char = allCharacters.find(c => c.id === selectedId)
    if (!char) return
    if (guesses.some(g => g.character.id === char.id)) return

    const evaluation = evaluateGuess(char)
    if (!evaluation) return
    const newGuesses = [...guesses, evaluation]
    setGuesses(newGuesses)
    setQuery('')
    setSelectedId('')

    if (evaluation.isTarget) {
      setGameState('won')
      if (typeof window !== 'undefined') {
        if (!bestAttempts || newGuesses.length < bestAttempts) {
          localStorage.setItem('deduction-best', newGuesses.length.toString())
          setBestAttempts(newGuesses.length)
        }
      }
    }
  }

  const legendItem = (color: string, text: string) => (
    <div className="flex items-center gap-2 text-xs">
      <span className={`w-4 h-4 rounded border ${color}`}></span>
      <span className="text-muted-foreground">{text}</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Home
              </Link>
              <h1 className="text-2xl font-bold">Character Deduction</h1>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-400" /><span>Best: {bestAttempts ?? '—'}</span></div>
              <div className="flex items-center gap-2"><Target className="w-4 h-4 text-blue-400" /><span>Guesses: {guesses.length}</span></div>
              <button onClick={startNew} className="flex items-center gap-2 px-3 py-1 bg-muted rounded hover:bg-muted/80 text-sm font-medium">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
            {gameState === 'playing' && (
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">Selecciona un personaje</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Escribe para filtrar..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
                      list="characters-datalist"
                    />
                    <datalist id="characters-datalist">
                      {filtered.map(c => (
                        <option key={c.id} value={c.name} />
                      ))}
                    </datalist>
                  </div>
                  <select
                    className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                  >
                    <option value="">-- Lista rápida --</option>
                    {filtered.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={submitGuess}
                  disabled={!selectedId}
                  className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-40"
                >
                  Adivinar
                </button>
              </div>
            )}

          <div className="flex flex-wrap gap-4">
            {legendItem('bg-green-500/20 border border-green-500', 'Correcto')}
            {legendItem('bg-yellow-500/20 border border-yellow-500', 'Cerca / Parcial')}
            {legendItem('bg-red-500/20 border border-red-500', 'Incorrecto')}
          </div>

          <div className="overflow-x-auto border border-border rounded-lg bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="px-4 py-2 font-medium">Personaje</th>
                  <th className="px-4 py-2 font-medium">Crew</th>
                  <th className="px-4 py-2 font-medium">Origen</th>
                  <th className="px-4 py-2 font-medium">Bounty</th>
                  <th className="px-4 py-2 font-medium">Haki</th>
                  <th className="px-4 py-2 font-medium">Fruta</th>
                </tr>
              </thead>
              <tbody>
                {guesses.map(g => (
                  <tr key={g.character.id} className={g.isTarget ? 'ring-2 ring-green-500/60' : ''}>
                    <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap flex items-center gap-2">
                      <img src={g.character.imageUrl} alt={g.character.name} className="w-10 h-10 object-cover rounded" onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/images/characters/placeholder.svg'}} />
                      {g.character.name}
                    </td>
                    <td className={`px-4 py-2 whitespace-nowrap ${statusClasses[g.crew.status]} border`}>{g.crew.value}</td>
                    <td className={`px-4 py-2 whitespace-nowrap ${statusClasses[g.origin.status]} border`}>{g.origin.value}</td>
                    <td className={`px-4 py-2 whitespace-nowrap ${statusClasses[g.bountyTier.status]} border`}>{g.bountyTier.value}</td>
                    <td className={`px-4 py-2 whitespace-nowrap ${statusClasses[g.haki.status]} border`}>{g.haki.value}</td>
                    <td className={`px-4 py-2 whitespace-nowrap ${statusClasses[g.devilFruit.status]} border`}>{g.devilFruit.value}</td>
                  </tr>
                ))}
                {guesses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">Haz tu primera tentativa...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {gameState === 'won' && target && (
            <div className="p-6 bg-card border border-border rounded-lg text-center space-y-4">
              <h2 className="text-2xl font-bold text-green-400">¡Correcto! {target.name}</h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <img src={target.imageUrl} alt={target.name} className="w-40 h-40 object-cover rounded-lg border border-border" onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/images/characters/placeholder.svg'}} />
                <div className="text-left space-y-2 text-sm">
                  {target.crew && <p><span className="text-muted-foreground">Crew:</span> {target.crew}</p>}
                  {target.origin && <p><span className="text-muted-foreground">Origen:</span> {target.origin}</p>}
                  <p><span className="text-muted-foreground">Bounty:</span> {formatBounty(target.bounty)}</p>
                  <p><span className="text-muted-foreground">Haki:</span> {target.haki ? 'Sí' : 'No'}</p>
                  <p><span className="text-muted-foreground">Fruta:</span> {target.devilFruit || '—'}</p>
                  {target.hakiTypes?.length > 0 && <p><span className="text-muted-foreground">Tipos Haki:</span> {target.hakiTypes.join(', ')}</p>}
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <button onClick={startNew} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold">Jugar de nuevo</button>
                <Link href="/" className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold">Inicio</Link>
              </div>
              <p className="text-xs text-muted-foreground">Intentos: {guesses.length}{bestAttempts && bestAttempts === guesses.length && ' (Nuevo récord)'}</p>
            </div>
          )}

          <div className="p-6 bg-card border border-border rounded-lg text-sm space-y-3">
            <h3 className="font-semibold text-foreground">Cómo jugar</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Selecciona un personaje por intento.</li>
              <li>Las celdas verdes son coincidencias exactas.</li>
              <li>Amarillo indica cercanía (por ejemplo tier de bounty adyacente o fruta distinta pero ambos tienen).</li>
              <li>Rojo significa que no coincide.</li>
              <li>Ganas cuando adivinas el personaje objetivo.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
