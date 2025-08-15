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
  glow: string  // hex o hsl para borde y efectos
}

const games: GameDef[] = [
  { id: 'tapone', title: 'Tap One', description: 'Elige tu destino: selecciona una categoría en el momento justo', icon: Gamepad2, difficulty: 'Medium', players: '1 Player', time: '2-5 min', status: 'available', href: '/games/tapone', color: 'from-yellow-400 to-orange-500', glow: '#ffb347' },
  { id: 'connections', title: 'Connections', description: 'Encuentra 4 grupos ocultos de 4 personajes', icon: Grid3X3, difficulty: 'Medium', players: '1 Player', time: '3-8 min', status: 'available', href: '/games/connections', color: 'from-indigo-500 to-violet-500', glow: '#8b74ff' },
  { id: 'grid', title: 'Memory Cards', description: 'Empareja las cartas 4x4 con personajes de One Piece', icon: Grid3X3, difficulty: 'Easy', players: '1 Player', time: '2-5 min', status: 'available', href: '/games/grid', color: 'from-blue-500 to-cyan-500', glow: '#3bbdff' },
  { id: 'anime-grid', title: 'One Piece Tic Tac Toe', description: 'Tic-tac-toe con condiciones de personajes One Piece', icon: Target, difficulty: 'Hard', players: '1 Player', time: '5-15 min', status: 'available', href: '/games/anime-grid', color: 'from-cyan-500 to-teal-500', glow: '#1dd4c9' },
  { id: 'wordle', title: 'Anime Wordle', description: 'Guess the character name in 6 tries', icon: Brain, difficulty: 'Medium', players: '1 Player', time: '3-8 min', status: 'available', href: '/games/wordle', color: 'from-green-500 to-emerald-500', glow: '#4ade80' },
  { id: 'higher-lower', title: 'Higher or Lower', description: 'Guess if the next bounty is higher or lower', icon: TrendingUp, difficulty: 'Medium', players: '1 Player', time: '5-10 min', status: 'available', href: '/games/higher-lower', color: 'from-orange-500 to-red-500', glow: '#ff6b3d' },
  { id: 'onepiecedle', title: 'OnePiecedle', description: 'Deduce el personaje por atributos (crew, origen, haki...)', icon: Trophy, difficulty: 'Medium', players: '1 Player', time: '3-8 min', status: 'available', href: '/games/onepiecedle', color: 'from-purple-600 to-fuchsia-500', glow: '#d163ff' },
  { id: 'crew-quiz', title: 'Adivina la Crew', description: 'Escribe todos los miembros de tripulaciones y grupos', icon: Clock, difficulty: 'Hard', players: '1 Player', time: '2-10 min', status: 'available', href: '/games/crew-quiz', color: 'from-emerald-600 to-teal-600', glow: '#34d399' },
  { id: 'impostor', title: 'Impostor', description: 'Find the character that doesn\'t belong to the group', icon: Search, difficulty: 'Hard', players: '1 Player', time: '2-4 min', status: 'available', href: '/games/impostor', color: 'from-purple-500 to-pink-500', glow: '#ff5fae' }
]

const comingSoonGames: GameDef[] = [
  { id: 'guess-character', title: 'Guess the Character', description: 'Identify characters from silhouettes or hints', icon: Eye, difficulty: 'Hard', players: '1 Player', time: '3-7 min', status: 'coming-soon', href: '/games/guess-character', color: 'from-purple-500 to-pink-500', glow: '#d163ff' },
  { id: 'crew-match', title: 'Crew Matcher', description: 'Match characters to their correct crews', icon: Users, difficulty: 'Easy', players: '1 Player', time: '2-4 min', status: 'coming-soon', href: '/games/crew-match', color: 'from-indigo-500 to-blue-500', glow: '#4f74ff' },
  { id: 'power-ranking', title: 'Power Ranking', description: 'Rank characters by their power level', icon: Zap, difficulty: 'Hard', players: '1 Player', time: '5-12 min', status: 'coming-soon', href: '/games/power-ranking', color: 'from-yellow-500 to-orange-500', glow: '#ffb347' }
]

