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
  const [showPreview, setShowPreview] = useState(false) // Vista previa solo después de aceptar reglas
  const [previewTimeLeft, setPreviewTimeLeft] = useState(2.5) // Tiempo restante de vista previa
  const [showRules, setShowRules] = useState(true) // Mostrar reglas antes de comenzar

  // Load best score from localStorage on client-side
  useEffect(() => {
    const saved = localStorage.getItem('gridGameBestScore')
    if (saved) {
      setBestScore(parseInt(saved))
    }
  }, [])

  // Vista previa inicial - mostrar todas las cartas por 2.5 segundos
  useEffect(() => {
    if (showPreview && !showRules) {
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
        // Mark both as matched and guarantee they remain visually flipped
        setCharacters(prev => 
          prev.map(card => 
            card.id === firstChoice.id || card.id === clickedCard.id
              ? { ...card, isMatched: true, isFlipped: true }
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
  {/* Removed internal background: we use global wallpaper */}
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
                Home
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

      {/* Pre-game Rules */}
      {showRules && (
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-lg mx-auto bg-[#06394f]/80 border border-amber-700/50 rounded-2xl p-8 shadow-xl shadow-black/50 backdrop-blur-sm space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent mb-2">Matching Rules</h2>
              <p className="text-sm text-amber-200/75 leading-relaxed mb-4">Memorize and find the 8 hidden matching pairs. A pair is formed when two cards share <span className="text-amber-300">any</span> of the following:</p>
              <ul className="list-disc list-inside text-sm text-amber-100/90 space-y-1 pl-1">
                <li>Same character (duplicate card)</li>
                <li>Same crew</li>
                <li>Same origin</li>
                <li>Identical Haki types set</li>
              </ul>
              <p className="text-xs text-amber-200/60 mt-4 leading-relaxed">Matched cards stay revealed and give you <span className="text-amber-300 font-semibold">+10 points</span>. Finish with the fewest moves & best time. Tip: characters from big crews or with fewer Haki types often create more overlaps.</p>
            </div>
            <button
              onClick={() => { setShowRules(false); startNewGame(); }}
              className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-semibold shadow shadow-black/40 hover:brightness-110 transition"
            >
              OK, Start Game
            </button>
          </div>
        </div>
      )}

      {/* Game Stats & Area (hidden until rules acknowledged) */}
      {!showRules && (
      <>
      <div className="container mx-auto px-4 py-4">
        <div className="mx-auto max-w-[760px]">
      {/* Preview message */}
          {showPreview && (
            <div className="bg-amber-500/20 border border-amber-400/40 backdrop-blur-sm rounded-lg p-4 mb-4 text-center">
              <div className="flex items-center justify-center gap-2 text-amber-200">
                <Timer className="w-5 h-5 animate-spin" />
        <span className="font-semibold">Memorize the cards - Preview ends in {previewTimeLeft.toFixed(1)}s</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center bg-[#06394f]/70 border border-amber-700/40 backdrop-blur-sm rounded-lg p-3 mb-6 shadow shadow-black/40">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <div>
                    <p className="text-xs uppercase tracking-wide text-amber-200/60">Best</p>
                  <p className="font-bold">{bestScore}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-blue-500" />
                <div>
                    <p className="text-xs uppercase tracking-wide text-amber-200/60">Time</p>
                  <p className="font-bold">{formatTime(time)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <p className="text-xs uppercase tracking-wide text-amber-200/60">Moves</p>
                <p className="font-bold">{moves}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-amber-200/60">Score</p>
                <p className="font-bold">{score}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="container mx-auto px-4 pb-12">
        <div className="mx-auto max-w-[760px]">
          <div className="w-full">
            <div className="grid grid-cols-4 gap-4 mb-8 w-[760px] mx-auto">
            {characters.map((character) => (
              <div
                key={character.id}
                onClick={() => handleCardClick(character)}
                className={`group aspect-square rounded-xl transition-transform duration-300 ${character.isMatched ? 'matched-card cursor-default' : 'cursor-pointer hover:scale-[1.02]'} ${showPreview ? 'cursor-default' : ''}`}
                style={{ perspective: '1000px' }}
              >
                <div className={`card-3d-wrapper transition-transform duration-500 ${
                  (character.isFlipped || character.isMatched || showPreview) ? 'rotate-y-180' : 'rotate-y-0'
                }`}>
                  {/* Back */}
                  <div className="card-face back rounded-xl overflow-hidden card-back-purple">
                    <div className="compass-ring" />
                    <div className="compass-needle" />
                    <div className="game-title">ONE PIECE</div>
                  </div>
                  {/* Front */}
                  <div className="card-face front rounded-xl overflow-hidden">
                    <div className="w-full h-full card-front-frame hover:shadow-lg shadow shadow-black/40 relative">
                      <img
                        src={character.imageUrl}
                        alt={character.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/placeholder-character.jpg' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-amber-100 font-semibold text-sm drop-shadow">{character.name}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!isPlaying && characters.every(card => card.isMatched) && (
              <div className="col-span-4 text-center bg-[#06394f]/80 backdrop-blur-sm border border-amber-700/50 rounded-xl p-8 shadow-lg shadow-black/50">
                <h2 className="text-2xl font-extrabold mb-4 text-amber-300 drop-shadow">Congratulations! 🎉</h2>
                <p className="text-amber-200/70 mb-4 text-sm">
                  Time {formatTime(time)} · Moves {moves} · Score {score}
                </p>
                <button
                  onClick={startNewGame}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-semibold shadow shadow-black/40 hover:brightness-110 transition"
                >
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
      </>
      )}
      </div>
    </div>
  )
}
