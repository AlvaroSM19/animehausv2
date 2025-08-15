import Link from 'next/link'
import { Play, Users, Trophy, Gamepad2, Grid3X3, TrendingUp, Brain, Search, Target, Clock } from 'lucide-react'

interface GameDef {
  id: string
  title: string
  description: string
  icon: any
  difficulty: 'Easy' | 'Medium' | 'Hard'
  players: string
  time: string
  status: 'available'
  href: string
  color: string
  glow: string
}

const games: GameDef[] = [
  { id: 'tapone', title: 'TAP ONE', description: 'Ritmo y reflejos: pulsa justo cuando tu categoría se enciende para encadenar puntos sin fallar.', icon: Gamepad2, difficulty: 'Medium', players: '', time: '', status: 'available', href: '/games/tapone', color: 'from-red-600 to-red-500', glow: '#ff3d3d' },
  { id: 'connections', title: 'CONNECTIONS', description: 'Detecta 4 grupos secretos de 4 personajes relacionándolos por temática, origen o rasgos.', icon: Grid3X3, difficulty: 'Medium', players: '', time: '', status: 'available', href: '/games/connections', color: 'from-violet-700 to-fuchsia-600', glow: '#bb6dff' },
  { id: 'grid', title: 'MEMORY CARDS', description: 'Da la vuelta y memoriza: encuentra cada pareja de personajes antes de olvidarlas.', icon: Grid3X3, difficulty: 'Easy', players: '', time: '', status: 'available', href: '/games/grid', color: 'from-pink-600 to-rose-500', glow: '#ff6fa5' },
  { id: 'anime-grid', title: 'ONE PIECE TIC TAC TOE', description: 'Cruza condiciones (ORIGEN, CREW, HAKI, FRUTA, BOUNTY) y llena toda la cuadrícula válidamente.', icon: Target, difficulty: 'Hard', players: '', time: '', status: 'available', href: '/games/anime-grid', color: 'from-emerald-600 to-green-600', glow: '#16c172' },
  { id: 'wordle', title: 'ANIME WORDLE', description: 'Adivina el personaje en 6 intentos: cada pista revela qué atributos coinciden o no.', icon: Brain, difficulty: 'Medium', players: '', time: '', status: 'available', href: '/games/wordle', color: 'from-amber-500 to-yellow-500', glow: '#ffc94d' },
  { id: 'higher-lower', title: 'HIGHER OR LOWER', description: '¿La próxima recompensa es mayor o menor? Escala tu racha con intuición pirata.', icon: TrendingUp, difficulty: 'Medium', players: '', time: '', status: 'available', href: '/games/higher-lower', color: 'from-orange-500 to-amber-500', glow: '#ff9d3d' },
  { id: 'onepiecedle', title: 'ONEPIECEDLE', description: 'Deduce el personaje filtrando crew, origen, fruta, haki y bounty en el menor número de intentos.', icon: Trophy, difficulty: 'Medium', players: '', time: '', status: 'available', href: '/games/onepiecedle', color: 'from-amber-600 to-stone-800', glow: '#e3b647' },
  { id: 'crew-quiz', title: 'ADIVINA LA CREW', description: 'Escribe todos los miembros de cada tripulación antes de que tu memoria flaquee.', icon: Clock, difficulty: 'Hard', players: '', time: '', status: 'available', href: '/games/crew-quiz', color: 'from-sky-700 to-blue-800', glow: '#3fa6ff' },
  { id: 'impostor', title: 'IMPOSTOR', description: 'Encuentra el personaje que no encaja en la temática del grupo sin dudar.', icon: Search, difficulty: 'Hard', players: '', time: '', status: 'available', href: '/games/impostor', color: 'from-indigo-900 to-purple-700', glow: '#8e66ff' }
]

