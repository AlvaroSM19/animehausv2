'use client'

import { useState } from 'react'
import { ArrowLeft, Shuffle, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { getAllCharacters, getRandomCharacter } from '../../../lib/anime-data'

export default function GridGamePage() {
  const [selectedCharacters, setSelectedCharacters] = useState(() => {
    const characters = getAllCharacters()
    return characters.slice(0, 9) // First 9 characters for 3x3 grid
  })

  const shuffleCharacters = () => {
    const characters = getAllCharacters()
    const shuffled = [...characters].sort(() => Math.random() - 0.5).slice(0, 9)
    setSelectedCharacters(shuffled)
  }

  const resetGrid = () => {
    const characters = getAllCharacters()
    setSelectedCharacters(characters.slice(0, 9))
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
              <h1 className="text-2xl font-bold text-foreground">Character Grid Game</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={shuffleCharacters}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                Shuffle
              </button>
              <button
                onClick={resetGrid}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-8">
            {selectedCharacters.map((character, index) => (
              <div
                key={`${character.id}-${index}`}
                className="aspect-square bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
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
            ))}
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Click on any character to see more details, or use the controls above to shuffle the grid!
            </p>
            <Link
              href="/characters"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              View All Characters
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
