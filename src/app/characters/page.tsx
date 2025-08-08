'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Users } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-b from-[#05344d] via-[#065e7c] to-[#f5d9a5] text-amber-100">
      {/* Header */}
      <div className="border-b border-amber-700/40 bg-[#042836]/70 backdrop-blur-sm sticky top-0 z-40 shadow-lg shadow-black/40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-300/80 w-4 h-4" />
              <input
                type="text"
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#06394f]/60 border border-amber-700/40 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-100 placeholder-amber-300/50 shadow shadow-black/40"
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
              className="px-4 py-2 bg-[#06394f]/60 border border-amber-700/40 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow shadow-black/40"
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
            <div className="mt-4 p-4 bg-[#06394f]/70 rounded-lg border border-amber-700/40 shadow shadow-black/40">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-200 mb-2">Crew</label>
                  <select
                    value={selectedCrew}
                    onChange={(e) => setSelectedCrew(e.target.value)}
                    className="w-full px-3 py-2 bg-[#074860]/80 border border-amber-700/40 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                    className="w-full px-3 py-2 bg-[#074860]/80 border border-amber-700/40 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
              className="bg-[#06394f]/70 border border-amber-700/40 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm shadow shadow-black/40"
            >
              {/* Character Image with Frame */}
              <div className="relative p-4">
                <div className="relative h-32 w-32 mx-auto bg-gradient-to-br from-amber-500/20 to-transparent border-2 border-amber-600/60 rounded-xl overflow-hidden shadow-inner shadow-black/40">
                  <img
                    src={character.imageUrl}
                    alt={character.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/characters/placeholder.svg'
                    }}
                  />
                  {/* Golden frame effect */}
                  <div className="absolute inset-0 border-2 border-amber-400/30 rounded-xl pointer-events-none"></div>
                </div>
                
                {/* Bounty Badge */}
                {character.bounty && character.bounty > 0 && (
                  <div className="absolute top-2 right-2 bg-gradient-to-br from-green-500 to-emerald-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow shadow-black/40">
                    {formatBounty(character.bounty || null)}
                  </div>
                )}
              </div>

              {/* Character Info - Compact */}
              <div className="px-4 pb-4 space-y-2">
                {/* Name */}
                <h3 className="text-lg font-bold text-amber-200 text-center tracking-wide">{character.name}</h3>
                
                {/* Crew */}
                <div className="text-center">
                  <span className="text-xs uppercase tracking-wide text-amber-300/60">Crew</span>
                  <p className="text-sm font-medium text-amber-100">{character.crew || 'Unknown'}</p>
                </div>

                {/* Origin */}
                {character.origin && (
                  <div className="text-center">
                    <span className="text-xs uppercase tracking-wide text-amber-300/60">Origin</span>
                    <p className="text-sm text-amber-200/80">{character.origin}</p>
                  </div>
                )}

                {/* Haki Types - Compact Pills */}
                {character.hakiTypes && character.hakiTypes.length > 0 && (
                  <div className="text-center">
                    <span className="text-xs uppercase tracking-wide text-amber-300/60 block mb-1">Haki</span>
                    <div className="flex flex-wrap justify-center gap-1">
                      {character.hakiTypes.slice(0, 3).map((haki) => (
                        <span
                          key={haki}
                          className="px-2 py-1 bg-blue-500/30 text-blue-300 text-xs rounded-full border border-blue-500/40 font-medium"
                        >
                          {haki === 'Armament Haki' ? 'Armament' : 
                           haki === 'Observation Haki' ? 'Observation' :
                           haki === 'Conqueror\'s Haki' ? 'Conqueror' : haki}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Devil Fruit */}
                {character.devilFruit && (
                  <div className="text-center bg-red-500/20 border border-red-500/40 rounded-lg p-2">
                    <span className="text-xs uppercase tracking-wide text-red-300/80 block">Devil Fruit</span>
                    <p className="text-xs text-red-200 font-medium">{character.devilFruit}</p>
                  </div>
                )}

                {/* Status Indicator */}
                <div className="flex justify-center pt-1">
                  <span className={`px-3 py-1 text-xs rounded-full font-bold border ${
                    character.bounty && character.bounty > 0
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                      : character.haki 
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-gray-500/20 text-gray-300 border-gray-500/40'
                  }`}>
                    {character.bounty && character.bounty > 0 ? 'Wanted' :
                     character.haki ? 'Haki User' : 'Civilian'}
                  </span>
                </div>
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
