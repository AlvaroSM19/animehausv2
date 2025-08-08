'use client'

import { useState, useEffect } from 'react'
import { getAllCharacters, type AnimeCharacter } from '../../../lib/anime-data'
import { Search, RotateCcw, Trophy, Target, Check, X } from 'lucide-react'

interface GridCondition {
  id: string
  name: string
  description: string
  check: (character: AnimeCharacter) => boolean
}

interface GridCell {
  character: AnimeCharacter | null
  isValid: boolean
}

const ROW_CONDITIONS: GridCondition[] = [
  {
    id: 'marine',
    name: 'Marina',
    description: 'Personaje de la Marina',
    check: (char) => Boolean(char.crew?.toLowerCase().includes('marine') || 
                     char.crew?.toLowerCase().includes('navy') ||
                     char.origin?.toLowerCase().includes('marine'))
  },
  {
    id: 'pirate',
    name: 'Pirata',
    description: 'Personaje pirata',
    check: (char) => Boolean(char.crew?.toLowerCase().includes('pirates') ||
                     char.crew?.toLowerCase().includes('pirate') ||
                     char.crew?.toLowerCase().includes('straw hat'))
  },
  {
    id: 'haki',
    name: 'Haki',
    description: 'Usuario de Haki',
    check: (char) => Boolean(char.haki === true || (char.hakiTypes && char.hakiTypes.length > 0))
  }
]

const COLUMN_CONDITIONS: GridCondition[] = [
  {
    id: 'devil_fruit',
    name: 'Fruta del Diablo',
    description: 'Usuario de Fruta del Diablo',
    check: (char) => Boolean(char.devilFruit && char.devilFruit !== 'None' && char.devilFruit !== '')
  },
  {
    id: 'swordsman',
    name: 'Espadachín',
    description: 'Usa espadas',
    check: (char) => Boolean(char.features?.some(feature => 
      feature.toLowerCase().includes('sword') || 
      feature.toLowerCase().includes('blade') ||
      feature.toLowerCase().includes('katana')
    ) || char.name.toLowerCase().includes('zoro') || char.name.toLowerCase().includes('mihawk'))
  },
  {
    id: 'high_bounty',
    name: 'Recompensa Alta',
    description: 'Más de 100M berries',
    check: (char) => Boolean(char.bounty && char.bounty >= 100000000)
  }
]

