'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface Wallpaper {
  id: string
  name: string
  preview: string
  file: string
}

// Removed 'default' gradient background. Only image wallpapers remain.
const wallpapers: Wallpaper[] = [
  { id: 'barco', name: 'Barco', preview: 'barco', file: '/images/wallpapers/op-barco.webp' },
  { id: 'characters', name: 'Personajes', preview: 'characters', file: '/images/wallpapers/op-characters.webp' },
  { id: 'logo', name: 'Logo One Piece', preview: 'logo', file: '/images/wallpapers/op-logo.webp' },
  { id: 'luffy1', name: 'Luffy 1', preview: 'luffy1', file: '/images/wallpapers/op-luffy1.webp' },
  { id: 'luffy2', name: 'Luffy 2', preview: 'luffy2', file: '/images/wallpapers/op-luffy2.webp' },
  { id: 'luffy3', name: 'Luffy 3', preview: 'luffy3', file: '/images/wallpapers/op-luffy3.webp' },
  { id: 'luffyboa', name: 'Luffy & Boa', preview: 'luffyboa', file: '/images/wallpapers/op-luffyboa.webp' },
  { id: 'wanted', name: 'Wanted', preview: 'wanted', file: '/images/wallpapers/op-wanted.webp' }
]

export default function WallpaperSelector() {
  const [isOpen, setIsOpen] = useState(false)
  // Start with empty, will be randomized on mount.
  const [selectedWallpaper, setSelectedWallpaper] = useState<string>('')
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const portalElRef = useRef<HTMLDivElement | null>(null)

  // Create a portal root for rendering dropdown outside header stacking/overflow
  useEffect(() => {
    const el = document.createElement('div')
    el.setAttribute('id', 'wallpaper-selector-portal')
    document.body.appendChild(el)
    portalElRef.current = el
    return () => {
      if (portalElRef.current) {
        document.body.removeChild(portalElRef.current)
        portalElRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    // Random wallpaper on each visit (ignores any previous selection)
    const random = wallpapers[Math.floor(Math.random() * wallpapers.length)]
    if (random) {
      setSelectedWallpaper(random.id)
      applyWallpaper(random.id)
    }
  }, [])

  const applyWallpaper = (wallpaperId: string) => {
    const wallpaper = wallpapers.find(w => w.id === wallpaperId)
    if (!wallpaper) return
    const body = document.body
    const html = document.documentElement
  // Mark that a custom wallpaper is active (used by global CSS to adjust overlays / hide default homepage bg)
  body.classList.add('has-custom-bg')
  html.classList.add('has-custom-bg')
    // Ensure a fixed full-screen background layer exists
    let bgLayer = document.getElementById('wallpaper-bg') as HTMLDivElement | null
    if (!bgLayer) {
      bgLayer = document.createElement('div')
      bgLayer.id = 'wallpaper-bg'
      bgLayer.className = 'fixed inset-0 pointer-events-none z-0'
      document.body.insertBefore(bgLayer, document.body.firstChild)
    }
    Object.assign(bgLayer.style, {
      backgroundImage: `url('${wallpaper.file}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat'
    } as CSSStyleDeclaration)
    // Mirror to body/html
    body.style.backgroundImage = `url('${wallpaper.file}')`
    body.style.backgroundSize = 'cover'
    body.style.backgroundPosition = 'center'
    body.style.backgroundAttachment = 'fixed'
    body.style.backgroundRepeat = 'no-repeat'
    html.style.backgroundImage = `url('${wallpaper.file}')`
    html.style.backgroundSize = 'cover'
    html.style.backgroundPosition = 'center'
    html.style.backgroundAttachment = 'fixed'
    html.style.backgroundRepeat = 'no-repeat'
    // Overlay for readability
    const existingOverlay = document.getElementById('wallpaper-overlay')
    if (!existingOverlay) {
      const overlayDiv = document.createElement('div')
      overlayDiv.id = 'wallpaper-overlay'
      overlayDiv.className = 'fixed inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50 pointer-events-none z-0'
      body.insertBefore(overlayDiv, body.firstChild)
    }
  }

  const handleWallpaperChange = (wallpaperId: string) => {
    setSelectedWallpaper(wallpaperId)
  // No persistence; next visit will randomize again.
    applyWallpaper(wallpaperId)
    setIsOpen(false)
  }

  const handleToggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const menuWidth = 320
      const spacing = 8
      const tentativeLeft = rect.left
      const maxLeft = Math.max(8, window.innerWidth - menuWidth - 8)
      const left = Math.min(tentativeLeft, maxLeft)
      const top = rect.bottom + spacing
      setMenuPos({ top, left })
    }
    setIsOpen(!isOpen)
  }

  // Reposition on resize/scroll when open
  useEffect(() => {
    if (!isOpen) return
    const updatePos = () => {
      if (!buttonRef.current) return
      const rect = buttonRef.current.getBoundingClientRect()
      const menuWidth = 320
      const spacing = 8
      const tentativeLeft = rect.left
      const maxLeft = Math.max(8, window.innerWidth - menuWidth - 8)
      const left = Math.min(tentativeLeft, maxLeft)
      const top = rect.bottom + spacing
      setMenuPos({ top, left })
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('resize', updatePos)
    window.addEventListener('scroll', updatePos, { passive: true })
    window.addEventListener('keydown', onKey)
    updatePos()
    return () => {
      window.removeEventListener('resize', updatePos)
      window.removeEventListener('scroll', updatePos)
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  const currentWallpaper = wallpapers.find(w => w.id === selectedWallpaper)

  return (
    <div className="relative">
      {/* Botón del selector */}
      <button
        ref={buttonRef}
        onClick={handleToggleDropdown}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20"
        title="Cambiar wallpaper"
        type="button"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="hidden md:inline">Wallpaper</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown rendered via portal to avoid clipping by header */}
      {isOpen && portalElRef.current && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="backdrop-highest fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          {/* Menu desplegable */}
          <div
            className="dropdown-highest fixed bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl overflow-hidden"
            style={{
              width: 320,
              maxHeight: 400,
              top: menuPos.top,
              left: menuPos.left
            }}
            role="menu"
            aria-label="Selector de wallpaper"
          >
            {/* Grid previews without titles */}
            <div className="grid grid-cols-2 gap-2 p-2 max-h-80 overflow-y-auto">
              {wallpapers.map((wallpaper) => (
                <button
                  key={wallpaper.id}
                  onClick={() => handleWallpaperChange(wallpaper.id)}
                  className={`relative aspect-[3/2] rounded-lg overflow-hidden border ${selectedWallpaper === wallpaper.id ? 'border-blue-400 ring-2 ring-blue-400/60' : 'border-white/20'} hover:brightness-110 transition`}
                  role="menuitem"
                  title={wallpaper.name}
                >
                  <img
                    src={`${wallpaper.file}?v=1`}
                    alt={wallpaper.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </button>
              ))}
            </div>
          </div>
        </>,
        portalElRef.current
      )}
    </div>
  )
}
