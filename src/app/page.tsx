import Link from 'next/link'
import { Play, Users, Trophy, Gamepad2, Grid3X3, Zap, TrendingUp, Eye, Brain, Search, Star, Target, Clock } from 'lucide-react'

interface GameDef {
  id: string
  title: string
  description: string
  icon: any
  difficulty: 'Easy' | 'Medium' | 'Hard'
  players: string
  time: string
  status: 'available' | 'coming-soon'
  href: string
  color: string
}

const games: GameDef[] = [
  { id: 'grid', title: 'Memory Cards', description: 'Empareja las cartas 4x4 con personajes de One Piece', icon: Grid3X3, difficulty: 'Easy', players: '1 Player', time: '2-5 min', status: 'available', href: '/games/grid', color: 'from-blue-500 to-cyan-500' },
  { id: 'anime-grid', title: 'One Piece Tic Tac Toe', description: 'Tic-tac-toe con condiciones de personajes One Piece', icon: Target, difficulty: 'Hard', players: '1 Player', time: '5-15 min', status: 'available', href: '/games/anime-grid', color: 'from-cyan-500 to-teal-500' },
  { id: 'wordle', title: 'Anime Wordle', description: 'Guess the character name in 6 tries', icon: Brain, difficulty: 'Medium', players: '1 Player', time: '3-8 min', status: 'available', href: '/games/wordle', color: 'from-green-500 to-emerald-500' },
  { id: 'higher-lower', title: 'Higher or Lower', description: 'Guess if the next bounty is higher or lower', icon: TrendingUp, difficulty: 'Medium', players: '1 Player', time: '5-10 min', status: 'available', href: '/games/higher-lower', color: 'from-orange-500 to-red-500' },
  { id: 'onepiecedle', title: 'OnePiecedle', description: 'Deduce el personaje por atributos (crew, origen, haki...)', icon: Trophy, difficulty: 'Medium', players: '1 Player', time: '3-8 min', status: 'available', href: '/games/onepiecedle', color: 'from-purple-600 to-fuchsia-500' },
  { id: 'crew-quiz', title: 'Adivina la Crew', description: 'Escribe todos los miembros de tripulaciones y grupos', icon: Clock, difficulty: 'Hard', players: '1 Player', time: '2-10 min', status: 'available', href: '/games/crew-quiz', color: 'from-emerald-600 to-teal-600' },
  { id: 'impostor', title: 'Impostor', description: 'Find the character that doesn\'t belong to the group', icon: Search, difficulty: 'Hard', players: '1 Player', time: '2-4 min', status: 'available', href: '/games/impostor', color: 'from-purple-500 to-pink-500' }
]

const comingSoonGames: GameDef[] = [
  { id: 'guess-character', title: 'Guess the Character', description: 'Identify characters from silhouettes or hints', icon: Eye, difficulty: 'Hard', players: '1 Player', time: '3-7 min', status: 'coming-soon', href: '/games/guess-character', color: 'from-purple-500 to-pink-500' },
  { id: 'crew-match', title: 'Crew Matcher', description: 'Match characters to their correct crews', icon: Users, difficulty: 'Easy', players: '1 Player', time: '2-4 min', status: 'coming-soon', href: '/games/crew-match', color: 'from-indigo-500 to-blue-500' },
  { id: 'power-ranking', title: 'Power Ranking', description: 'Rank characters by their power level', icon: Zap, difficulty: 'Hard', players: '1 Player', time: '5-12 min', status: 'coming-soon', href: '/games/power-ranking', color: 'from-yellow-500 to-orange-500' }
]