export default function AnimeGridPage() {
  const [characters, setCharacters] = useState<AnimeCharacter[]>([])
  const [grid, setGrid] = useState<GridCell[][]>(() => 
    Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({ character: null, isValid: false })))
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

  const checkCharacterValidForCell = (character: AnimeCharacter, row: number, col: number): boolean => {
    const rowCondition = ROW_CONDITIONS[row]
    const colCondition = COLUMN_CONDITIONS[col]
    return rowCondition.check(character) && colCondition.check(character)
  }

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].character) return
    setSelectedCell({ row, col })
    setShowPicker(true)
  }

  const handleCharacterSelect = (character: AnimeCharacter) => {
    if (!selectedCell) return
    
    const { row, col } = selectedCell
    const isValid = checkCharacterValidForCell(character, row, col)
    
    const newGrid = [...grid]
    newGrid[row][col] = { character, isValid }
    setGrid(newGrid)
    
    if (isValid) {
      setScore(prev => prev + 10)
    }
    
    setShowPicker(false)
    setSelectedCell(null)
  }

  const resetGame = () => {
    setGrid(Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({ character: null, isValid: false }))))
    setScore(0)
  }

  const filteredCharacters = characters.filter(char =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-yellow-400 drop-shadow-lg">
            ONE PIECE TIC TAC TOE
          </h1>
          <p className="text-lg text-gray-300 mb-6 font-medium">
            ¡Demuestra tu conocimiento de One Piece completando el grid!
          </p>
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-3 bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold">
              <Trophy className="w-6 h-6" />
              <span className="text-lg">Puntuación: {score}</span>
            </div>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold text-lg shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              Nuevo Juego
            </button>
          </div>
        </div>

        {/* Grid Container */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border-2 border-yellow-600">
            {/* Column Headers */}
            <div className="flex mb-4">
              <div className="w-40"></div>
              {COLUMN_CONDITIONS.map((condition, index) => (
                <div key={index} className="w-32 text-center mx-1">
                  <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-sm shadow-lg border-2 border-blue-400">
                    {condition.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Grid Rows */}
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-center mb-4">
                {/* Row Header */}
                <div className="w-40 pr-4">
                  <div className="bg-orange-600 text-white px-3 py-2 rounded-lg font-bold text-sm text-center shadow-lg border-2 border-orange-400">
                    {ROW_CONDITIONS[rowIndex].name}
                  </div>
                </div>

                {/* Grid Cells */}
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`
                      w-32 h-32 mx-1 rounded-xl cursor-pointer
                      flex flex-col items-center justify-center
                      transition-all duration-300 hover:scale-105
                      border-3 shadow-lg
                      ${cell.character 
                        ? (cell.isValid 
                          ? 'bg-green-700 border-green-400 hover:bg-green-600' 
                          : 'bg-red-700 border-red-400 hover:bg-red-600') 
                        : 'bg-gray-700 border-gray-500 hover:bg-gray-600 hover:border-yellow-400'
                      }
                    `}
                  >
                    {cell.character ? (
                      <div className="text-center w-full h-full flex flex-col items-center justify-center p-2">
                        {cell.character.imageUrl ? (
                          <img 
                            src={cell.character.imageUrl} 
                            alt={cell.character.name}
                            className="w-20 h-20 object-cover rounded-full border-2 border-white shadow-md mb-1"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-600 rounded-full border-2 border-white shadow-md mb-1 flex items-center justify-center">
                            <span className="text-lg">🏴‍☠️</span>
                          </div>
                        )}
                        <div className="text-xs font-bold text-white text-center leading-tight">
                          {cell.character.name}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl mb-1">?</div>
                        <div className="text-xs text-gray-400 font-medium">Seleccionar</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Character Picker Modal */}
        {showPicker && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col border-2 border-yellow-600 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-yellow-400">🏴‍☠️ Selecciona tu Pirata</h3>
                <button
                  onClick={() => setShowPicker(false)}
                  className="text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 p-2 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedCell && (
                <div className="mb-6 p-4 bg-blue-900/30 rounded-lg border border-blue-600">
                  <p className="text-lg text-center text-white font-medium">
                    🎯 Posición: <span className="font-bold text-orange-400">{ROW_CONDITIONS[selectedCell.row]?.name}</span>
                    {' + '}
                    <span className="font-bold text-blue-400">{COLUMN_CONDITIONS[selectedCell.col]?.name}</span>
                  </p>
                  <p className="text-sm text-center text-gray-300 mt-2">
                    ¿Sabes qué pirata cumple ambas condiciones?
                  </p>
                </div>
              )}

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre de pirata..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 text-lg font-medium"
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-4">
                  {filteredCharacters.slice(0, 60).map((character) => (
                    <button
                      key={character.name}
                      onClick={() => handleCharacterSelect(character)}
                      className="p-3 rounded-xl border-2 border-gray-600 bg-gray-700 hover:bg-gray-600 hover:border-yellow-400 text-center transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      {character.imageUrl ? (
                        <img 
                          src={character.imageUrl} 
                          alt={character.name}
                          className="w-16 h-16 object-cover rounded-full mx-auto mb-2 border-2 border-gray-500"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}
                      <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center border-2 border-gray-500">
                        <span className="text-xl">🏴‍☠️</span>
                      </div>
                      <div className="font-bold text-sm text-white leading-tight">{character.name}</div>
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        {character.crew || 'Independiente'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center space-y-2 bg-gray-800/50 p-6 rounded-xl border border-gray-600">
          <h3 className="text-xl font-bold text-yellow-400 mb-3">⚔️ Reglas del Desafío Pirata ⚔️</h3>
          <p className="text-gray-300 font-medium">🎯 Cada casilla necesita un personaje que cumpla AMBAS condiciones</p>
          <p className="text-gray-300 font-medium">🧠 Usa tu conocimiento de One Piece para elegir correctamente</p>
          <p className="text-gray-300 font-medium">⚡ Solo sabrás si acertaste después de seleccionar</p>
        </div>
      </div>
    </div>
  )
}
