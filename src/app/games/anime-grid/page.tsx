'use client'

import { useState, useEffect } from 'react'
import { getAllCharacters, type AnimeCharacter } from '../../../lib/anime-data'
import { Search, RotateCcw, Trophy, Target, Check, X } from 'lucide-react'

export default function AnimeGridPage() {
  const [characters, setCharacters] = useState<AnimeCharacter[]>([])
  const [grid, setGrid] = useState<(AnimeCharacter | null)[][]>(() => 
    Array(3).fill(null).map(() => Array(3).fill(null))
  )
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [score, setScore] = useState(0)

  const rowConditions = ['Marine', 'Pirata', 'Haki']
  const colConditions = ['Fruta del Diablo', 'Espadachín', 'Recompensa Alta']

  useEffect(() => {
    setCharacters(getAllCharacters())
  }, [])

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col]) return
    setSelectedCell({ row, col })
    setShowPicker(true)
  }

  const handleCharacterSelect = (character: AnimeCharacter) => {
    if (!selectedCell) return
    
    const newGrid = [...grid]
    newGrid[selectedCell.row][selectedCell.col] = character
    setGrid(newGrid)
    setScore(prev => prev + 10)
    
    setShowPicker(false)
    setSelectedCell(null)
  }

  const resetGame = () => {
    setGrid(Array(3).fill(null).map(() => Array(3).fill(null)))
    setScore(0)
  }

  const filteredCharacters = characters.filter(char =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a141b] via-[#081018] to-[#050c12] text-amber-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            One Piece Grid Challenge
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Puntuación: {score}</span>
            </div>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-3 gap-2">
            {grid.map((row, rowIndex) => 
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className="w-24 h-24 border-2 border-amber-600/30 rounded-lg cursor-pointer flex items-center justify-center text-xs font-medium transition-all duration-200 hover:border-amber-400 bg-slate-800/30"
                >
                  {cell ? (
                    <div className="text-center p-1">
                      <div className="text-[10px] leading-tight">{cell.name}</div>
                    </div>
                  ) : (
                    <Target className="w-6 h-6 text-amber-600/50" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {showPicker && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Selecciona Personaje</h3>
                <button
                  onClick={() => setShowPicker(false)}
                  className="text-amber-400 hover:text-amber-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {filteredCharacters.slice(0, 30).map((character) => (
                    <button
                      key={character.name}
                      onClick={() => handleCharacterSelect(character)}
                      className="p-3 rounded border border-slate-600 bg-slate-700 hover:bg-slate-600 text-left transition-colors text-sm"
                    >
                      <div className="font-medium truncate">{character.name}</div>
                      <div className="text-xs text-slate-400 truncate">
                        {character.crew || 'Sin tripulación'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
