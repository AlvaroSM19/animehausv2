'use client'

import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft, TrendingUp, TrendingDown, RotateCcw, Trophy, Target, Zap } from 'lucide-react'
import Link from 'next/link'
import { getAllCharacters, formatBounty, type AnimeCharacter } from '../../../lib/anime-data'

type GameState = 'playing' | 'game-over' | 'victory'
type Choice = 'higher' | 'lower'

export default function HigherLowerPage() {
  const [gameState, setGameState] = useState<GameState>('playing')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [currentCharacter, setCurrentCharacter] = useState<AnimeCharacter | null>(null)
  const [nextCharacter, setNextCharacter] = useState<AnimeCharacter | null>(null)
  const [usedCharacters, setUsedCharacters] = useState<Set<string>>(new Set())
  const [showResult, setShowResult] = useState(false)
  const [lastChoice, setLastChoice] = useState<Choice | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // Filter characters with bounties for the game
  const charactersWithBounties = useMemo(() => {
    return getAllCharacters().filter(char => 
      char.bounty !== null && char.bounty > 0
    )
  }, [])

  const getRandomUnusedCharacter = (): AnimeCharacter | null => {
    const availableCharacters = charactersWithBounties.filter(
      char => !usedCharacters.has(char.id)
    )
    
    if (availableCharacters.length === 0) {
      // Reset used characters if we've used them all
      setUsedCharacters(new Set())
      return charactersWithBounties[Math.floor(Math.random() * charactersWithBounties.length)]
    }
    
    return availableCharacters[Math.floor(Math.random() * availableCharacters.length)]
  }

  const initializeGame = () => {
    const firstChar = getRandomUnusedCharacter()
    const secondChar = getRandomUnusedCharacter()
    
    if (firstChar && secondChar) {
      setCurrentCharacter(firstChar)
      setNextCharacter(secondChar)
      setUsedCharacters(new Set([firstChar.id, secondChar.id]))
    }
  }

  const makeChoice = (choice: Choice) => {
    if (!currentCharacter || !nextCharacter || showResult) return

    const currentBounty = currentCharacter.bounty || 0
    const nextBounty = nextCharacter.bounty || 0
    
    let correct = false
    if (choice === 'higher' && nextBounty > currentBounty) correct = true
    if (choice === 'lower' && nextBounty < currentBounty) correct = true
    if (nextBounty === currentBounty) correct = true // Equal counts as correct

    setLastChoice(choice)
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      const newScore = score + 1
      const newStreak = streak + 1
      setScore(newScore)
      setStreak(newStreak)
      setMaxStreak(Math.max(maxStreak, newStreak))
      
      // Move to next round after showing result
      setTimeout(() => {
        setCurrentCharacter(nextCharacter)
        const newChar = getRandomUnusedCharacter()
        if (newChar) {
          setNextCharacter(newChar)
          setUsedCharacters(prev => {
            const newSet = new Set(prev)
            newSet.add(newChar.id)
            return newSet
          })
        }
        setShowResult(false)
        setLastChoice(null)
        setIsCorrect(null)
      }, 2000)
    } else {
      setStreak(0)
      setTimeout(() => {
        setGameState('game-over')
      }, 2000)
    }
  }

  const resetGame = () => {
    setGameState('playing')
    setScore(0)
    setStreak(0)
    setUsedCharacters(new Set())
    setShowResult(false)
    setLastChoice(null)
    setIsCorrect(null)
    initializeGame()
  }

  useEffect(() => {
    initializeGame()
  }, [])

  if (gameState === 'game-over') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-card border border-border rounded-xl text-center">
          <div className="text-6xl mb-4">💀</div>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Game Over!</h2>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-lg">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>Final Score: {score}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-lg">
              <Target className="w-5 h-5 text-blue-400" />
              <span>Best Streak: {maxStreak}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold text-foreground">Higher or Lower</h1>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Score: {score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400" />
                <span>Streak: {streak}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span>Best: {maxStreak}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Character */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="relative h-64">
                {currentCharacter && (
                  <>
                    <img
                      src={currentCharacter.imageUrl}
                      alt={currentCharacter.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-character.jpg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold">{currentCharacter.name}</h3>
                      {currentCharacter.crew && (
                        <p className="text-sm text-white/80">{currentCharacter.crew}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {currentCharacter && formatBounty(currentCharacter.bounty)}
                </div>
                <p className="text-muted-foreground">Current Bounty</p>
              </div>
            </div>

            {/* Next Character */}
            <div className="bg-card border border-border rounded-xl overflow-hidden relative">
              <div className="relative h-64">
                {nextCharacter && (
                  <>
                    <img
                      src={nextCharacter.imageUrl}
                      alt={nextCharacter.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-character.jpg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold">{nextCharacter.name}</h3>
                      {nextCharacter.crew && (
                        <p className="text-sm text-white/80">{nextCharacter.crew}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-6 text-center">
                {showResult ? (
                  <div className="space-y-4">
                    <div className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {nextCharacter && formatBounty(nextCharacter.bounty)}
                    </div>
                    <div className={`text-lg font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? '✅ Correct!' : '❌ Wrong!'}
                    </div>
                    <p className="text-muted-foreground">
                      You guessed {lastChoice}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-muted-foreground mb-2">???</div>
                    <p className="text-muted-foreground mb-6">
                      Is this bounty higher or lower?
                    </p>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={() => makeChoice('higher')}
                        disabled={showResult}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                      >
                        <TrendingUp className="w-5 h-5" />
                        Higher
                      </button>
                      <button
                        onClick={() => makeChoice('lower')}
                        disabled={showResult}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                      >
                        <TrendingDown className="w-5 h-5" />
                        Lower
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center">
            <div className="bg-card border border-border rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-2 text-foreground">How to Play</h3>
              <p className="text-muted-foreground">
                Look at the current character's bounty, then guess if the next character's bounty is higher or lower. 
                Get it wrong and the game ends! Characters won't repeat for 30 rounds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
