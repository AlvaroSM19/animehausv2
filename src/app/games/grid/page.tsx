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
  matchTag: string; // unique identifier for its matching pair
}

export default function GridGamePage() {
  // Build a solvable deck with 8 disjoint pairs: 2 per category (character, crew, origin, haki set).
  // Each pair gets a unique matchTag and matching only occurs when tags are equal.
  const buildDeck = (): GameCard[] => {
    const all = getAllCharacters()
    const shuffle = <T,>(arr: T[]) => arr.sort(() => Math.random() - 0.5)
    const usedChars = new Set<string>()
    const tagsUsed = new Set<string>()
    const deck: GameCard[] = []

    const pushPair = (a: AnimeCharacter, b: AnimeCharacter, tag: string) => {
      [a,b].forEach((c, i) => deck.push({
        ...c,
        id: `${c.id}-${tag}-${i}-${Math.random().toString(36).slice(2,6)}`,
        isFlipped: false,
        isMatched: false,
        matchTag: tag
      }))
      usedChars.add(a.id); usedChars.add(b.id); tagsUsed.add(tag)
    }

    // Helper for attribute pairs (crew/origin/haki)
    const buildAttributePairs = (count: number, keyFn: (c: AnimeCharacter)=>string|null, prefix: string) => {
      const groups = new Map<string, AnimeCharacter[]>()
      all.forEach((c) => {
        if (usedChars.has(c.id)) return
        const k = keyFn(c)
        if (!k) return
        if (!groups.has(k)) groups.set(k, [])
        groups.get(k)!.push(c)
      })
      const ordered: [string, AnimeCharacter[]][] = shuffle(Array.from(groups.entries()).filter(([, list]) => list.length >= 2))
      for (const [k, list] of ordered) {
        if (count <= 0) break
        if (tagsUsed.has(`${prefix}:${k}`)) continue
        const avail: AnimeCharacter[] = shuffle(list.filter(c => !usedChars.has(c.id)))
        if (avail.length < 2) continue
        pushPair(avail[0], avail[1], `${prefix}:${k}`)
        count--
      }
    }

    // Distribution: 45% haki (3.6→4), 25% crew (2), 15% origin (1.2→1), 15% identical (1.2→1)
    // 1) Haki pairs (45% = ~4 pairs)
    buildAttributePairs(4, c => c.hakiTypes.length ? c.hakiTypes.slice().sort().join('|') : null, 'haki')
    // 2) Crew pairs (25% = 2 pairs)
    buildAttributePairs(2, c => c.crew, 'crew')
    // 3) Origin pairs (15% = ~1 pair)
    buildAttributePairs(1, c => c.origin, 'origin')
    
    // 4) Character identical pairs (15% = ~1 pair)
    const charsPool = shuffle([...all])
    let charPairs = 0
    for (const c of charsPool) {
      if (charPairs >= 1) break
      if (usedChars.has(c.id)) continue
      pushPair(c, c, `char:${c.id}`)
      charPairs++
    }

    // Fallback fill with random duplicate character pairs if not enough
    const fillNeeded = 16 - deck.length
    if (fillNeeded > 0) {
      const pool = shuffle(all.filter(c => !usedChars.has(c.id)))
      for (let i=0; i<fillNeeded; i+=2) {
        const c = pool[i/2 % pool.length]
        pushPair(c, c, `char-extra:${c.id}:${i}`)
      }
    }

    return shuffle(deck)
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
  const [showPreview, setShowPreview] = useState(true) // Estado para la vista previa inicial
  const [previewTimeLeft, setPreviewTimeLeft] = useState(2.5) // Tiempo restante de vista previa

  // Load best score from localStorage on client-side
  useEffect(() => {
    const saved = localStorage.getItem('gridGameBestScore')
    if (saved) {
      setBestScore(parseInt(saved))
    }
  }, [])

  // Vista previa inicial - mostrar todas las cartas por 2.5 segundos
  useEffect(() => {
    if (showPreview) {
      setCanClick(false) // Deshabilitar clics durante la vista previa
      setPreviewTimeLeft(2.5) // Resetear contador
      
      // Contador regresivo
      const countdownTimer = setInterval(() => {
        setPreviewTimeLeft(prev => {
          const newTime = prev - 0.1
          if (newTime <= 0) {
            clearInterval(countdownTimer)
            return 0
          }
          return newTime
        })
      }, 100)
      
      // Timer principal para terminar la vista previa
      const timer = setTimeout(() => {
        setShowPreview(false)
        setCanClick(true) // Habilitar clics después de la vista previa
        clearInterval(countdownTimer)
      }, 2500)
      
      return () => {
        clearTimeout(timer)
        clearInterval(countdownTimer)
      }
    }
  }, [showPreview])

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
    setIsPlaying(false) // No empezar el juego hasta después de la vista previa
    setFirstChoice(null)
    setSecondChoice(null)
    setCanClick(false) // Deshabilitar clics durante la vista previa
    setShowPreview(true) // Activar la vista previa
    setPreviewTimeLeft(2.5) // Resetear contador de vista previa
  }

  const handleCardClick = (clickedCard: GameCard) => {
    if (!canClick || clickedCard.isFlipped || clickedCard.isMatched || showPreview) return
    if (!isPlaying) setIsPlaying(true) // Comenzar el juego en el primer clic

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

  // Match only if they share the same matchTag (ensures solvable unique pairing)
  const isMatch = firstChoice.matchTag === clickedCard.matchTag

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
    <div className="min-h-screen relative text-amber-100">
      {/* Memory Cards Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/memory-cards-bg.svg')`
          }}
        ></div>
        {/* Dark overlay to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/80"></div>
      </div>

      {/* Content with relative positioning */}
      <div className="relative z-10">
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
        <div className="max-w-3xl mx-auto">
          {/* Vista previa mensaje */}
          {showPreview && (
            <div className="bg-amber-500/20 border border-amber-400/40 backdrop-blur-sm rounded-lg p-4 mb-4 text-center">
              <div className="flex items-center justify-center gap-2 text-amber-200">
                <Timer className="w-5 h-5 animate-spin" />
                <span className="font-semibold">Memoriza las cartas - Tiempo restante: {previewTimeLeft.toFixed(1)}s</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center bg-[#06394f]/70 border border-amber-700/40 backdrop-blur-sm rounded-lg p-3 mb-6 shadow shadow-black/40">
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
        <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-6 items-start">
          {/* Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-4 gap-2 mb-8 max-w-md mx-auto">
            {characters.map((character) => (
              <div
                key={character.id}
                onClick={() => handleCardClick(character)}
                className={`aspect-square rounded-xl cursor-pointer transition-transform duration-300 ${character.isMatched ? 'opacity-60' : ''} ${showPreview ? 'cursor-default' : ''}`}
                style={{ perspective: '1000px' }}
              >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                  character.isFlipped || character.isMatched || showPreview ? 'rotate-y-180' : 'rotate-y-0'
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
                <li>Encuentra las 8 parejas ocultas en el tablero.</li>
              </ul>
              <ul className="mt-2 text-sm text-amber-100/90 space-y-1 pl-4 list-[square]">
                <li>Mismo personaje (carta duplicada).</li>
                <li>Misma tripulación.</li>
                <li>Mismo lugar de origen.</li>
                <li>Mismo conjunto de tipos de Haki.</li>
              </ul>
              <p className="text-xs text-amber-200/60 mt-3 leading-relaxed">Cuando dos cartas cumplen alguna de estas condiciones se quedan descubiertas y sumas puntos. Intenta completar el tablero en el menor número de movimientos.</p>
            </div>
            <div className="bg-[#06394f]/50 border border-amber-700/30 rounded-xl p-4 text-xs text-amber-200/60">
              Consejo: Personajes de grandes crews o con pocos tipos de haki ofrecen más posibilidades de emparejarse.
            </div>
          </aside>
        </div>
      </div>
      </div>
    </div>
  )
}