export default function HomePage() {
  return (
    <div className="min-h-screen relative text-amber-100">
  {/* Straw Hat Pirates Flag Background (hidden when custom wallpaper active) */}
  <div className="fixed inset-0 z-0 homepage-flag-bg">
        {/* High definition Straw Hat Pirates flag as background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/straw-hat-flag.svg')`
          }}
        ></div>
        
        {/* Dark overlay to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/80"></div>
        
        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30"></div>
      </div>

      {/* Content with relative positioning */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-wide">
                <div className="flex items-center justify-center gap-4">
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow">One Piece Quest</span>
                  {/* Sombrero de Paja One Piece - Más realista */}
                  <svg 
                    className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" 
                    viewBox="0 0 100 100" 
                    fill="none"
                  >
                    {/* Ala del sombrero */}
                    <ellipse cx="50" cy="75" rx="48" ry="12" fill="#D4A574" stroke="#B8935F" strokeWidth="1"/>
                    <ellipse cx="50" cy="73" rx="45" ry="10" fill="#E6C580"/>
                    
                    {/* Copa del sombrero */}
                    <ellipse cx="50" cy="50" rx="25" ry="30" fill="#F2D399"/>
                    <ellipse cx="50" cy="48" rx="23" ry="28" fill="#F5E0B3"/>
                    
                    {/* Banda del sombrero */}
                    <rect x="27" y="60" width="46" height="6" fill="#8B4513" rx="3"/>
                    <rect x="27" y="61" width="46" height="4" fill="#A0522D" rx="2"/>
                    
                    {/* Textura de paja - líneas entrecruzadas */}
                    <g opacity="0.6" stroke="#D4A574" strokeWidth="0.8">
                      <line x1="35" y1="25" x2="37" y2="55"/>
                      <line x1="42" y1="20" x2="44" y2="58"/>
                      <line x1="50" y1="18" x2="50" y2="60"/>
                      <line x1="58" y1="20" x2="56" y2="58"/>
                      <line x1="65" y1="25" x2="63" y2="55"/>
                      
                      <line x1="32" y1="35" x2="68" y2="40"/>
                      <line x1="30" y1="45" x2="70" y2="48"/>
                      <line x1="32" y1="55" x2="68" y2="56"/>
                    </g>
                    
                    {/* Sombra en la copa */}
                    <ellipse cx="45" cy="45" rx="8" ry="12" fill="#E6C580" opacity="0.7"/>
                    
                    {/* Highlight en el ala */}
                    <ellipse cx="50" cy="70" rx="35" ry="6" fill="#F2D399" opacity="0.5"/>
                  </svg>
                </div>
                <span className="mt-2 block text-base md:text-lg font-medium text-amber-300/70">One Piece Games</span>
              </h1>
              <p className="text-xl md:text-2xl text-amber-200/70 max-w-3xl mx-auto">
                Experiencia One Piece con retos, adivinanzas y rankings. ¿Listo para la aventura?
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-[#101b24]/70 px-4 py-2 rounded-lg border border-amber-700/40 backdrop-blur-sm shadow shadow-black/40">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-amber-200/80">246+ Personajes</span>
              </div>
              <div className="flex items-center gap-2 bg-[#101b24]/70 px-4 py-2 rounded-lg border border-amber-700/40 backdrop-blur-sm shadow shadow-black/40">
                <Gamepad2 className="w-4 h-4 text-rose-400" />
                <span className="text-amber-200/80">7 Modos</span>
              </div>
              <div className="flex items-center gap-2 bg-[#101b24]/70 px-4 py-2 rounded-lg border border-amber-700/40 backdrop-blur-sm shadow shadow-black/40">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-amber-200/80">Diversión Infinita</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow">
              Juegos Disponibles
            </h2>
            <p className="text-lg text-amber-200/70 max-w-2xl mx-auto">
              Pon a prueba tu conocimiento del mundo One Piece con nuestra colección de mini juegos temáticos
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
            {games.map(game => {
              const IconComponent = game.icon
              const isAvailable = game.status === 'available'
              return (
                <div key={game.id} className={`group relative rounded-xl overflow-hidden transition-all duration-300 bg-[#101b24]/70 border border-amber-800/40 backdrop-blur-sm shadow shadow-black/50 ${isAvailable ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer hover:border-amber-500/60' : 'opacity-60'}`}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${game.color} shadow-inner shadow-black/40`}>
                        <IconComponent className="w-6 h-6 text-white drop-shadow" />
                      </div>
                      <div className="flex flex-col items-end text-xs text-muted-foreground">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium tracking-wide ${game.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : game.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}`}>{game.difficulty}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-amber-200 group-hover:text-amber-100 transition-colors tracking-wide">{game.title}</h3>
                    <p className="text-amber-200/60 mb-4 text-sm leading-relaxed">{game.description}</p>
                    <div className="flex items-center justify-between text-xs text-amber-300/50 mb-4">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{game.players}</span>
                      <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />{game.time}</span>
                    </div>
                    {isAvailable ? (
                      <Link href={game.href} className={`inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-br ${game.color} text-white font-bold rounded-lg hover:brightness-110 transition-all duration-300 shadow shadow-black/40`}>
                        <Play className="w-4 h-4" /> Play Now
                      </Link>
                    ) : (
                      <button disabled className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-zinc-700/50 text-zinc-400 font-medium rounded-lg cursor-not-allowed border border-zinc-600/40">
                        <Star className="w-4 h-4" /> Coming Soon
                      </button>
                    )}
                  </div>
                  {!isAvailable && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 bg-rose-500/20 text-rose-300 text-xs font-medium rounded-full border border-rose-500/40">Soon</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Coming Soon Games */}
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-amber-300/70 to-yellow-500/70 bg-clip-text text-transparent drop-shadow">
              Próximamente
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {comingSoonGames.map(game => {
              const IconComponent = game.icon
              return (
                <div key={game.id} className="group relative rounded-xl overflow-hidden transition-all duration-300 bg-[#101b24]/50 border border-amber-800/30 backdrop-blur-sm shadow shadow-black/30 opacity-60">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${game.color} opacity-70 shadow-inner shadow-black/40`}>
                        <IconComponent className="w-6 h-6 text-white drop-shadow" />
                      </div>
                      <div className="flex flex-col items-end text-xs text-muted-foreground">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium tracking-wide ${game.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : game.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}`}>{game.difficulty}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-amber-200/70 tracking-wide">{game.title}</h3>
                    <p className="text-amber-200/50 mb-4 text-sm leading-relaxed">{game.description}</p>
                    <div className="flex items-center justify-between text-xs text-amber-300/40 mb-4">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{game.players}</span>
                      <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />{game.time}</span>
                    </div>
                    <button disabled className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-zinc-700/50 text-zinc-400 font-medium rounded-lg cursor-not-allowed border border-zinc-600/40">
                      <Star className="w-4 h-4" /> Coming Soon
                    </button>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-rose-500/20 text-rose-300 text-xs font-medium rounded-full border border-rose-500/40">Soon</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Characters Section */}
      <section className="py-16 bg-black/20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow">Explora el Universo One Piece</h2>
            <p className="text-lg text-amber-200/70 max-w-2xl mx-auto">Información detallada de más de 246 personajes: crews, bounties, haki, frutas y más.</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#101b24]/70 border border-amber-800/40 rounded-xl p-8 text-center backdrop-blur-sm shadow shadow-black/40">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-full shadow-inner shadow-black/40">
                  <Users className="w-8 h-8 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-amber-200 tracking-wide">Base de Datos Completa</h3>
              <p className="text-amber-200/70 mb-6 max-w-2xl mx-auto text-sm leading-relaxed">Perfiles detallados con crews, recompensas, habilidades de haki, frutas del diablo y más. Filtra y ordena para encontrar exactamente lo que buscas.</p>
              <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
                <div className="flex items-center gap-2 bg-[#0c171f] px-3 py-2 rounded-lg border border-amber-700/40"><Search className="w-4 h-4 text-emerald-400" /><span className="text-amber-200/70">Búsqueda Avanzada</span></div>
                <div className="flex items-center gap-2 bg-[#0c171f] px-3 py-2 rounded-lg border border-amber-700/40"><Users className="w-4 h-4 text-rose-400" /><span className="text-amber-200/70">Filtrar Crews</span></div>
                <div className="flex items-center gap-2 bg-[#0c171f] px-3 py-2 rounded-lg border border-amber-700/40"><Trophy className="w-4 h-4 text-amber-400" /><span className="text-amber-200/70">Ordenar Bounties</span></div>
              </div>
              <Link href="/characters" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-bold rounded-lg hover:brightness-110 transition-all duration-300 shadow shadow-black/40">
                <Users className="w-5 h-5" /> Explorar Personajes
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  )
}
