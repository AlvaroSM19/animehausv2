'use client'

import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft, TrendingUp, TrendingDown, RotateCcw, Trophy, Target, Zap } from 'lucide-react'
import Link from 'next/link'
import { getAllCharacters, formatBounty, type AnimeCharacter } from '../../../lib/anime-data'

type GameState = 'playing' | 'game-over' | 'victory'
type Choice = 'higher' | 'lower'

// Rank system based on score
const RANKS = [
  { name: 'Recluta de la Marina', minScore: 0, icon: '⚓', color: 'text-gray-400', bgColor: 'from-gray-800 to-gray-700', description: 'El primer paso en tu aventura pirata' },
  { name: 'Pirata de Fondo de Barril', minScore: 1, icon: '🏴‍☠️', color: 'text-amber-400', bgColor: 'from-amber-800 to-amber-700', description: 'Un pirata novato con potencial' },
  { name: 'Cazarrecompensas Novato', minScore: 3, icon: '🎯', color: 'text-green-400', bgColor: 'from-green-800 to-green-700', description: 'Cazando pequeñas recompensas' },
  { name: 'Tripulante Común', minScore: 5, icon: '⚔️', color: 'text-blue-400', bgColor: 'from-blue-800 to-blue-700', description: 'Miembro respetado de una tripulación' },
  { name: 'Oficial de la Marina', minScore: 8, icon: '🎖️', color: 'text-indigo-400', bgColor: 'from-indigo-800 to-indigo-700', description: 'Autoridad en los mares' },
  { name: 'Pirata de 50 Millones', minScore: 12, icon: '💰', color: 'text-yellow-400', bgColor: 'from-yellow-800 to-yellow-700', description: 'Tu primera gran recompensa' },
  { name: 'Capitán de Tripulación Menor', minScore: 17, icon: '👑', color: 'text-orange-400', bgColor: 'from-orange-800 to-orange-700', description: 'Liderando tu propia tripulación' },
  { name: 'Comandante de División', minScore: 23, icon: '🗡️', color: 'text-red-400', bgColor: 'from-red-800 to-red-700', description: 'Poder militar reconocido' },
  { name: 'Supernova', minScore: 30, icon: '⭐', color: 'text-purple-400', bgColor: 'from-purple-800 to-purple-700', description: 'Una nueva generación de piratas' },
  { name: 'Oficial del Ejército Revolucionario', minScore: 38, icon: '🔥', color: 'text-rose-400', bgColor: 'from-rose-800 to-rose-700', description: 'Luchando contra el Gobierno Mundial' },
  { name: 'Shichibukai', minScore: 47, icon: '👺', color: 'text-violet-400', bgColor: 'from-violet-800 to-violet-700', description: 'Corsario legal del gobierno' },
  { name: 'Vicealmirante', minScore: 57, icon: '🦅', color: 'text-cyan-400', bgColor: 'from-cyan-800 to-cyan-700', description: 'Alto mando de la Marina' },
  { name: 'Comandante de Yonko', minScore: 68, icon: '⚡', color: 'text-emerald-400', bgColor: 'from-emerald-800 to-emerald-700', description: 'Mano derecha de un Emperador' },
  { name: 'Almirante', minScore: 80, icon: '🌟', color: 'text-amber-300', bgColor: 'from-amber-700 to-yellow-600', description: 'La máxima autoridad naval' },
  { name: 'Yonko', minScore: 93, icon: '👑', color: 'text-gold-200', bgColor: 'from-yellow-600 to-amber-500', description: '¡Emperador de los mares!' },
]

const getCurrentRank = (score: number) => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (score >= RANKS[i].minScore) {
      return RANKS[i]
    }
  }
  return RANKS[0]
}

