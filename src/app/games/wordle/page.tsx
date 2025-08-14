 'use client'

import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft, RotateCcw, Trophy, Target, Brain, CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { getAllCharacters, type AnimeCharacter } from '../../../lib/anime-data'

type LetterState = 'correct' | 'present' | 'absent' | 'empty'
type GameState = 'playing' | 'won' | 'lost'

interface GuessLetter {
  letter: string
  state: LetterState
}

const WORD_LENGTH = 5
const MAX_GUESSES = 6

export default function WordlePage() {
  const [gameState, setGameState] = useState<GameState>('playing')
  const [currentGuess, setCurrentGuess] = useState('')
  const [guesses, setGuesses] = useState<GuessLetter[][]>([])
  const [currentRow, setCurrentRow] = useState(0)
  const [targetCharacter, setTargetCharacter] = useState<AnimeCharacter | null>(null)
  const [targetWord, setTargetWord] = useState('')
  const [usedLetters, setUsedLetters] = useState<Map<string, LetterState>>(new Map())
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('wordle-score') || '0')
    }
    return 0
  })
  const [gamesPlayed, setGamesPlayed] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('wordle-games') || '0')
    }
    return 0
  })

  // Get characters with names of exactly 5 letters
  const validCharacters = useMemo(() => {
    return getAllCharacters().filter(char => {
      const name = char.name.replace(/\s+/g, '').toLowerCase()
      return name.length === WORD_LENGTH && /^[a-z]+$/.test(name)
    })
  }, [])

  const initializeGame = () => {
    if (validCharacters.length === 0) return
    
    const randomChar = validCharacters[Math.floor(Math.random() * validCharacters.length)]
    const word = randomChar.name.replace(/\s+/g, '').toLowerCase()
    
    setTargetCharacter(randomChar)
    setTargetWord(word)
    setCurrentGuess('')
    setGuesses([])
    setCurrentRow(0)
    setUsedLetters(new Map())
    setGameState('playing')
    setShowHint(false)
  }

  const checkGuess = (guess: string): GuessLetter[] => {
    const result: GuessLetter[] = []
    const targetLetters = targetWord.split('')
    const guessLetters = guess.split('')
    
    // First pass: mark correct positions
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        result[i] = { letter: guessLetters[i], state: 'correct' }
        targetLetters[i] = '' // Mark as used
      } else {
        result[i] = { letter: guessLetters[i], state: 'absent' }
      }
    }
    
    // Second pass: mark present letters
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (result[i].state === 'absent') {
        const letterIndex = targetLetters.indexOf(guessLetters[i])
        if (letterIndex !== -1) {
          result[i].state = 'present'
          targetLetters[letterIndex] = '' // Mark as used
        }
      }
    }
    
    return result
  }

  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH || gameState !== 'playing') return
    
    const guessResult = checkGuess(currentGuess.toLowerCase())
    const newGuesses = [...guesses, guessResult]
    setGuesses(newGuesses)
    
    // Update used letters
    const newUsedLetters = new Map(usedLetters)
    guessResult.forEach(({ letter, state }) => {
      const currentState = newUsedLetters.get(letter)
      if (!currentState || 
          (currentState === 'absent' && (state === 'present' || state === 'correct')) ||
          (currentState === 'present' && state === 'correct')) {
        newUsedLetters.set(letter, state)
      }
    })
    setUsedLetters(newUsedLetters)
    
    // Check win condition
    if (currentGuess.toLowerCase() === targetWord) {
      setGameState('won')
      const newScore = score + (MAX_GUESSES - currentRow)
      const newGamesPlayed = gamesPlayed + 1
      setScore(newScore)
      setGamesPlayed(newGamesPlayed)
      if (typeof window !== 'undefined') {
        localStorage.setItem('wordle-score', newScore.toString())
        localStorage.setItem('wordle-games', newGamesPlayed.toString())
      }
    } else if (currentRow >= MAX_GUESSES - 1) {
      setGameState('lost')
      const newGamesPlayed = gamesPlayed + 1
      setGamesPlayed(newGamesPlayed)
      if (typeof window !== 'undefined') {
        localStorage.setItem('wordle-games', newGamesPlayed.toString())
      }
    }
    
    setCurrentGuess('')
    setCurrentRow(currentRow + 1)
  }

  const handleKeyPress = (key: string) => {
    if (gameState !== 'playing') return
    
    if (key === 'ENTER') {
      submitGuess()
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1))
    } else if (key.length === 1 && /^[a-zA-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key.toUpperCase())
    }
  }

  const resetGame = () => {
    initializeGame()
  }

  useEffect(() => {
    initializeGame()
  }, [validCharacters])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER')
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE')
      } else if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase())
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentGuess, gameState, currentRow])

  const getLetterStateClass = (state: LetterState) => {
    switch (state) {
      case 'correct': return 'bg-green-500 text-white border-green-500'
      case 'present': return 'bg-yellow-500 text-white border-yellow-500'
      case 'absent': return 'bg-gray-500 text-white border-gray-500'
      default: return 'bg-background border-border text-foreground'
    }
  }

  if (!targetCharacter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground animate-spin" />
          <p className="text-muted-foreground">Loading game...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Removed custom background: inherit global wallpaper */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" aria-hidden="true" />
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
              <h1 className="text-2xl font-bold text-foreground">Anime Wordle</h1>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Score: {score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span>Games: {gamesPlayed}</span>
              </div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                Hint
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Hint Section */}
          {showHint && (
            <div className="mb-6 p-4 bg-card border border-border rounded-lg">
              <h3 className="font-semibold mb-2 text-foreground">Character Hint:</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                {targetCharacter.crew && <p>• Crew: {targetCharacter.crew}</p>}
                {targetCharacter.origin && <p>• Origin: {targetCharacter.origin}</p>}
                {targetCharacter.bounty && <p>• Has bounty: {targetCharacter.bounty > 0 ? 'Yes' : 'No'}</p>}
                {targetCharacter.haki && <p>• Haki user: {targetCharacter.haki ? 'Yes' : 'No'}</p>}
              </div>
            </div>
          )}

          {/* Game Grid */}
          <div className="mb-6">
            {Array.from({ length: MAX_GUESSES }, (_, rowIndex) => (
              <div key={rowIndex} className="flex gap-2 mb-2">
                {Array.from({ length: WORD_LENGTH }, (_, colIndex) => {
                  let letter = ''
                  let state: LetterState = 'empty'
                  
                  if (rowIndex < guesses.length) {
                    // Past guess
                    letter = guesses[rowIndex][colIndex].letter
                    state = guesses[rowIndex][colIndex].state
                  } else if (rowIndex === currentRow && colIndex < currentGuess.length) {
                    // Current guess
                    letter = currentGuess[colIndex]
                  }
                  
                  return (
                    <div
                      key={colIndex}
                      className={`w-12 h-12 border-2 flex items-center justify-center text-lg font-bold rounded-lg transition-all duration-300 ${getLetterStateClass(state)}`}
                    >
                      {letter}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Virtual Keyboard */}
          <div className="space-y-2">
            {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1 justify-center">
                {rowIndex === 2 && (
                  <button
                    onClick={() => handleKeyPress('ENTER')}
                    className="px-3 py-2 bg-muted text-muted-foreground rounded text-sm font-medium hover:bg-muted/80 transition-colors"
                  >
                    ENTER
                  </button>
                )}
                {row.split('').map(letter => {
                  const letterState = usedLetters.get(letter.toLowerCase()) || 'empty'
                  return (
                    <button
                      key={letter}
                      onClick={() => handleKeyPress(letter)}
                      className={`w-8 h-10 text-sm font-medium rounded transition-all duration-300 ${getLetterStateClass(letterState)}`}
                    >
                      {letter}
                    </button>
                  )
                })}
                {rowIndex === 2 && (
                  <button
                    onClick={() => handleKeyPress('BACKSPACE')}
                    className="px-3 py-2 bg-muted text-muted-foreground rounded text-sm font-medium hover:bg-muted/80 transition-colors"
                  >
                    ⌫
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Game Result */}
          {gameState !== 'playing' && (
            <div className="mt-6 p-6 bg-card border border-border rounded-lg text-center">
              {gameState === 'won' ? (
                <>
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                  <h2 className="text-2xl font-bold mb-2 text-green-400">Congratulations!</h2>
                  <p className="text-muted-foreground mb-4">
                    You guessed <span className="font-bold text-foreground">{targetCharacter.name}</span> correctly!
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                  <h2 className="text-2xl font-bold mb-2 text-red-400">Game Over!</h2>
                  <p className="text-muted-foreground mb-4">
                    The answer was <span className="font-bold text-foreground">{targetCharacter.name}</span>
                  </p>
                </>
              )}
              
              {/* Character Info */}
              <div className="bg-background rounded-lg p-4 mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={targetCharacter.imageUrl}
                    alt={targetCharacter.name}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-character.jpg'
                    }}
                  />
                  <div className="text-left">
                    <h3 className="font-bold text-foreground">{targetCharacter.name}</h3>
                    {targetCharacter.crew && (
                      <p className="text-sm text-muted-foreground">{targetCharacter.crew}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300"
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
          )}

          {/* Instructions */}
          <div className="mt-8 text-center">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-foreground">How to Play</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Guess the One Piece character&apos;s name in {MAX_GUESSES} tries.</p>
                <p>Each guess must be a valid 5-letter name.</p>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded"></div>
                    <span>Correct letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                    <span>Wrong position</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-500 rounded"></div>
                    <span>Not in word</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
