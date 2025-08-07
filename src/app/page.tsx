import Link from 'next/link'
import { Play, Users, Trophy, Gamepad2 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-400 to-orange-500 bg-clip-text text-transparent">
                  AnimeHaus
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                The ultimate anime gaming experience with One Piece mini-games and quizzes
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>168+ Characters</span>
              </div>
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                <span>4 Game Modes</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>Unlimited Fun</span>
              </div>
            </div>
            
            <div className="pt-8">
              <Link
                href="/games/grid"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg"
              >
                <Play className="w-5 h-5" />
                Start Playing
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Simple Games Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Choose Your Adventure
            </h2>
            <p className="text-lg text-muted-foreground">
              Test your One Piece knowledge with our exciting mini-games
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Simple game cards without complex logic */}
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Anime Grid</h3>
              <p className="text-muted-foreground mb-4">3x3 grid puzzle game</p>
              <Link href="/games/grid" className="text-blue-400 hover:underline">
                Play Now
              </Link>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="text-4xl mb-4">🔤</div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Anime Wordle</h3>
              <p className="text-muted-foreground mb-4">Guess the character name</p>
              <span className="text-muted-foreground">Coming Soon</span>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="text-4xl mb-4">⬆️</div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Higher or Lower</h3>
              <p className="text-muted-foreground mb-4">Bounty guessing game</p>
              <span className="text-muted-foreground">Coming Soon</span>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="text-4xl mb-4">🕵️</div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Find the Impostor</h3>
              <p className="text-muted-foreground mb-4">Spot the fake character</p>
              <span className="text-muted-foreground">Coming Soon</span>
            </div>
          </div>
          
          {/* Characters Section */}
          <div className="text-center mt-16">
            <div className="bg-card border border-border rounded-xl p-8 max-w-2xl mx-auto">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-semibold mb-4 text-card-foreground">Explore All Characters</h3>
              <p className="text-muted-foreground mb-6">
                Discover detailed information about all 168+ One Piece characters in our database
              </p>
              <Link 
                href="/characters" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg"
              >
                <Users className="w-5 h-5" />
                View Characters
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