const getNextRank = (score: number) => {
  const currentRankIndex = RANKS.findIndex(rank => rank.minScore > score)
  return currentRankIndex !== -1 ? RANKS[currentRankIndex] : null
}

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
  const [previousRank, setPreviousRank] = useState<typeof RANKS[0] | null>(null)
  const [showRankUp, setShowRankUp] = useState(false)
  const [hoveredRank, setHoveredRank] = useState<string | null>(null)

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
      const currentRankBefore = getCurrentRank(score)
      const newScore = score + 1
      const newStreak = streak + 1
      const newRank = getCurrentRank(newScore)
      
      setScore(newScore)
      setStreak(newStreak)
      setMaxStreak(Math.max(maxStreak, newStreak))
      
      // Check for rank up animation
      if (currentRankBefore.name !== newRank.name) {
        setPreviousRank(currentRankBefore)
        setShowRankUp(true)
        setTimeout(() => setShowRankUp(false), 1000)
      }
      
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
    setPreviousRank(null)
    setShowRankUp(false)
    setHoveredRank(null)
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
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(251, 191, 36, 0.5); }
          50% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.8); }
        }
        
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-glow {
          animation: glow 2s infinite;
        }
        
        .animate-sparkle {
          animation: sparkle 1s infinite;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-amber-600\/50::-webkit-scrollbar-thumb {
          background: rgba(217, 119, 6, 0.5);
          border-radius: 10px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
      `}</style>
      
      <div className="min-h-screen relative text-foreground">
      {/* Higher Lower Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/higher-lower-bg.svg')`
          }}
        ></div>
        {/* Dark overlay to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85"></div>
      </div>

      {/* Content with relative positioning */}
      <div className="relative z-10">
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

      {/* Game Area with left rank summary, center game, right list */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left Rank Summary */}
          <aside className="xl:col-span-3 space-y-6 order-1">
            <div className="relative p-5 bg-gradient-to-br from-amber-800/40 to-yellow-800/30 rounded-xl border-2 border-amber-500/60 shadow-lg">
              <div className="text-center">
                <div className="text-4xl mb-2">{getCurrentRank(score).icon}</div>
                <div className={`font-bold text-lg ${getCurrentRank(score).color} drop-shadow`}>
                  {getCurrentRank(score).name}
                </div>
                <div className="text-xs text-amber-200/70 mt-1 italic">&quot;{getCurrentRank(score).description}&quot;</div>
                <div className="text-xs text-amber-300/80 mt-2 font-semibold">Rango Actual</div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 rounded-xl blur-sm -z-10" />
            </div>
            {getNextRank(score) && (
              <div className="relative p-5 bg-gradient-to-br from-blue-900/30 to-purple-900/20 rounded-xl border border-blue-500/40 shadow-lg">
                <div className="text-center">
                  <div className="text-3xl mb-2">{getNextRank(score)!.icon}</div>
                  <div className={`font-semibold text-sm ${getNextRank(score)!.color}`}>Próximo: {getNextRank(score)!.name}</div>
                  <div className="text-xs text-blue-200/60 mt-1">{getNextRank(score)!.minScore - score} puntos restantes</div>
                  <div className="mt-3 bg-gray-800/50 rounded-full h-3 border border-gray-600/30 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden" style={{ width: `${Math.min(100, (score / getNextRank(score)!.minScore) * 100)}%` }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Main Game Area */}
          <div className="xl:col-span-6 order-3 xl:order-2">
            <div className="flex flex-col gap-10">
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
                    <h3 className="text-lg font-bold tracking-wide text-amber-300">{nextCharacter?.name}</h3>
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

          {/* Rank System Panel (full list) */}
          <div className="xl:col-span-3 order-2 xl:order-3">
            <div className="bg-gradient-to-b from-amber-900/30 to-yellow-900/20 border border-amber-600/50 rounded-xl backdrop-blur-sm p-6 shadow-2xl shadow-black/50 sticky top-24 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 text-6xl rotate-12">⚓</div>
                <div className="absolute bottom-4 right-4 text-4xl -rotate-12">🏴‍☠️</div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">👑</div>
              </div>
              
              {/* Header */}
              <div className="relative z-10 text-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow">
                  ⭐ TABLA DE RANGOS ⭐
                </h3>
                <div className="mt-2 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>
              </div>
              
              {/* Current & Next rank panels moved to left side */}

              {/* Ranks List */}
              <div className="relative z-10 space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-600/50 scrollbar-track-transparent pr-2">
                {RANKS.map((rank, index) => {
                  const isCurrentRank = getCurrentRank(score).name === rank.name
                  const isAchieved = score >= rank.minScore
                  const isHovered = hoveredRank === rank.name
                  
                  return (
                    <div
                      key={rank.name}
                      className={`group relative flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-102 ${
                        isCurrentRank 
                          ? 'bg-gradient-to-r from-amber-800/60 to-yellow-800/50 border-2 border-amber-400/80 shadow-lg shadow-amber-500/20' 
                          : isAchieved 
                          ? `bg-gradient-to-r ${rank.bgColor}/40 border border-green-500/40 hover:border-green-400/60`
                          : 'bg-gray-900/30 border border-gray-600/30 hover:border-gray-500/50'
                      }`}
                      onMouseEnter={() => setHoveredRank(rank.name)}
                      onMouseLeave={() => setHoveredRank(null)}
                    >
                      {/* Rank Icon */}
                      <div className={`text-xl transition-transform duration-300 ${isCurrentRank ? 'animate-pulse' : ''} ${isHovered ? 'scale-125' : ''}`}>
                        {rank.icon}
                      </div>
                      
                      {/* Rank Info */}
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-bold transition-colors duration-300 ${
                          isCurrentRank ? 'text-amber-200' : isAchieved ? rank.color : 'text-gray-400'
                        } truncate`}>
                          {rank.name}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {rank.minScore} puntos
                        </div>
                        {/* Description on hover */}
                        {isHovered && (
                          <div className="text-xs text-gray-300 italic mt-1 animate-fadeIn">
                            {rank.description}
                          </div>
                        )}
                      </div>
                      
                      {/* Status Indicators */}
                      <div className="flex items-center gap-2">
                        {isCurrentRank && (
                          <div className="text-xs bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-900 px-2 py-1 rounded-full font-bold shadow-lg animate-pulse">
                            ACTUAL
                          </div>
                        )}
                        {isAchieved && !isCurrentRank && (
                          <div className="text-sm text-green-400 animate-bounce">✓</div>
                        )}
                        {!isAchieved && (
                          <div className="text-sm text-gray-600">🔒</div>
                        )}
                      </div>
                      
                      {/* Glow effect for current rank */}
                      {isCurrentRank && (
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 rounded-lg blur-sm animate-pulse"></div>
                      )}
                    </div>
                  )
                })}
              </div>
              
              {/* Achievement Progress */}
              <div className="relative z-10 mt-4 pt-4 border-t border-amber-600/30">
                <div className="text-center">
                  <div className="text-xs text-amber-300/80 font-semibold">
                    Progreso Total: {RANKS.filter(r => score >= r.minScore).length}/{RANKS.length}
                  </div>
                  <div className="mt-2 bg-gray-800/50 rounded-full h-2 border border-gray-600/30">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${(RANKS.filter(r => score >= r.minScore).length / RANKS.length) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rank Up Celebration Modal */}
      {showRankUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative bg-gradient-to-b from-amber-900/90 to-yellow-900/80 border-4 border-amber-400 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl transform animate-pulse">
            {/* Celebration particles */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute top-4 left-4 text-2xl animate-bounce delay-100">⭐</div>
              <div className="absolute top-8 right-6 text-xl animate-bounce delay-200">🎉</div>
              <div className="absolute bottom-6 left-8 text-lg animate-bounce delay-300">✨</div>
              <div className="absolute bottom-4 right-4 text-2xl animate-bounce delay-400">🏆</div>
              <div className="absolute top-1/2 left-2 text-lg animate-bounce delay-500">💫</div>
              <div className="absolute top-1/2 right-2 text-lg animate-bounce delay-600">🌟</div>
            </div>
            
            <div className="relative z-10">
              <div className="text-6xl mb-4 animate-bounce">
                {getCurrentRank(score).icon}
              </div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent mb-2">
                ¡RANGO ALCANZADO!
              </h2>
              
              <div className="text-xl font-semibold text-amber-300 mb-2">
                {getCurrentRank(score).name}
              </div>
              
              <div className="text-sm text-amber-200/80 italic mb-4">
                &quot;{getCurrentRank(score).description}&quot;
              </div>
              
              <div className="flex items-center justify-center gap-2 text-lg font-bold text-yellow-300">
                <Trophy className="w-6 h-6" />
                <span>Score: {score}</span>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-2xl blur-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
    </>
  )
}
