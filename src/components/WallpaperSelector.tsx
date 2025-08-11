'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface Wallpaper {
  id: string
  name: string
  preview: string
  file: string
}

const wallpapers: Wallpaper[] = [
  {
    id: 'default',
    name: 'Océano Profundo',
    preview: 'default',
    file: 'default'
  },
  {
    id: 'barco',
    name: 'Barco',
    preview: 'barco',
    file: '/images/wallpapers/op-barco.webp'
  },
  {
    id: 'luffy',
    name: 'Luffy',
    preview: 'luffy',
    file: '/images/wallpapers/op-fluffy.webp'
  },
  {
    id: 'gear5',
    name: 'Gear 5',
    preview: 'gear5',
    file: '/images/wallpapers/op-fgear5.webp'
  },
  {
    id: 'zoro',
    name: 'Zoro',
    preview: 'zoro',
    file: '/images/wallpapers/op-fzoro.webp'
  },
  {
    id: 'law',
    name: 'Trafalgar Law',
    preview: 'law',
    file: '/images/wallpapers/op-flaw.webp'
  },
  {
    id: 'mugiwara',
    name: 'Mugiwaras',
    preview: 'mugiwara',
    file: '/images/wallpapers/op-fmugiwara.webp'
  },
  {
    id: 'brothers',
    name: 'Hermanos ASL',
    preview: 'brothers',
    file: '/images/wallpapers/op-fbrothers.webp'
  },
  {
    id: 'wano-real',
    name: 'Wano Arc',
    preview: 'wano-real',
    file: '/images/wallpapers/op-fwano.webp'
  },
  {
    id: 'wano-kaido',
    name: 'Wano vs Kaido',
    preview: 'wano-kaido',
    file: '/images/wallpapers/op-fwanok.webp'
  },
  {
    id: 'kampai',
    name: 'Kampai!',
    preview: 'kampai',
    file: '/images/wallpapers/op-fkampai.webp'
  },
  {
    id: 'face',
    name: 'One Piece Face',
    preview: 'face',
    file: '/images/wallpapers/op-face.webp'
  },
  {
    id: 'sunny',
    name: 'Thousand Sunny',
    preview: 'sunny',
    file: '/images/wallpapers/sunny-bg.svg'
  },
  {
    id: 'wano-svg',
    name: 'País de Wano (Arte)',
    preview: 'wano-svg',
    file: '/images/wallpapers/wano-bg.svg'
  },
  {
    id: 'marine',
    name: 'Marineford',
    preview: 'marine',
    file: '/images/wallpapers/marine-bg.svg'
  },
  {
    id: 'whole-cake',
    name: 'Whole Cake Island',
    preview: 'cake',
    file: '/images/wallpapers/cake-bg.svg'
  }
]

export default function WallpaperSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedWallpaper, setSelectedWallpaper] = useState('default')
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
    // Cargar wallpaper guardado del localStorage
    const savedWallpaper = localStorage.getItem('selectedWallpaper')
    if (savedWallpaper) {
      setSelectedWallpaper(savedWallpaper)
      applyWallpaper(savedWallpaper)
    }
  }, [])

  const applyWallpaper = (wallpaperId: string) => {
    const wallpaper = wallpapers.find(w => w.id === wallpaperId)
  const body = document.body
  const html = document.documentElement
    
    if (wallpaper) {
      if (wallpaper.file === 'default') {
        // Aplicar el gradiente por defecto y limpiar overlay
        body.className = body.className.replace(/bg-\[url\([^\]]+\)\]/g, '')
  body.classList.add('bg-gradient-to-b', 'from-[#041c2c]', 'via-[#064663]', 'to-[#f2d8a7]')
  body.classList.remove('has-custom-bg')
    html.classList.remove('has-custom-bg')
        
  // Limpiar estilos inline de background
        body.style.backgroundImage = ''
        body.style.backgroundSize = ''
        body.style.backgroundPosition = ''
        body.style.backgroundAttachment = ''
        body.style.backgroundRepeat = ''
    html.style.backgroundImage = ''
    html.style.backgroundSize = ''
    html.style.backgroundPosition = ''
    html.style.backgroundAttachment = ''
    html.style.backgroundRepeat = ''
  // Remover capa de fondo si existe
  const bgLayer = document.getElementById('wallpaper-bg')
  if (bgLayer) bgLayer.remove()
        
        // Remover overlay si existe
        const overlay = document.getElementById('wallpaper-overlay')
        if (overlay) {
          overlay.remove()
        }
      } else {
        // Aplicar imagen de fondo
        body.className = body.className.replace(/bg-gradient-to-b|from-\[[^\]]+\]|via-\[[^\]]+\]|to-\[[^\]]+\]/g, '')
        body.className = body.className.replace(/bg-\[url\([^\]]+\)\]/g, '')
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
        // Also mirror to body/html as fallback
        body.style.backgroundImage = `url('${wallpaper.file}')`
        body.style.backgroundSize = 'cover'
        body.style.backgroundPosition = 'center'
        body.style.backgroundAttachment = 'fixed'
        body.style.backgroundRepeat = 'no-repeat'
  body.classList.add('has-custom-bg')
    // Mirror on <html> to ensure background shows even if body layers are covered in some routes
    html.style.backgroundImage = `url('${wallpaper.file}')`
    html.style.backgroundSize = 'cover'
    html.style.backgroundPosition = 'center'
    html.style.backgroundAttachment = 'fixed'
    html.style.backgroundRepeat = 'no-repeat'
    html.classList.add('has-custom-bg')
        
        // Añadir overlay para legibilidad
        const overlay = document.getElementById('wallpaper-overlay')
        if (!overlay) {
          const overlayDiv = document.createElement('div')
          overlayDiv.id = 'wallpaper-overlay'
          overlayDiv.className = 'fixed inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50 pointer-events-none z-0'
          body.insertBefore(overlayDiv, body.firstChild)
        }
      }
    }
  }

  const handleWallpaperChange = (wallpaperId: string) => {
    setSelectedWallpaper(wallpaperId)
    localStorage.setItem('selectedWallpaper', wallpaperId)
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
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: wallpaper.file === 'default' ? 'linear-gradient(135deg, #041c2c, #064663, #f2d8a7)' : `url('${wallpaper.file}')` }}
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