export default function HomePage() {
  return (
    <div className="min-h-screen relative text-amber-100 selection:bg-amber-400/20">
      {/* Straw Hat Pirates Flag Background (hidden when custom wallpaper active) */}
      <div className="fixed inset-0 z-0 homepage-flag-bg">
        {/* Straw Hat flag base */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/images/straw-hat-flag.svg')` }}
        />
        {/* Deep sea to parchment vertical gradient for One Piece vibe */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,20,32,0.92),rgba(6,54,86,0.85)_40%,rgba(165,118,40,0.15)_78%,rgba(242,216,167,0.08))]" />
        {/* Subtle map lines & vignette */}
        <div className="absolute inset-0 op-map-overlay mix-blend-soft-light" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />
      </div>

      {/* Content with relative positioning & decorative rope divider at top (no text) */}
      <div className="relative z-10">
        <div className="op-rope-divider opacity-70" aria-hidden />
        {/* Games Section */}

      <section className="py-16 relative">
        {/* Subtle layered compass & wave ornaments (purely decorative) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-72 h-72 opacity-[0.04] rotate-12 bg-[radial-gradient(circle_at_center,rgba(255,216,128,0.6),transparent_60%)] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[38rem] h-[38rem] opacity-[0.05] -rotate-6 bg-[conic-gradient(from_45deg,rgba(255,196,90,0.4),transparent_55%)]" />
        </div>
  <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
            {games.map(game => {
              const IconComponent = game.icon
              const isAvailable = game.status === 'available'
              return (
                <div
                  key={game.id}
                  style={{ ['--glow' as any]: game.glow }}
                  className={`group op-card op-game-tile relative rounded-2xl overflow-hidden transition-all duration-400 backdrop-blur-sm ${
                    isAvailable
                      ? 'hover:-translate-y-1'
                      : 'opacity-60 op-card-disabled'
                  }`}
                >
                  <div className="p-6 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${game.color} shadow-inner shadow-black/40 ring-1 ring-inset ring-amber-200/20 relative overflow-hidden`}>                        
                        <IconComponent className="w-6 h-6 text-white drop-shadow [filter:drop-shadow(0_0_4px_rgba(255,220,130,0.45))]" />
                        <span className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent_60%)]" />
                      </div>
                      <div className="flex flex-col items-end text-xs text-muted-foreground">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium tracking-wide ${game.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : game.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}`}>{game.difficulty}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-amber-200 group-hover:text-amber-50 transition-colors tracking-wide [text-shadow:0_0_6px_rgba(255,186,60,0.15)]">{game.title}</h3>
                    <p className="text-amber-200/65 mb-4 text-sm leading-relaxed">{game.description}</p>
                    <div className="flex items-center justify-between text-xs text-amber-300/55 mb-4">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{game.players}</span>
                      <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />{game.time}</span>
                    </div>
                    {isAvailable ? (
                      <Link href={game.href} className={`inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-br ${game.color} text-white font-bold rounded-lg hover:brightness-110 transition-all duration-300 shadow shadow-black/40 relative overflow-hidden`}>
                        <span className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent_60%)]" />
                        <Play className="w-4 h-4" /> Play Now
                      </Link>
                    ) : (
                      <button disabled className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-zinc-700/50 text-zinc-400 font-medium rounded-lg cursor-not-allowed border border-zinc-600/40">
                        <Star className="w-4 h-4" /> Coming Soon
                      </button>
                    )}
                  </div>
                  {!isAvailable && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-2 py-1 bg-rose-500/20 text-rose-300 text-xs font-medium rounded-full border border-rose-500/40 shadow-sm">Soon</span>
                    </div>
                  )}
                  {/* Decorative subtle Jolly Roger watermark */}
                  <div className="pointer-events-none absolute inset-0 opacity-[0.04] group-hover:opacity-10 transition-opacity duration-500 mix-blend-overlay bg-[url('/images/straw-hat-flag.svg')] bg-center bg-contain bg-no-repeat" />
                </div>
              )
            })}
          </div>
          {/* Badges moved below games */}
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-20">
            <div className="flex items-center gap-2 bg-[#101b24]/70 px-4 py-2 rounded-lg border border-amber-700/40 backdrop-blur-sm shadow shadow-black/40 op-badge">
              <Users className="w-4 h-4 text-emerald-400" />
              <span className="text-amber-200/80">246+ Personajes</span>
            </div>
            <div className="flex items-center gap-2 bg-[#101b24]/70 px-4 py-2 rounded-lg border border-amber-700/40 backdrop-blur-sm shadow shadow-black/40 op-badge">
              <Gamepad2 className="w-4 h-4 text-rose-400" />
              <span className="text-amber-200/80">{games.length} Modos</span>
            </div>
            <div className="flex items-center gap-2 bg-[#101b24]/70 px-4 py-2 rounded-lg border border-amber-700/40 backdrop-blur-sm shadow shadow-black/40 op-badge">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-amber-200/80">Diversión Infinita</span>
            </div>
          </div>

          {/* Coming Soon Games */}
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-amber-200/70 via-yellow-400/70 to-amber-500/70 bg-clip-text text-transparent drop-shadow [text-shadow:0_0_10px_rgba(255,206,120,0.15)]">
              Próximamente
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {comingSoonGames.map(game => {
              const IconComponent = game.icon
              return (
                <div key={game.id} className="group relative rounded-xl overflow-hidden transition-all duration-300 bg-[#101b24]/45 border border-amber-800/30 backdrop-blur-sm shadow shadow-black/30 opacity-60 op-card-disabled">
                  <div className="p-6 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${game.color} opacity-70 shadow-inner shadow-black/40 ring-1 ring-inset ring-amber-200/10`}>
                        <IconComponent className="w-6 h-6 text-white drop-shadow [filter:drop-shadow(0_0_4px_rgba(255,220,130,0.4))]" />
                      </div>
                      <div className="flex flex-col items-end text-xs text-muted-foreground">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium tracking-wide ${game.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : game.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}`}>{game.difficulty}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-amber-200/70 tracking-wide [text-shadow:0_0_6px_rgba(255,186,60,0.12)]">{game.title}</h3>
                    <p className="text-amber-200/55 mb-4 text-sm leading-relaxed">{game.description}</p>
                    <div className="flex items-center justify-between text-xs text-amber-300/45 mb-4">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{game.players}</span>
                      <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />{game.time}</span>
                    </div>
                    <button disabled className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-zinc-700/50 text-zinc-400 font-medium rounded-lg cursor-not-allowed border border-zinc-600/40">
                      <Star className="w-4 h-4" /> Coming Soon
                    </button>
                  </div>
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-2 py-1 bg-rose-500/20 text-rose-300 text-xs font-medium rounded-full border border-rose-500/40 shadow-sm">Soon</span>
                  </div>
                  <div className="pointer-events-none absolute inset-0 opacity-[0.03] transition-opacity duration-500 mix-blend-overlay bg-[url('/images/straw-hat-flag.svg')] bg-center bg-contain bg-no-repeat" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

  {/* Characters Section (retained) */}
  <section className="py-16 bg-black/20 relative before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_60%_30%,rgba(255,206,120,0.10),transparent_70%)] before:pointer-events-none">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow [text-shadow:0_0_12px_rgba(255,200,90,0.18)]">Explora el Universo One Piece</h2>
            <p className="text-lg text-amber-200/75 max-w-2xl mx-auto">Información detallada de más de 246 personajes: crews, bounties, haki, frutas y más.</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="op-card bg-[#101b24]/70 border border-amber-800/40 rounded-xl p-8 text-center backdrop-blur-sm shadow shadow-black/40 relative overflow-hidden">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-full shadow-inner shadow-black/40 ring-2 ring-amber-200/40 relative">
                  <Users className="w-8 h-8 text-black drop-shadow [filter:drop-shadow(0_0_4px_rgba(255,220,150,0.6))]" />
                  <span className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.7),transparent_65%)] rounded-full" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-amber-200 tracking-wide [text-shadow:0_0_8px_rgba(255,190,60,0.25)]">Base de Datos Completa</h3>
              <p className="text-amber-200/75 mb-6 max-w-2xl mx-auto text-sm leading-relaxed">Perfiles detallados con crews, recompensas, habilidades de haki, frutas del diablo y más. Filtra y ordena para encontrar exactamente lo que buscas.</p>
              <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
                <div className="flex items-center gap-2 bg-[#0c171f] px-3 py-2 rounded-lg border border-amber-700/40 op-badge"><Search className="w-4 h-4 text-emerald-400" /><span className="text-amber-200/75">Búsqueda Avanzada</span></div>
                <div className="flex items-center gap-2 bg-[#0c171f] px-3 py-2 rounded-lg border border-amber-700/40 op-badge"><Users className="w-4 h-4 text-rose-400" /><span className="text-amber-200/75">Filtrar Crews</span></div>
                <div className="flex items-center gap-2 bg-[#0c171f] px-3 py-2 rounded-lg border border-amber-700/40 op-badge"><Trophy className="w-4 h-4 text-amber-400" /><span className="text-amber-200/75">Ordenar Bounties</span></div>
              </div>
              <Link href="/characters" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black font-bold rounded-lg hover:brightness-110 transition-all duration-300 shadow shadow-black/40 relative overflow-hidden">
                <span className="absolute inset-0 opacity-0 hover:opacity-25 transition-opacity bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.9),transparent_65%)]" />
                <Users className="w-5 h-5" /> Explorar Personajes
              </Link>
              <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[url('/images/straw-hat-flag.svg')] bg-center bg-contain bg-no-repeat" />
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  )
}
