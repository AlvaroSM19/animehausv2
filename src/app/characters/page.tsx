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
    let filtered = characters.filter(character => {
      const nameMatch = character.name.toLowerCase().includes(searchQuery.toLowerCase())
      const crewMatch = selectedCrew === 'all' || character.crew === selectedCrew
      const originMatch = selectedOrigin === 'all' || character.origin === selectedOrigin
      
      return nameMatch && crewMatch && originMatch
    })

    // Sort characters
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
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

    return filtered
  }, [characters, searchQuery, selectedCrew, selectedOrigin, sortBy])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder-muted-foreground"
              />
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="name">Name A-Z</option>
              <option value="bounty">Bounty (High to Low)</option>
              <option value="crew">Crew</option>
            </select>

            {/* Character Count */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{filteredCharacters.length} characters</span>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-card rounded-lg border border-border">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Crew</label>
                  <select
                    value={selectedCrew}
                    onChange={(e) => setSelectedCrew(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="all">All Crews</option>
                    {crews.map(crew => (
                      <option key={crew} value={crew}>{crew}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Origin</label>
                  <select
                    value={selectedOrigin}
                    onChange={(e) => setSelectedOrigin(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
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
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] character-card"
            >
              {/* Character Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  👤
                </div>
                {character.bounty && character.bounty > 0 && (
                  <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-lg text-xs font-medium">
                    {formatBounty(character.bounty || null)}
                  </div>
                )}
                {/* Haki Status */}
                {character.haki && (
                  <div className="absolute top-2 left-2 bg-purple-500/80 text-white px-2 py-1 rounded-lg text-xs font-medium">
                    Haki User
                  </div>
                )}
              </div>

              {/* Character Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">{character.name}</h3>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Crew</span>
                    <span className="text-card-foreground text-xs">{character.crew || 'Unknown'}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Bounty</span>
                    <span className={`font-medium ${character.bounty && character.bounty > 0 ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {formatBounty(character.bounty || null)}
                    </span>
                  </div>
                  
                  {character.origin && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Origin</span>
                      <span className="text-card-foreground">{character.origin}</span>
                    </div>
                  )}

                  {character.devilFruit && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Devil Fruit</span>
                      <span className="text-red-400 text-xs font-medium">{character.devilFruit}</span>
                    </div>
                  )}
                </div>

                {/* Haki Types */}
                {character.hakiTypes && character.hakiTypes.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">Haki</span>
                    <div className="flex flex-wrap gap-1">
                      {character.hakiTypes.map((haki) => (
                        <span
                          key={haki}
                          className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg border border-blue-500/30"
                        >
                          {haki}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {character.features && character.features.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">Features</span>
                    <div className="flex flex-wrap gap-1">
                      {character.features.slice(0, 2).map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-lg"
                        >
                          {feature}
                        </span>
                      ))}
                      {character.features.length > 2 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-lg">
                          +{character.features.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Features */}
                {character.features && character.features.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">Features</span>
                    <div className="flex flex-wrap gap-1">
                      {character.features.slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-lg border border-purple-500/30"
                        >
                          {feature}
                        </span>
                      ))}
                      {character.features.length > 3 && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-lg border border-purple-500/30">
                          +{character.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Bounty Badge */}
                <div className="pt-2">
                  <span className={`px-2 py-1 text-xs rounded-lg font-medium ${
                    character.bounty && character.bounty > 0
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {character.bounty && character.bounty > 0 ? 'Wanted' : 'No Bounty'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No characters found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
