'use client'

import { useState, useEffect } from 'react'
import './styles.css'
import { ArrowLeft, Shuffle, RotateCcw, Timer, Trophy } from 'lucide-react'
import Link from 'next/link'
import { getAllCharacters, getRandomCharacter, type AnimeCharacter } from '../../../lib/anime-data'

interface GameCard extends AnimeCharacter {
  id: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function GridGamePage() {
  // Build a deck with 8 pairs: 2 identical, 2 same crew, 2 same origin, 2 same exact haki types
  const buildDeck = (): GameCard[] => {
    const all = getAllCharacters()
    const shuffle = <T,>(arr: T[]) => arr.sort(() => Math.random() - 0.5)
    const usedIds = new Set<string>()
    const pairs: AnimeCharacter[][] = []

    // Helper to safely pick N pairs by predicate and equality function
    const pickPairs = (count: number, groupFn: (c: AnimeCharacter) => string | null, distinctCharacters: boolean) => {
      const groups = new Map<string, AnimeCharacter[]>()
      for (const c of shuffle([...all])) {
        const key = groupFn(c)
        if (!key) continue
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key)!.push(c)
      }
      const groupEntries = shuffle(Array.from(groups.entries()).filter(([_, list]) => list.length >= 2))
      for (const [_, list] of groupEntries) {
        if (pairs.length >= 8) break
        if (count <= 0) break
        const pool = shuffle(list.filter(c => !usedIds.has(c.id)))
        if (pool.length < 2) continue
        const a = pool[0]
        const b = pool[1]
        if (distinctCharacters && a.id === b.id) continue
        pairs.push([a, b])
        usedIds.add(a.id)
        usedIds.add(b.id)
        count--
      }
      return count
    }

    // 1) Two identical character pairs
    let remainingIdentical = 2
    const poolForIdentical = shuffle([...all])
    for (const c of poolForIdentical) {
      if (remainingIdentical <= 0) break
      pairs.push([c, c])
      remainingIdentical--
    }

    // 2) Two crew pairs
    pickPairs(2, c => c.crew, true)
    // 3) Two origin pairs
    pickPairs(2, c => c.origin, true)
    // 4) Two haki exact type pairs
    // Group by sorted haki types string (ignore empty)
    pickPairs(2, c => c.hakiTypes.length ? c.hakiTypes.slice().sort().join('|') : null, true)

    // Fallback: if we still don't have 8 pairs, fill with random identicals
    while (pairs.length < 8) {
      const c = all[Math.floor(Math.random() * all.length)]
      pairs.push([c, c])
    }

    const flat = shuffle(pairs).flat()
    return flat.map((char, index) => ({
      ...char,
      id: `${char.id}-${index}-${Math.random().toString(36).slice(2,7)}`,
      isFlipped: false,
      isMatched: false
    }))
  }

  const [characters, setCharacters] = useState<GameCard[]>(() => buildDeck())
  
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [firstChoice, setFirstChoice] = useState<GameCard | null>(null)
  const [secondChoice, setSecondChoice] = useState<GameCard | null>(null)
  const [canClick, setCanClick] = useState(true)

