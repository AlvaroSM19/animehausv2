'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, Clock, Trophy, Target } from 'lucide-react'
import { getAllCharacters, type AnimeCharacter } from '../../../lib/anime-data'

interface Question {
  id: string
  question: string
  answers: string[]
  category: string
}

interface GameState {
  currentQuestion: Question | null
  userAnswers: string[]
  correctAnswers: string[]
  timeLeft: number
  gameStatus: 'waiting' | 'playing' | 'finished'
  score: number
}

export default function CrewQuizPage() {
  const allCharacters = useMemo(() => getAllCharacters(), [])
  const [currentInput, setCurrentInput] = useState('')
  const [filteredSuggestions, setFilteredSuggestions] = useState<AnimeCharacter[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showVictoryAnimation, setShowVictoryAnimation] = useState(false)
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: null,
    userAnswers: [],
    correctAnswers: [],
    timeLeft: 0,
    gameStatus: 'waiting',
    score: 0
  })

  // Generate questions dynamically based on data
  const questions = useMemo(() => {
    // Dynamic generation
    const questions: Question[] = []
    
  // Group characters by crew
    const crewGroups = new Map<string, string[]>()
    allCharacters.forEach(char => {
      if (char.crew && char.crew.trim() !== '') {
        if (!crewGroups.has(char.crew)) {
          crewGroups.set(char.crew, [])
        }
        crewGroups.get(char.crew)!.push(char.name)
      }
    })

    // Create crew questions (min 3 members)
    crewGroups.forEach((members, crew) => {
      if (members.length >= 3) {
        questions.push({
      id: `crew-${crew}`,
      question: `Members of ${crew}`,
      answers: members,
      category: 'Crew'
        })
      }
    })

    // Group by origin
    const originGroups = new Map<string, string[]>()
    allCharacters.forEach(char => {
      if (char.origin && char.origin.trim() !== '') {
        if (!originGroups.has(char.origin)) {
          originGroups.set(char.origin, [])
        }
        originGroups.get(char.origin)!.push(char.name)
      }
    })

  // Create origin questions (min 4 members)
    originGroups.forEach((members, origin) => {
      if (members.length >= 4) {
        questions.push({
      id: `origin-${origin}`,
      question: `Characters from ${origin}`,
      answers: members,
      category: 'Origin'
        })
      }
    })

  // Special questions
    const specialQuestions: Question[] = [
      {
        id: 'yonko',
    question: 'The Four Emperors (Yonko)',
        answers: ['Monkey D. Luffy', 'Marshall D. Teach', 'Shanks', 'Buggy'],
    category: 'Special'
      },
      {
        id: 'admirals',
    question: 'Marine Admirals',
        answers: ['Sakazuki', 'Borsalino', 'Issho', 'Aramaki', 'Kuzan'],
    category: 'Special'
      },
      {
        id: 'supernova',
    question: 'The 11 Supernovas',
        answers: [
          'Monkey D. Luffy', 'Roronoa Zoro', 'Trafalgar D. Water Law', 
          'Eustass Kid', 'Killer', 'Basil Hawkins', 'X Drake', 
          'Scratchmen Apoo', 'Jewelry Bonney', 'Capone Bege', 'Urouge'
        ],
    category: 'Special'
      }
    ]

    questions.push(...specialQuestions)
    return questions
  }, [allCharacters])

  const startGame = () => {
    if (questions.length === 0) return
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
  const initialTime = Math.max(60, randomQuestion.answers.length * 5) // Minimum 60s, 5s per answer
    
    setGameState({
      currentQuestion: randomQuestion,
      userAnswers: [],
      correctAnswers: [],
      timeLeft: initialTime,
      gameStatus: 'playing',
      score: 0
    })
    setCurrentInput('')
    setShowVictoryAnimation(false)
    setShowSuggestions(false)
    setFilteredSuggestions([])
  }

  // Filter suggestions by input
  useEffect(() => {
    if (currentInput.trim().length > 0 && gameState.gameStatus === 'playing') {
      const filtered = allCharacters
        .filter(char => 
          char.name.toLowerCase().includes(currentInput.toLowerCase()) &&
          !gameState.correctAnswers.includes(char.name) &&
          !gameState.userAnswers.includes(char.name)
        )
        .slice(0, 8)
      
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setFilteredSuggestions([])
      setShowSuggestions(false)
    }
  }, [currentInput, gameState.correctAnswers, gameState.userAnswers, gameState.gameStatus, allCharacters])

  const submitAnswer = (selectedCharacter?: AnimeCharacter) => {
    if (!gameState.currentQuestion) return
    
    let characterToSubmit: AnimeCharacter | null = null
    
    if (selectedCharacter) {
      characterToSubmit = selectedCharacter
    } else {
      const input = currentInput.trim()
      if (input === '') return
      
  // Exact match by name
      characterToSubmit = allCharacters.find(char => 
        char.name.toLowerCase() === input.toLowerCase()
      ) || null
    }
    
    if (!characterToSubmit) {
      // Respuesta incorrecta: restar 3 segundos
      setGameState(prev => ({
        ...prev,
        userAnswers: [...prev.userAnswers, currentInput.trim()],
        timeLeft: Math.max(0, prev.timeLeft - 3)
      }))
      setCurrentInput('')
      return
    }
    
    const question = gameState.currentQuestion
    
  // Check if character is a valid answer
    const isCorrect = question.answers.includes(characterToSubmit.name)
    const alreadyAnswered = gameState.correctAnswers.some(answer => 
      allCharacters.find(char => char.name === answer)?.id === characterToSubmit.id
    )
    
    if (isCorrect && !alreadyAnswered) {
      const newCorrectAnswers = [...gameState.correctAnswers, characterToSubmit.name]
      const newScore = Math.round((newCorrectAnswers.length / question.answers.length) * 100)
      
      setGameState(prev => ({
        ...prev,
        correctAnswers: newCorrectAnswers,
        userAnswers: [...prev.userAnswers, characterToSubmit.name],
        score: newScore,
        timeLeft: prev.timeLeft + 5 // Bonus de 5 segundos por respuesta correcta
      }))
      
  // Check if 100% completed
      if (newCorrectAnswers.length === question.answers.length) {
        setShowVictoryAnimation(true)
        setTimeout(() => {
          setGameState(prev => ({ ...prev, gameStatus: 'finished' }))
          setShowVictoryAnimation(false)
        }, 3000) // Mostrar animación por 3 segundos
      }
    } else {
  // Incorrect or duplicate answer: subtract 3 seconds
      setGameState(prev => ({
        ...prev,
        userAnswers: [...prev.userAnswers, characterToSubmit.name],
        timeLeft: Math.max(0, prev.timeLeft - 3)
      }))
    }
    
    setCurrentInput('')
    setFilteredSuggestions([])
  }

  const resetGame = () => {
    setGameState({
      currentQuestion: null,
      userAnswers: [],
      correctAnswers: [],
      timeLeft: 0,
      gameStatus: 'waiting',
      score: 0
    })
    setCurrentInput('')
    setShowVictoryAnimation(false)
    setShowSuggestions(false)
    setFilteredSuggestions([])
  }

  // Timer effect
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }))
      }, 1000)
      return () => clearTimeout(timer)
    } else if (gameState.gameStatus === 'playing' && gameState.timeLeft === 0) {
      setGameState(prev => ({ ...prev, gameStatus: 'finished' }))
    }
  }, [gameState.timeLeft, gameState.gameStatus])

  const handleSubmit = () => {
    submitAnswer()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitAnswer()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = gameState.currentQuestion 
    ? Math.round((gameState.correctAnswers.length / gameState.currentQuestion.answers.length) * 100)
    : 0

  return (
    <div className="min-h-screen text-amber-100 relative">
      {/* Remove local gradient/SVG background to show global wallpaper; add subtle dark overlay for readability */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-black/65 via-black/55 to-black/70" />
      <div className="border-b border-amber-700/40 bg-[#042836]/70 backdrop-blur-sm sticky top-0 z-40 shadow shadow-black/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-amber-300/70 hover:text-amber-100 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Home
              </Link>
              <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                Crew Quiz
              </h1>
            </div>
            <div className="flex items-center gap-6 text-sm">
              {gameState.gameStatus === 'playing' && (
                <>
                  <div className="flex items-center gap-3 bg-[#042836]/80 px-6 py-3 rounded-lg border border-amber-700/40">
                    <Clock className="w-6 h-6 text-amber-300" />
                    <span className={`text-3xl font-bold ${gameState.timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-amber-100'}`}>
                      {formatTime(gameState.timeLeft)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-300" />
                    <span>{gameState.correctAnswers.length}/{gameState.currentQuestion?.answers.length || 0}</span>
                  </div>
                </>
              )}
              <button 
                onClick={gameState.gameStatus === 'waiting' ? startGame : resetGame} 
                className="flex items-center gap-2 px-3 py-1 rounded bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-semibold shadow shadow-black/40 hover:brightness-110 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                {gameState.gameStatus === 'waiting' ? 'Start' : 'New Game'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Victory Animation */}
          {showVictoryAnimation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="text-center space-y-6 animate-bounce">
                <div className="text-8xl animate-pulse">🎉</div>
                <h2 className="text-6xl font-extrabold text-yellow-300 animate-pulse drop-shadow-lg">
                  PERFECT!
                </h2>
                <div className="text-2xl text-emerald-300 font-bold">
                  100% Completed!
                </div>
                <div className="flex justify-center gap-4 text-4xl">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🏆</span>
                  <span className="animate-bounce" style={{ animationDelay: '100ms' }}>⭐</span>
                  <span className="animate-bounce" style={{ animationDelay: '200ms' }}>🎊</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>⭐</span>
                  <span className="animate-bounce" style={{ animationDelay: '400ms' }}>🏆</span>
                </div>
              </div>
              
              {/* Confetti effect */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random() * 2}s`
                    }}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      ['bg-yellow-400', 'bg-emerald-400', 'bg-blue-400', 'bg-red-400', 'bg-purple-400'][Math.floor(Math.random() * 5)]
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gameState.gameStatus === 'waiting' && (
            <div className="text-center space-y-6">
              <div className="p-8 bg-[#06394f]/60 border border-amber-700/40 rounded-lg shadow shadow-black/40">
                <Trophy className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-amber-200 mb-4">Crew Quiz!</h2>
                <p className="text-amber-200/80 mb-6 max-w-2xl mx-auto">
                  You will get a question about crews, origins or special One Piece groups. Type every character you can remember. You gain +5 seconds for each correct answer!
                </p>
                <button 
                  onClick={startGame}
                  className="px-8 py-3 rounded-lg bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-black font-semibold shadow shadow-black/40 hover:brightness-110 text-lg"
                >
                  Start Game
                </button>
                <div className="mt-6 text-sm text-amber-200/60">
                  Total available questions: {questions.length}
                </div>
              </div>
            </div>
          )}

          {gameState.gameStatus === 'playing' && gameState.currentQuestion && (
            <div className="space-y-6">
              {/* Question & progress bar */}
              <div className="p-6 bg-[#06394f]/60 border border-amber-700/40 rounded-lg shadow shadow-black/40">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-amber-200 mb-2">
                    {gameState.currentQuestion.question}
                  </h2>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm">
          {gameState.currentQuestion.category}
                  </span>
                </div>
                
        {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-amber-200/80 mb-2">
          <span>Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Autocomplete input */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="Type a character..."
                      className="w-full px-4 py-3 rounded-lg border border-amber-700/40 bg-[#042836]/60 focus:outline-none focus:ring-2 focus:ring-amber-400/40 backdrop-blur-sm"
                    />
                    
                    {/* Suggestions dropdown */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-[#042836]/90 border border-amber-700/40 rounded-lg mt-1 max-h-60 overflow-y-auto z-50 backdrop-blur-sm shadow-lg">
                        {filteredSuggestions.map((char) => (
                          <div
                            key={char.id}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-amber-500/20 cursor-pointer transition-colors"
                            onClick={() => {
                              submitAnswer(char)
                              setShowSuggestions(false)
                            }}
                          >
                            <img 
                              src={char.imageUrl} 
                              alt={char.name}
                              className="w-8 h-8 object-cover rounded-full border border-amber-500/40"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/images/characters/placeholder.svg'
                              }}
                            />
                            <div className="text-amber-100 font-medium text-sm flex-1">{char.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!currentInput.trim()}
                    className="px-6 py-3 rounded-lg bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-black font-semibold disabled:opacity-40 shadow shadow-black/40 hover:brightness-110"
                  >
          Submit
                  </button>
                </div>
              </div>

        {/* User answers */}
              {gameState.userAnswers.length > 0 && (
                <div className="p-6 bg-[#06394f]/40 border border-amber-700/40 rounded-lg shadow shadow-black/40">
          <h3 className="text-lg font-semibold text-amber-200 mb-4">Your answers:</h3>
                  <div className="flex flex-wrap gap-2">
                    {gameState.userAnswers.map((answer, index) => {
                      const isCorrect = gameState.correctAnswers.includes(answer)
                      const matchedChar = allCharacters.find(char => char.name === answer)
                      
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                            isCorrect
                              ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                              : 'bg-red-500/20 text-red-300 border border-red-500/40'
                          }`}
                        >
                          {matchedChar && (
                            <img 
                              src={matchedChar.imageUrl} 
                              alt={matchedChar.name}
                              className="w-5 h-5 object-cover rounded-full"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/images/characters/placeholder.svg'
                              }}
                            />
                          )}
                          <span>{answer}</span>
                          {!isCorrect && <span className="text-red-400 text-xs">(-3s)</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {gameState.gameStatus === 'finished' && gameState.currentQuestion && (
            <div className="space-y-6">
              <div className="p-8 bg-[#06394f]/60 border border-emerald-600/40 rounded-lg text-center shadow shadow-black/40">
                <h2 className="text-3xl font-bold text-emerald-300 mb-4">Time's up!</h2>
                <div className="text-6xl font-bold text-amber-300 mb-2">{gameState.score}%</div>
                <p className="text-amber-200/80 mb-6">
                  You found {gameState.correctAnswers.length} of {gameState.currentQuestion.answers.length} answers
                </p>
                
                {/* Show all correct answers */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-amber-200 mb-4">Correct answers:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {gameState.currentQuestion.answers.map((answer, index) => {
                      const wasFound = gameState.correctAnswers.includes(answer)
                      const character = allCharacters.find(char => char.name === answer)
                      
                      return (
                        <div
                          key={index}
                          className={`flex flex-col items-center p-3 rounded-lg border text-sm font-medium ${
                            wasFound
                              ? 'bg-green-500/20 text-green-300 border-green-500/40'
                              : 'bg-gray-500/20 text-gray-300 border-gray-500/40'
                          }`}
                        >
                          {character && (
                            <img 
                              src={character.imageUrl} 
                              alt={character.name}
                              className="w-12 h-12 object-cover rounded-full mb-2 border border-amber-500/40"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/images/characters/placeholder.svg'
                              }}
                            />
                          )}
                          <span className="text-center text-xs leading-tight">{answer}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={startGame}
                    className="px-6 py-3 rounded-lg bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-black font-semibold shadow shadow-black/40 hover:brightness-110"
                  >
                    Play again
                  </button>
                  <Link 
                    href="/"
                    className="px-6 py-3 rounded-lg bg-[#042836]/70 border border-amber-700/40 text-amber-200/90 font-semibold hover:brightness-110"
                  >
                    Home
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="p-6 bg-[#06394f]/50 border border-amber-700/40 rounded-lg text-sm space-y-3 backdrop-blur-sm shadow shadow-black/30">
            <h3 className="font-semibold text-amber-200 tracking-wide">How to Play</h3>
            <ul className="list-disc list-inside space-y-1 text-amber-200/70">
              <li>You get a question about a crew, origin or special group.</li>
              <li>Your goal is to find ALL characters in the database belonging to that category.</li>
              <li>Type a character name to see suggestions with photos.</li>
              <li>Correct answers (green) add +5 seconds.</li>
              <li>Wrong answers (red) subtract 3 seconds.</li>
              <li>Aim for 100% before the timer hits zero.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
