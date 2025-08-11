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
            <div className="p-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">Seleccionar Wallpaper</h3>
              <p className="text-xs text-gray-300 mt-1">Personaliza el fondo de tu aventura</p>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {wallpapers.map((wallpaper) => (
                <button
                  key={wallpaper.id}
                  onClick={() => handleWallpaperChange(wallpaper.id)}
                  className={`w-full p-3 text-left transition-colors hover:bg-white/10 flex items-center space-x-3 ${
                    selectedWallpaper === wallpaper.id ? 'bg-blue-600/30 border-l-4 border-blue-400' : ''
                  }`}
                  role="menuitem"
                >
                  {/* Preview */}
                  <div className="w-12 h-8 rounded flex-shrink-0 overflow-hidden">
                    {wallpaper.preview === 'default' && (
                      <div className="w-full h-full bg-gradient-to-br from-[#041c2c] via-[#064663] to-[#f2d8a7]"></div>
                    )}
                    {wallpaper.preview === 'luffy' && (
                      <div className="w-full h-full bg-gradient-to-br from-red-600 via-red-500 to-yellow-400"></div>
                    )}
                    {wallpaper.preview === 'gear5' && (
                      <div className="w-full h-full bg-gradient-to-br from-white via-yellow-200 to-red-400"></div>
                    )}
                    {wallpaper.preview === 'zoro' && (
                      <div className="w-full h-full bg-gradient-to-br from-green-800 via-green-600 to-gray-900"></div>
                    )}
                    {wallpaper.preview === 'law' && (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 via-blue-500 to-gray-800"></div>
                    )}
                    {wallpaper.preview === 'mugiwara' && (
                      <div className="w-full h-full bg-gradient-to-br from-red-500 via-orange-400 to-blue-500"></div>
                    )}
                    {wallpaper.preview === 'brothers' && (
                      <div className="w-full h-full bg-gradient-to-br from-red-600 via-orange-500 to-blue-600"></div>
                    )}
                    {wallpaper.preview === 'wano-real' && (
                      <div className="w-full h-full bg-gradient-to-br from-purple-900 via-pink-600 to-orange-400"></div>
                    )}
                    {wallpaper.preview === 'wano-kaido' && (
                      <div className="w-full h-full bg-gradient-to-br from-purple-800 via-blue-600 to-teal-500"></div>
                    )}
                    {wallpaper.preview === 'kampai' && (
                      <div className="w-full h-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500"></div>
                    )}
                    {wallpaper.preview === 'face' && (
                      <div className="w-full h-full bg-gradient-to-br from-blue-800 via-red-600 to-yellow-400"></div>
                    )}
                    {wallpaper.preview === 'sunny' && (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600"></div>
                    )}
                    {wallpaper.preview === 'wano-svg' && (
                      <div className="w-full h-full bg-gradient-to-br from-purple-800 via-pink-600 to-red-500"></div>
                    )}
                    {wallpaper.preview === 'marine' && (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-700 to-white"></div>
                    )}
                    {wallpaper.preview === 'cake' && (
                      <div className="w-full h-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600"></div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {wallpaper.name}
                    </div>
                    {selectedWallpaper === wallpaper.id && (
                      <div className="text-xs text-blue-300 mt-1">✓ Actualmente seleccionado</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-white/10">
              <p className="text-xs text-gray-400">
                Los wallpapers se guardan automáticamente en tu navegador
              </p>
            </div>
          </div>
        </>,
        portalElRef.current
      )}
    </div>
  )
}