// Coming soon section removed per request

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
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${game.color} shadow-inner shadow-black/40 ring-1 ring-inset ring-amber-200/20 relative overflow-hidden`}>                        
                        <IconComponent className="w-6 h-6 text-white drop-shadow [filter:drop-shadow(0_0_4px_rgba(255,220,130,0.45))]" />
                        <span className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent_60%)]" />
                      </div>
                      {/* Difficulty removed */}
                    </div>
                    <h3 className="text-2xl font-extrabold mb-3 text-amber-100 group-hover:text-amber-50 tracking-wide uppercase drop-shadow-[0_0_6px_rgba(255,186,60,0.18)]">{game.title}</h3>
                    <p className="text-amber-200/75 mb-6 text-sm leading-relaxed font-medium">{game.description}</p>
                    <Link href={game.href} className={`inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-br ${game.color} text-white font-bold rounded-lg hover:brightness-110 transition-all duration-300 shadow shadow-black/40 relative overflow-hidden`}>
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent_60%)]" />
                      <Play className="w-4 h-4" /> Play Now
                    </Link>
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

          {/* Coming soon section removed */}
        </div>
      </section>

  {/* Characters Section (retained) */}
  <section className="py-20 bg-black/30 relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_60%_30%,rgba(255,206,120,0.10),transparent_70%)] before:pointer-events-none">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-[radial-gradient(circle_at_20%_15%,rgba(255,220,140,0.15),transparent_70%)] opacity-70 pointer-events-none" />
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-wide bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(255,200,90,0.25)]">
                ONE PIECE WIKI
              </h2>
              <p className="text-amber-100/80 leading-relaxed text-lg mb-6 max-w-xl">
                Accede a la base de datos viva de personajes: tripulaciones, recompensas actualizadas, frutos del diablo, tipos de haki, orígenes y más. Diseñada para navegar rápido y cruzar información como un verdadero historiador del Grand Line.
              </p>
              <ul className="space-y-3 text-sm text-amber-200/80 mb-8">
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">●</span> Filtros combinados por crew, haki, fruta y bounty.</li>
                <li className="flex items-start gap-2"><span className="text-sky-400 mt-0.5">●</span> Buscador instantáneo y orden dinámico.</li>
                <li className="flex items-start gap-2"><span className="text-rose-400 mt-0.5">●</span> Datos consistentes con los juegos para entrenar tu memoria.</li>
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">●</span> Preparada para futuras categorías y actualizaciones.</li>
              </ul>
              <Link href="/characters" className="group inline-flex items-center gap-3 px-10 py-5 rounded-xl font-extrabold text-lg tracking-wide bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black shadow-xl shadow-black/40 hover:brightness-110 transition relative overflow-hidden">
                <span className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.85),transparent_65%)]" />
                <Users className="w-6 h-6" /> ENTRAR AL WIKI
              </Link>
            </div>
            <div className="relative">
              <div className="op-card bg-[#101b24]/70 border border-amber-800/40 rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-black/50 relative overflow-hidden">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="h-28 rounded-lg bg-gradient-to-br from-amber-500/30 to-yellow-600/20 border border-amber-400/30 flex items-center justify-center text-amber-100 text-xs font-semibold tracking-wide">CREWS</div>
                  <div className="h-28 rounded-lg bg-gradient-to-br from-emerald-500/25 to-teal-600/20 border border-emerald-400/30 flex items-center justify-center text-emerald-100 text-xs font-semibold tracking-wide">HAKI</div>
                  <div className="h-28 rounded-lg bg-gradient-to-br from-purple-500/30 to-fuchsia-600/20 border border-fuchsia-400/30 flex items-center justify-center text-fuchsia-100 text-xs font-semibold tracking-wide">FRUTAS</div>
                  <div className="h-28 rounded-lg bg-gradient-to-br from-sky-500/30 to-cyan-600/20 border border-sky-400/30 flex items-center justify-center text-sky-100 text-xs font-semibold tracking-wide">ORIGEN</div>
                  <div className="h-28 rounded-lg bg-gradient-to-br from-rose-500/30 to-pink-600/20 border border-rose-400/30 flex items-center justify-center text-rose-100 text-xs font-semibold tracking-wide">RECOMPENSAS</div>
                  <div className="h-28 rounded-lg bg-gradient-to-br from-lime-500/30 to-green-600/20 border border-lime-400/30 flex items-center justify-center text-lime-100 text-xs font-semibold tracking-wide">ATRIBUTOS</div>
                </div>
                <p className="text-amber-200/70 text-sm leading-relaxed mb-4">
                  Cada ficha de personaje se integra con los modos de juego para que practicar aquí mejore tu rendimiento en Memory Cards, Tic Tac Toe y OnePiecedle.
                </p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-2 bg-[#0c171f] px-3 py-2 rounded-lg border border-amber-700/40 op-badge"><Search className="w-4 h-4 text-emerald-400" /><span className="text-amber-200/75">Búsqueda</span></div>
                  <div className="flex items-center gap-2 bg-[#0c171f] px-3 py-2 rounded-lg border border-amber-700/40 op-badge"><Users className="w-4 h-4 text-rose-400" /><span className="text-amber-200/75">Tripulaciones</span></div>
                  <div className="flex items-center gap-2 bg-[#0c171f] px-3 py-2 rounded-lg border border-amber-700/40 op-badge"><Trophy className="w-4 h-4 text-amber-400" /><span className="text-amber-200/75">Bounties</span></div>
                </div>
                <div className="pointer-events-none absolute inset-0 opacity-[0.045] bg-[url('/images/straw-hat-flag.svg')] bg-center bg-contain bg-no-repeat" />
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  )
}
