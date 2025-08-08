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
  const [characters, setCharacters] = useState<GameCard[]>(() => {
    const allChars = getAllCharacters()
    const selected = [...allChars].sort(() => Math.random() - 0.5).slice(0, 8)
    // Duplicate characters for matching pairs
    return [...selected, ...selected].sort(() => Math.random() - 0.5).map((char, index) => ({
      ...char,
      id: `${char.id}-${index}`,
      isFlipped: false,
      isMatched: false
    }))
  })
  
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('gridGameBestScore')
    return saved ? parseInt(saved) : 0
  })
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [firstChoice, setFirstChoice] = useState<GameCard | null>(null)
  const [secondChoice, setSecondChoice] = useState<GameCard | null>(null)
  const [canClick, setCanClick] = useState(true)

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
    const allChars = getAllCharacters()
    const selected = [...allChars].sort(() => Math.random() - 0.5).slice(0, 8)
    const newCards = [...selected, ...selected]
      .sort(() => Math.random() - 0.5)
      .map((char, index) => ({
        ...char,
        id: `${char.id}-${index}`,
        isFlipped: false,
        isMatched: false
      }))
    setCharacters(newCards)
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

      // Check for match
      if (firstChoice.name === clickedCard.name) {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Memory Match Game</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={startNewGame}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
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
          <div className="flex justify-between items-center bg-card rounded-lg p-4 mb-8">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Best Score</p>
                  <p className="font-bold">{bestScore}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-bold">{formatTime(time)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <p className="text-sm text-muted-foreground">Moves</p>
                <p className="font-bold">{moves}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="font-bold">{score}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-4 gap-4 mb-8">
            {characters.map((character) => (
              <div
                key={character.id}
                onClick={() => handleCardClick(character)}
                className={`aspect-square rounded-xl cursor-pointer transition-all duration-300 transform ${
                  character.isFlipped || character.isMatched ? 'rotate-0' : 'rotate-y-180'
                } ${character.isMatched ? 'opacity-60' : ''}`}
                style={{ perspective: '1000px' }}
              >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                  character.isFlipped || character.isMatched ? 'rotate-y-0' : 'rotate-y-180'
                }`}>
                  {/* Front of card */}
                  <div className={`absolute w-full h-full backface-hidden ${
                    character.isFlipped || character.isMatched ? 'visible' : 'invisible'
                  }`}>
                    <div className="w-full h-full bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg">
                      <div className="relative h-full">
                        <img
                          src={character.imageUrl}
                          alt={character.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-character.jpg'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-white font-semibold text-sm">{character.name}</h3>
                          {character.crew && (
                            <p className="text-white/80 text-xs">{character.crew}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Back of card */}
                  <div className={`absolute w-full h-full backface-hidden bg-primary/10 border-2 border-primary rounded-xl flex items-center justify-center ${
                    character.isFlipped || character.isMatched ? 'invisible' : 'visible'
                  }`}>
                    <span className="text-4xl">❔</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isPlaying && characters.every(card => card.isMatched) && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">¡Felicidades! 🎉</h2>
              <p className="text-muted-foreground mb-4">
                Has completado el juego en {formatTime(time)} con {moves} movimientos y una puntuación de {score} puntos.
              </p>
              <button
                onClick={startNewGame}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Jugar otra vez
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
