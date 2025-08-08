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
    <div className="min-h-screen bg-gradient-to-b from-[#0a141b] via-[#081018] to-[#050c12] text-foreground">
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
              <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow">Higher or Lower</h1>
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
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-8">
            {/* Current Character Card */}
            <div className="bg-[#101b24]/70 border border-amber-700/40 rounded-xl backdrop-blur-sm p-5 w-full md:w-72 lg:w-80 flex flex-col shadow-md shadow-black/50">
              <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-black/40 border border-amber-700/30 flex items-center justify-center">
                {currentCharacter && (
                  <img
                    src={currentCharacter.imageUrl}
                    alt={currentCharacter.name}
                    className="w-full h-full object-contain"
                    onError={(e) => { e.currentTarget.src = '/placeholder-character.jpg' }}
                  />
                )}
              </div>
              <div className="mt-4 text-center space-y-1">
                <h3 className="text-lg font-bold text-amber-300 tracking-wide">{currentCharacter?.name}</h3>
                {currentCharacter?.crew && (
                  <p className="text-xs uppercase tracking-wider text-amber-500/70">{currentCharacter.crew}</p>
                )}
                <div className="pt-2">
                  <div className="text-2xl font-extrabold text-emerald-400 drop-shadow">
                    {currentCharacter && formatBounty(currentCharacter.bounty)}
                  </div>
                  <p className="text-[11px] mt-1 text-amber-200/60 tracking-wide">Bounty Actual</p>
                </div>
              </div>
            </div>

            {/* Middle Choice Panel */}
            <div className="flex flex-col justify-center items-center gap-6 px-4 md:px-2 w-full md:w-auto">
              {!showResult && (
                <>
                  <div className="text-center max-w-xs">
                    <p className="text-sm md:text-base text-amber-200/70 leading-relaxed">
                      ¿La recompensa del siguiente pirata es <span className="text-emerald-400 font-semibold">más ALTA</span> o <span className="text-rose-400 font-semibold">más BAJA</span>?
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <button
                      onClick={() => makeChoice('higher')}
                      disabled={showResult}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-bold rounded-lg shadow-inner shadow-amber-900/40 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50"
                    >
                      <TrendingUp className="w-5 h-5" /> Higher
                    </button>
                    <button
                      onClick={() => makeChoice('lower')}
                      disabled={showResult}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 text-white font-bold rounded-lg shadow-inner shadow-rose-900/40 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50"
                    >
                      <TrendingDown className="w-5 h-5" /> Lower
                    </button>
                  </div>
                </>
              )}
              {showResult && (
                <div className="text-center space-y-4">
                  <div className={`text-4xl font-extrabold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'} drop-shadow`}> 
                    {isCorrect ? '¡Correcto!' : '¡Fallaste!'}
                  </div>
                  <p className="text-sm text-amber-200/70">
                    Elegiste <span className="font-semibold text-amber-300">{lastChoice}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Next Character Card */}
            <div className="bg-[#101b24]/70 border border-amber-700/40 rounded-xl backdrop-blur-sm p-5 w-full md:w-72 lg:w-80 flex flex-col shadow-md shadow-black/50">
              <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-black/40 border border-amber-700/30 flex items-center justify-center">
                {nextCharacter && (
                  <img
                    src={nextCharacter.imageUrl}
                    alt={nextCharacter.name}
                    className="w-full h-full object-contain"
                    onError={(e) => { e.currentTarget.src = '/placeholder-character.jpg' }}
                  />
                )}
              </div>
              <div className="mt-4 text-center space-y-1">
                <h3 className="text-lg font-bold tracking-wide {showResult ? 'text-amber-300' : 'text-amber-300'}">{nextCharacter?.name}</h3>
                {nextCharacter?.crew && (
                  <p className="text-xs uppercase tracking-wider text-amber-500/70">{nextCharacter.crew}</p>
                )}
                <div className="pt-2 min-h-[62px] flex flex-col items-center justify-start">
                  {!showResult && (
                    <div className="text-3xl font-extrabold text-amber-300/30 tracking-widest">???</div>
                  )}
                  {showResult && (
                    <div className={`text-2xl font-extrabold drop-shadow ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {nextCharacter && formatBounty(nextCharacter.bounty)}
                    </div>
                  )}
                  <p className="text-[11px] mt-1 text-amber-200/60 tracking-wide">Próxima Recompensa</p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-2 text-center">
            <div className="bg-[#101b24]/70 border border-amber-700/40 rounded-lg p-6 max-w-3xl mx-auto backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-3 text-amber-300 tracking-wide">Cómo Jugar</h3>
              <p className="text-sm text-amber-200/70 leading-relaxed">
                Observa la recompensa (bounty) del pirata actual y decide si la del siguiente será más alta o más baja. Si fallas termina la partida. Igualdad cuenta como acierto. ¡Sigue la racha para subir tu puntuación!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
