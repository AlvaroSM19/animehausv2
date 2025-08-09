import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-anime',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AnimeHub - Anime Mini-Games & Quizzes',
    template: '%s | AnimeHub'
  },
  description: 'Play anime mini-games and quizzes. Featuring One Piece characters with 168 characters available. Anime Grid, Wordle, Higher or Lower and more.',
  keywords: [
    'anime', 'one piece', 'quiz', 'games', 'trivia', 
    'wordle', 'grid', 'higher or lower', 'luffy', 'zoro'
  ],
  authors: [{ name: 'AnimeHub Team' }],
  creator: 'AnimeHub',
  publisher: 'AnimeHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://animehaus.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://animehaus.vercel.app',
    title: 'AnimeHub - Anime Mini-Games & Quizzes',
    description: 'Play anime mini-games and quizzes with One Piece characters.',
    siteName: 'AnimeHub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AnimeHub - Anime Games Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnimeHaus - Anime Mini-Games & Quizzes',
    description: 'Play anime mini-games and quizzes with One Piece characters.',
    images: ['/og-image.png'],
    creator: '@animehaus',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="msapplication-TileColor" content="#1e3a8a" />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen bg-gradient-to-b from-[#041c2c] via-[#064663] to-[#f2d8a7] text-amber-100 relative overflow-x-hidden`}>        
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,225,150,0.15),transparent_60%)]"/>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,180,80,0.12),transparent_55%)]"/>
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 relative overflow-hidden">
            {/* One Piece themed background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#041c2c] via-[#064663] to-[#0a2847] opacity-95"></div>
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            
            {/* Pirate flag silhouettes */}
            <div className="absolute top-0 left-10 w-8 h-8 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-amber-400">
                <rect x="10" y="20" width="2" height="60" fill="currentColor"/>
                <path d="M12,20 Q40,15 68,20 Q65,35 68,50 Q40,55 12,50 Z" fill="currentColor"/>
                <circle cx="35" cy="30" r="3" fill="#000"/>
                <circle cx="50" cy="30" r="3" fill="#000"/>
                <path d="M30,40 Q42,45 55,40" stroke="#000" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            
            <div className="absolute top-0 right-10 w-6 h-6 opacity-8">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-amber-300">
                <circle cx="50" cy="50" r="40" fill="currentColor"/>
                <path d="M20,50 Q50,30 80,50 Q50,70 20,50" fill="#064663"/>
              </svg>
            </div>
            
            <div className="container flex h-14 items-center relative z-10">
              <div className="mr-4 hidden md:flex">
                <a className="mr-6 flex items-center space-x-2" href="/">
                  <span className="hidden font-bold sm:inline-block gradient-text text-xl">
                    One Piece Quest
                  </span>
                </a>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                  <a
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                    href="/characters"
                  >
                    Characters
                  </a>
                  <a
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                    href="/leaderboard"
                  >
                    Leaderboard
                  </a>
                </nav>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                type="button"
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-controls="radix-:R2qcq:"
                data-state="closed"
              >
                <svg
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                >
                  <path
                    d="M3 6h18M3 12h18M3 18h18"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="sr-only">Toggle Menu</span>
              </button>
              
              <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <div className="w-full flex-1 md:w-auto md:flex-none">
                  <a className="inline-flex items-center rounded-lg font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground py-2 px-4 gradient-text md:hidden" href="/">
                    One Piece Quest
                  </a>
                </div>
                <nav className="flex items-center space-x-2">
                  <a
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                    href="/games/grid"
                  >
                    Play Now
                  </a>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="py-6 md:px-8 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built by{" "}
                <a
                  href="https://github.com/animehaus"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  AnimeHaus Team
                </a>
                . The source code is available on{" "}
                <a
                  href="https://github.com/animehaus/animehaus"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  GitHub
                </a>
                .
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacy
                </a>
                <a
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Terms
                </a>
                <a
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
