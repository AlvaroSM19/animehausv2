'use client'

import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft, RotateCcw, Timer, Trophy, Target } from 'lucide-react'
import Link from 'next/link'
import { getAllCharacters, type AnimeCharacter } from '../../../lib/anime-data'

interface GameRound {
  characters: AnimeCharacter[]
  category: string
  impostorIndex: number
  isCompleted: boolean
  isCorrect?: boolean
}

const CATEGORIES = [
  { name: 'High Bounty Characters (1B+)', filter: (c: AnimeCharacter) => (c.bounty || 0) >= 1000000000, minCount: 10 },
  { name: 'Haki Users', filter: (c: AnimeCharacter) => c.haki, minCount: 15 },
  { name: 'Devil Fruit Users', filter: (c: AnimeCharacter) => !!c.devilFruit, minCount: 15 },
  { name: 'Straw Hat Pirates', filter: (c: AnimeCharacter) => c.crew === 'Straw Hat Pirates', minCount: 8 },
  { name: 'Marine Officers', filter: (c: AnimeCharacter) => c.crew === 'Marines', minCount: 10 },
  { name: 'East Blue Natives', filter: (c: AnimeCharacter) => c.origin === 'East Blue', minCount: 8 },
  { name: 'Grand Line Natives', filter: (c: AnimeCharacter) => c.origin === 'Grand Line', minCount: 8 },
  { name: 'Conqueror\'s Haki Users', filter: (c: AnimeCharacter) => c.hakiTypes.includes('Conqueror\'s Haki'), minCount: 5 }
]

