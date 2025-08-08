'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, HelpCircle, Trophy } from 'lucide-react'
import { getAllCharacters, type AnimeCharacter } from '../../../lib/anime-data'

// Simple compact Wordle-like game (5 letters, 6 attempts) using character names
const WORD_LENGTH = 5
const MAX_GUESSES = 6

type LetterState = 'correct' | 'present' | 'absent' | 'empty'
interface GuessLetter { letter: string; state: LetterState }

export default function MiniWordlePage() {
  const [targetCharacter, setTargetCharacter] = useState<AnimeCharacter | null>(null)
  const [targetWord, setTargetWord] = useState('')
  const [currentGuess, setCurrentGuess] = useState('')
  const [rows, setRows] = useState<GuessLetter[][]>([])
  const [rowIndex, setRowIndex] = useState(0)
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing')
  const [usedLetters, setUsedLetters] = useState<Map<string, LetterState>>(new Map())
  const [showHelp, setShowHelp] = useState(false)

  const validCharacters = useMemo(() => {
    return getAllCharacters().filter(c => {
      const n = c.name.replace(/\s+/g,'').toLowerCase()
      return n.length === WORD_LENGTH && /^[a-z]+$/.test(n)
    })
  }, [])

  const pickWord = useCallback(() => {
    if (!validCharacters.length) return
    const char = validCharacters[Math.floor(Math.random()*validCharacters.length)]
    const word = char.name.replace(/\s+/g,'').toLowerCase()
    setTargetCharacter(char)
    setTargetWord(word)
    setCurrentGuess('')
    setRows([])
    setRowIndex(0)
    setUsedLetters(new Map())
    setGameState('playing')
  }, [validCharacters])

  useEffect(() => { pickWord() }, [pickWord])

  const evaluateGuess = (guess: string): GuessLetter[] => {
    const res: GuessLetter[] = []
    const targetArr = targetWord.split('')
    const guessArr = guess.split('')

    // First pass exact
    for (let i=0;i<WORD_LENGTH;i++) {
      if (guessArr[i] === targetArr[i]) { res[i] = {letter: guessArr[i], state:'correct'}; targetArr[i] = '_' } else res[i] = {letter: guessArr[i], state:'absent'}
    }
    // Second pass present
    for (let i=0;i<WORD_LENGTH;i++) {
      if (res[i].state === 'correct') continue
      const idx = targetArr.indexOf(guessArr[i])
      if (idx !== -1) { res[i].state = 'present'; targetArr[idx] = '_' }
    }
    return res
  }

  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH || gameState !== 'playing') return
    const guess = currentGuess.toLowerCase()
    const evaluated = evaluateGuess(guess)
    setRows(prev => [...prev, evaluated])
    // update used letters conservatively
    setUsedLetters(prev => {
      const map = new Map(prev)
      evaluated.forEach(l => {
        const prevState = map.get(l.letter)
        if (l.state === 'correct' || (l.state === 'present' && prevState !== 'correct') || (!prevState)) {
          map.set(l.letter, l.state)
        }
      })
      return map
    })
    if (evaluated.every(l => l.state === 'correct')) {
      setGameState('won')
    } else if (rowIndex + 1 >= MAX_GUESSES) {
      setGameState('lost')
    } else {
      setRowIndex(r => r + 1)
    }
    setCurrentGuess('')
  }

  const handleKey = (k: string) => {
    if (gameState !== 'playing') return
    if (k === 'Enter') return submitGuess()
    if (k === 'Backspace') return setCurrentGuess(g => g.slice(0,-1))
    if (/^[a-zA-Z]$/.test(k) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(g => g + k.toLowerCase())
    }
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKey(e.key)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [handleKey, currentGuess, gameState])

  const onVirtualKey = (k:string) => handleKey(k)

  const getBg = (state: LetterState) => {
    switch (state) {
      case 'correct': return 'bg-green-600 border-green-500'
      case 'present': return 'bg-yellow-600 border-yellow-500'
      case 'absent': return 'bg-zinc-700 border-zinc-600 text-zinc-400'
      default: return 'bg-zinc-800 border-zinc-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05344d] via-[#065e7c] to-[#f5d9a5] text-amber-100">
      <div className="border-b border-amber-700/40 bg-[#042836]/70 backdrop-blur-sm sticky top-0 z-40 shadow shadow-black/40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm flex items-center gap-1 text-amber-300/80 hover:text-amber-100 transition-colors">
              <ArrowLeft className="w-4 h-4"/> Home
            </Link>
            <h1 className="text-lg font-extrabold tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">Mini Wordle</h1>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button onClick={pickWord} className="px-3 py-1 rounded bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-semibold shadow shadow-black/40 hover:brightness-110 text-xs inline-flex items-center gap-1">
              <RotateCcw className="w-3 h-3"/> Reset
            </button>
            <button onClick={() => setShowHelp(s => !s)} className="p-1 rounded hover:bg-amber-300/10">
              <HelpCircle className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {showHelp && (
          <div className="mb-6 p-4 rounded-lg bg-[#06394f]/60 border border-amber-700/40 text-sm leading-relaxed shadow shadow-black/40">
            Adivina el nombre del personaje (5 letras). Tienes {MAX_GUESSES} intentos.
            Verde = letra correcta en posición correcta. Amarillo = letra existe en otra posición.
          </div>
        )}

        {/* Grid */}
        <div className="grid gap-2 w-fit mx-auto mb-8" style={{gridTemplateColumns:`repeat(${WORD_LENGTH}, 3rem)`}}>
          {Array.from({length: MAX_GUESSES}).map((_, r) => {
            const row = rows[r] || []
            return Array.from({length: WORD_LENGTH}).map((_, c) => {
              let letter = row[c]?.letter || (r === rowIndex ? currentGuess[c] : '') || ''
              let state: LetterState = row[c]?.state || 'empty'
              return (
                <div key={r+'-'+c} className={`w-12 h-12 flex items-center justify-center font-semibold uppercase rounded border text-lg tracking-wide select-none transition-colors ${getBg(state)} shadow shadow-black/30` }>
                  {letter}
                </div>
              )
            })
          })}
        </div>

        {/* Keyboard */}
        <div className="space-y-2 max-w-xl mx-auto">
          {['qwertyuiop','asdfghjkl','zxcvbnm'].map(row => (
            <div key={row} className="flex justify-center gap-1">
              {row.split('').map(ch => {
                const u = usedLetters.get(ch)
                return (
                  <button key={ch} onClick={() => onVirtualKey(ch)} className={`px-3 py-2 rounded text-sm font-medium uppercase transition-colors border ${getBg(u || 'empty')} hover:brightness-110 shadow shadow-black/30`}>{ch}</button>
                )
              })}
              {row === 'zxcvbnm' && (
                <>
                  <button onClick={() => onVirtualKey('Backspace')} className="px-3 py-2 rounded text-sm font-medium uppercase bg-[#06394f] border border-amber-700/40 hover:brightness-110 shadow shadow-black/30">⌫</button>
                  <button onClick={() => onVirtualKey('Enter')} className="px-3 py-2 rounded text-sm font-medium uppercase bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-semibold shadow shadow-black/40 hover:brightness-110">Enter</button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Result */}
        {gameState !== 'playing' && targetCharacter && (
          <div className="mt-10 p-6 rounded-lg bg-[#06394f]/60 border border-amber-700/40 text-center space-y-4 shadow shadow-black/40">
            {gameState === 'won' ? (
              <div className="text-emerald-300 font-semibold text-lg flex items-center justify-center gap-2"><Trophy className="w-5 h-5"/> ¡Correcto!</div>
            ) : (
              <div className="text-rose-300 font-semibold text-lg">Perdiste</div>
            )}
            <div className="flex items-center gap-4 justify-center">
              <img src={targetCharacter.imageUrl} alt={targetCharacter.name} className="w-20 h-20 object-cover rounded"/>
              <div className="text-left">
                <p className="font-bold">{targetCharacter.name}</p>
                {targetCharacter.crew && <p className="text-xs text-zinc-400">{targetCharacter.crew}</p>}
              </div>
            </div>
            <button onClick={pickWord} className="px-4 py-2 rounded bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-semibold text-sm inline-flex items-center gap-2 shadow shadow-black/40 hover:brightness-110"><RotateCcw className="w-4 h-4"/> Jugar de nuevo</button>
          </div>
        )}
      </div>
    </div>
  )
}