  // Load best score from localStorage on client-side
  useEffect(() => {
    const saved = localStorage.getItem('gridGameBestScore')
    if (saved) {
      setBestScore(parseInt(saved))
    }
  }, [])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (isPlaying) {
      timer = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying])

  const startNewGame = () => {
  const newDeck = buildDeck()
  setCharacters(newDeck)
    setScore(0)
    setMoves(0)
    setTime(0)
    setIsPlaying(true)
    setFirstChoice(null)
    setSecondChoice(null)
    setCanClick(true)
  }

  const handleCardClick = (clickedCard: GameCard) => {
    if (!canClick || clickedCard.isFlipped || clickedCard.isMatched) return
    if (!isPlaying) setIsPlaying(true)

    const newCards = characters.map(card => 
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    )

    setCharacters(newCards)

    if (firstChoice === null) {
      setFirstChoice(clickedCard)
    } else {
      setSecondChoice(clickedCard)
      setCanClick(false)
      setMoves(prev => prev + 1)

      // Helper to compare haki types exact set equality
      const sameHaki = (a: AnimeCharacter, b: AnimeCharacter) => {
        if (a.hakiTypes.length !== b.hakiTypes.length) return false
        const setA = new Set(a.hakiTypes)
        for (const t of b.hakiTypes) if (!setA.has(t)) return false
        return true
      }
      const isMatch = (
        firstChoice.name === clickedCard.name ||
        (!!firstChoice.crew && firstChoice.crew === clickedCard.crew) ||
        (firstChoice.origin && firstChoice.origin === clickedCard.origin) ||
        sameHaki(firstChoice, clickedCard)
      )

      if (isMatch) {
        setScore(prev => prev + 10)
        setCharacters(prev => 
          prev.map(card => 
            card.id === firstChoice.id || card.id === clickedCard.id
              ? { ...card, isMatched: true }
              : card
          )
        )
        setCanClick(true)
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setCharacters(prev => 
            prev.map(card => 
              card.id === firstChoice.id || card.id === clickedCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          )
          setCanClick(true)
        }, 1000)
      }
      setFirstChoice(null)
      setSecondChoice(null)
    }
  }

  // Check for game completion
  useEffect(() => {
    if (characters.every(card => card.isMatched)) {
      setIsPlaying(false)
      if (score > bestScore) {
        setBestScore(score)
        localStorage.setItem('gridGameBestScore', score.toString())
      }
    }
  }, [characters, score, bestScore])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
  <div className="min-h-screen bg-gradient-to-b from-[#05344d] via-[#065e7c] to-[#f5d9a5] text-amber-100">
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
                Inicio
              </Link>
              <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow">Memory Cards</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={startNewGame}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-semibold shadow shadow-black/40 hover:brightness-110 transition"
              >
                <RotateCcw className="w-4 h-4" />
                New Game
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Stats */}
  <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center bg-[#06394f]/70 border border-amber-700/40 backdrop-blur-sm rounded-lg p-4 mb-8 shadow shadow-black/40">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <div>
                    <p className="text-xs uppercase tracking-wide text-amber-200/60">Mejor</p>
                  <p className="font-bold">{bestScore}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-blue-500" />
                <div>
                    <p className="text-xs uppercase tracking-wide text-amber-200/60">Tiempo</p>
                  <p className="font-bold">{formatTime(time)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <p className="text-xs uppercase tracking-wide text-amber-200/60">Movs</p>
                <p className="font-bold">{moves}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-amber-200/60">Puntos</p>
                <p className="font-bold">{score}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
          {/* Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-4 gap-4 mb-8">
            {characters.map((character) => (
              <div
                key={character.id}
                onClick={() => handleCardClick(character)}
                className={`aspect-square rounded-xl cursor-pointer transition-transform duration-300 ${character.isMatched ? 'opacity-60' : ''}`}
                style={{ perspective: '1000px' }}
              >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                  character.isFlipped || character.isMatched ? 'rotate-y-180' : 'rotate-y-0'
                }`}>
                  {/* Back (default visible face with ?) */}
                  <div className="absolute w-full h-full backface-hidden flex items-center justify-center memory-card bg-gradient-to-br from-amber-500/10 to-transparent border border-dashed border-amber-500/30 rounded-xl">
                    <span className="question-mark text-amber-300 drop-shadow-lg select-none">?</span>
                  </div>
                  {/* Front (image) */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180">
                    <div className="w-full h-full bg-[#074860]/80 border border-amber-700/40 rounded-xl overflow-hidden hover:shadow-lg shadow shadow-black/40">
                      <div className="relative h-full">
                        <img
                          src={character.imageUrl}
                          alt={character.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = '/placeholder-character.jpg' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-amber-100 font-semibold text-sm drop-shadow">{character.name}</h3>
                          {character.crew && (
                            <p className="text-amber-200/70 text-[10px] uppercase tracking-wide">{character.crew}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!isPlaying && characters.every(card => card.isMatched) && (
              <div className="text-center bg-[#06394f]/70 border border-amber-700/40 rounded-xl p-8 shadow shadow-black/40">
                <h2 className="text-2xl font-extrabold mb-4 text-amber-300 drop-shadow">¡Felicidades! 🎉</h2>
                <p className="text-amber-200/70 mb-4 text-sm">
                  Tiempo {formatTime(time)} · Movimientos {moves} · Puntuación {score}
                </p>
                <button
                  onClick={startNewGame}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-semibold shadow shadow-black/40 hover:brightness-110 transition"
                >
                  <RotateCcw className="w-5 h-5" />
                  Jugar otra vez
                </button>
              </div>
            )}
            </div>
          </div>
          {/* Instructions */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-[#06394f]/70 border border-amber-700/40 rounded-xl p-5 shadow shadow-black/40">
              <h3 className="text-lg font-bold mb-3 text-amber-300 tracking-wide">Reglas de Emparejamiento</h3>
              <ul className="list-disc list-inside text-sm text-amber-200/80 space-y-1">
                <li>Da la vuelta a dos cartas cada turno.</li>
                <li>Se consideran pareja si se cumple AL MENOS una condición:</li>
              </ul>
              <ul className="mt-2 text-sm text-amber-100/90 space-y-1 pl-4 list-[square]">
                <li>Mismo personaje.</li>
                <li>Misma crew.</li>
                <li>Mismo origen.</li>
                <li>Exactamente los mismos tipos de Haki.</li>
              </ul>
              <p className="text-xs text-amber-200/60 mt-3 leading-relaxed">Cuando cumplen una de las condiciones se quedan descubiertas y sumas puntos. Intenta lograrlo en el menor número de movimientos.</p>
            </div>
            <div className="bg-[#06394f]/50 border border-amber-700/30 rounded-xl p-4 text-xs text-amber-200/60">
              Consejo: Personajes de grandes crews o con pocos tipos de haki ofrecen más posibilidades de emparejarse.
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
