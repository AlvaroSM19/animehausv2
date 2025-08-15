'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Users } from 'lucide-react'
import './styles.css'
import { 
  getAllCharacters, 
  getAllCrews, 
  getAllOrigins, 
  formatBounty,
  type AnimeCharacter 
} from '../../lib/anime-data'

export default function CharactersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCrew, setSelectedCrew] = useState<string>('all')
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<string>('name')

  const characters = getAllCharacters()
  const crews = getAllCrews()
  const origins = getAllOrigins()

  const filteredCharacters = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    
    // First get unique characters
    let results = Array.from(new Map(characters.map(char => [char.id, char])).values())
    
    // Apply filters first to reduce the search space
    if (selectedCrew !== 'all') {
      results = results.filter(char => char.crew === selectedCrew)
    }
    
    if (selectedOrigin !== 'all') {
      results = results.filter(char => char.origin === selectedOrigin)
    }
    
    // Then apply search query
    if (query) {
      results = results.filter(char => {
        const name = char.name.toLowerCase()
        const isExactMatch = name === query
        const isStartMatch = name.startsWith(query)
        const isContainMatch = name.includes(query)
        
        // Only return true for actual matches
        return isExactMatch || isStartMatch || isContainMatch
      }).sort((a, b) => {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()
        
        // Exact matches first
        if (nameA === query && nameB !== query) return -1
        if (nameB === query && nameA !== query) return 1
        
        // Then starts with matches
        if (nameA.startsWith(query) && !nameB.startsWith(query)) return -1
        if (nameB.startsWith(query) && !nameA.startsWith(query)) return 1
        
        // Then alphabetical
        return nameA.localeCompare(nameB)
      })
    }
    
    // Final sort by selected criteria
    if (!query || sortBy !== 'name') {
      results.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          case 'bounty':
            const bountyA = a.bounty || 0
            const bountyB = b.bounty || 0
            return bountyB - bountyA
          case 'crew':
            return (a.crew || '').localeCompare(b.crew || '')
          default:
            return 0
        }
      })
    }
    
    return results
  }, [characters, searchQuery, selectedCrew, selectedOrigin, sortBy])

  return (
    <div className="min-h-screen relative text-amber-100">
      {/* Header */}
  <div className="border-b border-amber-700/40 bg-black/55 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-black/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-300/80 w-4 h-4" />
              <input
                type="text"
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-amber-700/40 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-100 placeholder-amber-300/50 shadow shadow-black/40"
              />
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-semibold rounded-lg hover:brightness-110 transition-all shadow shadow-black/40"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-black/40 border border-amber-700/40 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow shadow-black/40"
            >
              <option value="name">Name A-Z</option>
              <option value="bounty">Bounty (High to Low)</option>
              <option value="crew">Crew</option>
            </select>

            {/* Character Count */}
            <div className="flex items-center gap-2 text-amber-300/80">
              <Users className="w-4 h-4" />
              <span>{filteredCharacters.length} characters</span>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-black/40 rounded-lg border border-amber-700/40 shadow shadow-black/40">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-200 mb-2">Crew</label>
                  <select
                    value={selectedCrew}
                    onChange={(e) => setSelectedCrew(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-amber-700/40 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="all">All Crews</option>
                    {crews.map(crew => (
                      <option key={crew} value={crew}>{crew}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-200 mb-2">Origin</label>
                  <select
                    value={selectedOrigin}
                    onChange={(e) => setSelectedOrigin(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-amber-700/40 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="all">All Origins</option>
                    {origins.slice(0, 20).map(origin => (
                      <option key={origin} value={origin}>{origin}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Characters Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCharacters.map((character) => (
            <div
              key={character.id}
              className="relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.015] shadow-[0_6px_18px_-4px_rgba(0,0,0,0.6)] parchment-card text-[#3b2816]"
            >
              {/* Poster inner content */}
              <div className="relative flex flex-col h-full">
                {/* Top bar decorative */}
                <div className="h-3 w-full bg-[repeating-linear-gradient(90deg,#3e2a18_0_12px,#00000022_12px_13px)] opacity-30" />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="parchment-frame relative mx-auto w-36 h-40 mb-4 rounded shadow-inner overflow-hidden">
                    <img
                      src={character.imageUrl}
                      alt={character.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/characters/placeholder.svg' }}
                    />
                    <div className="absolute inset-0 mix-blend-multiply bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.18))]" />
                  </div>
                  {character.bounty && character.bounty > 0 && (
                    <div className="absolute -top-3 -right-3 px-3 py-2 rounded-xl border-2 border-[#3e2a18] bg-[#cda160] text-xs md:text-sm font-black tracking-wider shadow-[0_2px_6px_rgba(0,0,0,0.4)] rotate-2">
                      <span className="drop-shadow-[0_0_4px_rgba(0,0,0,0.35)]">{formatBounty(character.bounty || null)}</span>
                    </div>
                  )}
                  <h3 className="text-center text-2xl font-black tracking-widest mb-2 text-[#2d1a0b] drop-shadow-lg uppercase">
                    {character.name}
                  </h3>
                  <div className="text-center mb-2">
                    <span className="text-xs uppercase tracking-[0.25em] text-[#6f4b27] font-bold block">Crew</span>
                    <p className="text-base font-bold text-[#2d1a0b] drop-shadow-sm">{character.crew || 'Unknown'}</p>
                  </div>
                  {character.origin && (
                    <div className="text-center mb-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-[#6f4b27] font-bold block">Origin</span>
                      <p className="text-base font-bold text-[#4d341d] drop-shadow-sm">{character.origin}</p>
                    </div>
                  )}
                  {character.hakiTypes && character.hakiTypes.length > 0 && (
                    <div className="text-center mb-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-[#6f4b27] font-bold block mb-1">Haki</span>
                      <div className="flex flex-wrap justify-center gap-1">
                        {character.hakiTypes.slice(0,3).map(haki => (
                          <span key={haki} className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#b78d5f]/30 border border-[#b78d5f]/60 text-[#2d1a0b] drop-shadow-sm">
                            {haki === 'Armament Haki' ? 'Armament' : haki === 'Observation Haki' ? 'Observation' : haki === 'Conqueror\'s Haki' ? 'Conqueror' : haki}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {character.devilFruit && (
                    <div className="text-center mb-2 border border-[#8d341f] bg-[#c96d52]/30 rounded p-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-[#7b2d1a] font-bold block">Devil Fruit</span>
                      <p className="text-base font-bold text-[#5a1f11] drop-shadow-sm">{character.devilFruit}</p>
                    </div>
                  )}
                  <div className="flex justify-center mt-auto pt-2">
                    <span className={`px-3 py-1 text-base rounded-full font-black tracking-wide border-2 uppercase drop-shadow-lg ${
                      character.bounty && character.bounty > 0
                        ? 'border-[#3e2a18] bg-[#d9b07a] text-[#2d1a0b]' : character.haki
                        ? 'border-[#3e2a18] bg-[#c3a072] text-[#2d1a0b]' : 'border-[#3e2a18] bg-[#c8b18c] text-[#2d1a0b]'
                    }`}>
                      {character.bounty && character.bounty > 0 ? 'Wanted' : character.haki ? 'Haki User' : 'Civilian'}
                    </span>
                  </div>
                </div>
                {/* Bottom bar decorative */}
                <div className="h-3 w-full bg-[repeating-linear-gradient(90deg,#3e2a18_0_12px,#00000022_12px_13px)] opacity-30" />
              </div>
            </div>
          ))}
        </div>

        {filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏴‍☠️</div>
            <h3 className="text-xl font-bold text-amber-300 mb-2">No pirates found</h3>
            <p className="text-amber-200/70">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
