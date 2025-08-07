import Link from 'next/link'
import { Play, Users, Trophy, Gamepad2, Grid3X3, Zap, TrendingUp, Eye, Brain, Search, Star } from 'lucide-react'

const games = [
  {
    id: 'grid',
    title: 'Character Grid',
    description: 'Classic 3x3 grid with One Piece characters',
    icon: Grid3X3,
    difficulty: 'Easy',
    players: '1 Player',
    time: '2-5 min',
    status: 'available',
    href: '/games/grid',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'wordle',
    title: 'Anime Wordle',
    description: 'Guess the character name in 6 tries',
    icon: Brain,
    difficulty: 'Medium',
    players: '1 Player',
    time: '3-8 min',
    status: 'coming-soon',
    href: '/games/wordle',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'higher-lower',
    title: 'Higher or Lower',
    description: 'Guess if the next bounty is higher or lower',
    icon: TrendingUp,
    difficulty: 'Medium',
    players: '1 Player',
    time: '5-10 min',
    status: 'available',
    href: '/games/higher-lower',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'guess-character',
    title: 'Guess the Character',
    description: 'Identify characters from silhouettes or hints',
    icon: Eye,
    difficulty: 'Hard',
    players: '1 Player',
    time: '3-7 min',
    status: 'coming-soon',
    href: '/games/guess-character',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'crew-match',
    title: 'Crew Matcher',
    description: 'Match characters to their correct crews',
    icon: Users,
    difficulty: 'Easy',
    players: '1 Player',
    time: '2-4 min',
    status: 'coming-soon',
    href: '/games/crew-match',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'power-ranking',
    title: 'Power Ranking',
    description: 'Rank characters by their power level',
    icon: Zap,
    difficulty: 'Hard',
    players: '1 Player',
    time: '5-12 min',
    status: 'coming-soon',
    href: '/games/power-ranking',
    color: 'from-yellow-500 to-orange-500'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-400 to-orange-500 bg-clip-text text-transparent">
                  AnimeHaus
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                The ultimate One Piece gaming experience with mini-games, quizzes and character exploration
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border">
                <Users className="w-4 h-4 text-blue-400" />
                <span>168+ Characters</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border">
                <Gamepad2 className="w-4 h-4 text-green-400" />
                <span>6 Game Modes</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Unlimited Fun</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Games Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Choose Your Game Mode
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Test your One Piece knowledge with our collection of interactive mini-games and challenges
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {games.map((game) => {
              const IconComponent = game.icon
              const isAvailable = game.status === 'available'
              
              return (
                <div
                  key={game.id}
                  className={`group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 ${
                    isAvailable ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : 'opacity-75'
                  }`}
                >
                  {/* Game Card Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${game.color} bg-opacity-10`}>
                        <IconComponent className={`w-6 h-6 text-white`} />
                      </div>
                      <div className="flex flex-col items-end text-xs text-muted-foreground">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          game.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          game.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {game.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 text-card-foreground group-hover:text-foreground transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {game.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {game.players}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {game.time}
                      </span>
                    </div>
                    
                    {isAvailable ? (
                      <Link
                        href={game.href as any}
                        className={`inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r ${game.color} text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg`}
                      >
                        <Play className="w-4 h-4" />
                        Play Now
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-muted text-muted-foreground font-medium rounded-lg cursor-not-allowed"
                      >
                        <Star className="w-4 h-4" />
                        Coming Soon
                      </button>
                    )}
                  </div>
                  
                  {/* Status Badge */}
                  {!isAvailable && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-full">
                        Soon
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* Characters Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Explore the One Piece Universe
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover detailed information about all 168+ One Piece characters in our comprehensive database
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold mb-4 text-card-foreground">
                Complete Character Database
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Browse through detailed profiles including crews, bounties, haki abilities, devil fruits, and more. 
                Use advanced filters to find exactly what you're looking for.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
                <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-lg">
                  <Search className="w-4 h-4 text-blue-400" />
                  <span>Advanced Search</span>
                </div>
                <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-lg">
                  <Users className="w-4 h-4 text-green-400" />
                  <span>Crew Filtering</span>
                </div>
                <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-lg">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>Bounty Sorting</span>
                </div>
              </div>
              
              <Link 
                href="/characters" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg"
              >
                <Users className="w-5 h-5" />
                Explore Characters
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