export default function ImpostorGamePage() {
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [time, setTime] = useState(15)
  const [gameState, setGameState] = useState<'playing' | 'game-over' | 'feedback'>('playing')
  const [currentRound, setCurrentRound] = useState<GameRound | null>(null)
  const [bestScore, setBestScore] = useState(0)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null)

  const allCharacters = useMemo(() => getAllCharacters(), [])

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('impostorGameBestScore')
    if (saved) {
      setBestScore(parseInt(saved))
    }
  }, [])

  // Timer countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (gameState === 'playing' && time > 0) {
      timer = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            // Time's up - game over
            endGame()
            return 15
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameState, time])

  const generateRound = (): GameRound => {
    // Pick a random category that has enough characters
    const validCategories = CATEGORIES.filter(cat => 
      allCharacters.filter(cat.filter).length >= cat.minCount
    )
    const category = validCategories[Math.floor(Math.random() * validCategories.length)]
    
    // Get characters that match the category
    const matchingChars = allCharacters.filter(category.filter)
    // Get characters that don't match
    const nonMatchingChars = allCharacters.filter(c => !category.filter(c))
    
    // Pick 4 matching characters
    const shuffledMatching = [...matchingChars].sort(() => Math.random() - 0.5)
    const selectedMatching = shuffledMatching.slice(0, 4)
    
    // Pick 1 impostor (non-matching)
    const shuffledNonMatching = [...nonMatchingChars].sort(() => Math.random() - 0.5)
    const impostor = shuffledNonMatching[0]
    
    // Combine and shuffle
    const allSelected = [...selectedMatching, impostor]
    const shuffled = allSelected.sort(() => Math.random() - 0.5)
    const impostorIndex = shuffled.indexOf(impostor)
    
    return {
      characters: shuffled,
      category: category.name,
      impostorIndex,
      isCompleted: false
    }
  }

  const startNewGame = () => {
    setScore(0)
    setStreak(0)
    setTime(15)
    setGameState('playing')
    setLastAnswerCorrect(null)
    setCurrentRound(generateRound())
  }

  const handleCharacterClick = (index: number) => {
    if (!currentRound || gameState !== 'playing') return
    
    const isCorrect = index === currentRound.impostorIndex
    setLastAnswerCorrect(isCorrect)
    
    if (isCorrect) {
      // Correct answer - continue with next round
      const points = Math.max(1, Math.floor(time / 3)) // Bonus for speed
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
      setGameState('feedback')
      
      // Show feedback briefly then continue
      setTimeout(() => {
        setCurrentRound(generateRound())
        setTime(15)
        setGameState('playing')
        setLastAnswerCorrect(null)
      }, 1500)
    } else {
      // Wrong answer - game over
      setGameState('feedback')
      setTimeout(() => {
        endGame()
      }, 2000)
    }
  }

  const endGame = () => {
    setGameState('game-over')
    if (score > bestScore) {
      setBestScore(score)
      localStorage.setItem('impostorGameBestScore', score.toString())
    }
  }

  useEffect(() => {
    if (!currentRound) {
      setCurrentRound(generateRound())
    }
  }, [])

  const formatTime = (seconds: number): string => {
    return `0:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen text-amber-100 relative">
      {/* Remove SVG/gradient background; rely on global wallpaper with subtle overlay for readability */}
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
              <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow">IMPOSTOR</h1>
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
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#06394f]/70 border border-amber-700/40 backdrop-blur-sm rounded-lg p-4 shadow shadow-black/40 text-center">
              <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-xs uppercase tracking-wide text-amber-200/60">Score</p>
              <p className="text-2xl font-bold">{score}</p>
            </div>
            <div className="bg-[#06394f]/70 border border-amber-700/40 backdrop-blur-sm rounded-lg p-4 shadow shadow-black/40 text-center">
              <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-xs uppercase tracking-wide text-amber-200/60">Streak</p>
              <p className="text-2xl font-bold">{streak}</p>
            </div>
            <div className="bg-[#06394f]/70 border border-amber-700/40 backdrop-blur-sm rounded-lg p-4 shadow shadow-black/40 text-center">
              <Timer className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-xs uppercase tracking-wide text-amber-200/60">Time</p>
              <p className="text-2xl font-bold">{formatTime(time)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {gameState === 'game-over' ? (
            <div className="text-center bg-[#06394f]/70 border border-amber-700/40 rounded-xl p-8 shadow shadow-black/40">
              <h2 className="text-3xl font-extrabold mb-4 text-amber-300 drop-shadow">Game Over!</h2>
              <p className="text-xl text-amber-200/70 mb-2">Final Score: {score}</p>
              <p className="text-lg text-amber-200/70 mb-2">Streak: {streak}</p>
              <p className="text-lg text-amber-200/70 mb-6">Best Score: {bestScore}</p>
              <button
                onClick={startNewGame}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-semibold shadow shadow-black/40 hover:brightness-110 transition"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          ) : gameState === 'feedback' ? (
            <div className="text-center bg-[#06394f]/70 border border-amber-700/40 rounded-xl p-8 shadow shadow-black/40">
              {lastAnswerCorrect ? (
                <>
                  <h2 className="text-3xl font-bold mb-4 text-green-400">Correct! ✓</h2>
                  <p className="text-amber-200/70">+{Math.max(1, Math.floor(time / 3))} points</p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-4 text-red-400">Wrong! ✗</h2>
                  <p className="text-amber-200/70">Game Over</p>
                </>
              )}
            </div>
          ) : currentRound ? (
            <>
              {/* Category Display */}
              <div className="text-center mb-8">
                <div className="bg-[#06394f]/70 border border-amber-700/40 rounded-xl p-6 shadow shadow-black/40">
                  <h2 className="text-xl font-bold text-amber-300 mb-2">Find the impostor among:</h2>
                  <h3 className="text-2xl font-bold text-yellow-400">{currentRound.category}</h3>
                </div>
              </div>

              {/* Characters Grid */}
              <div className="grid grid-cols-5 gap-4 max-w-4xl mx-auto">
                {currentRound.characters.map((character, index) => (
                  <div
                    key={`${character.id}-${index}`}
                    onClick={() => handleCharacterClick(index)}
                    className="group cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    <div className="bg-[#074860]/80 border-2 border-amber-700/40 rounded-xl overflow-hidden shadow shadow-black/40 group-hover:border-amber-500/60 group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all">
                      <div className="aspect-square relative">
                        <img
                          src={character.imageUrl}
                          alt={character.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-character.jpg'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      </div>
                      <div className="p-3 text-center">
                        <h3 className="text-amber-100 font-semibold text-sm drop-shadow truncate">{character.name}</h3>
                        <p className="text-amber-200/70 text-xs uppercase tracking-wide">One Piece</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="mt-8 text-center">
                <p className="text-amber-200/80 text-sm mb-2">
                  Click on the character that doesn&apos;t belong to the group above!
                </p>
                <p className="text-amber-300/60 text-xs">
                  ⚠️ One wrong answer and the game ends! Try to get the highest streak possible.
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
