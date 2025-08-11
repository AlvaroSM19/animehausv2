
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Modelo de datos para una categoría y sus elementos
export interface TapOneElement {
  name: string;
  image: string; // ruta relativa a public
}

export interface TapOneCategory {
  id: string;
  label: string;
  elements: TapOneElement[];
}


// Datos completos de categorías y elementos (ordenados de mejor a peor)
const categories: TapOneCategory[] = [
  {
    id: 'strength', label: 'Strength', elements: [
      { name: 'Kaido', image: '/images/tapone/strength/op-t1strenghtkaido.webp' },
      { name: 'Edward Newgate', image: '/images/tapone/strength/op-t1strenghtnewgate.webp' },
      { name: 'Roger', image: '/images/tapone/strength/op-t1strenghtroger.webp' },
      { name: 'Monkey D. Garp', image: '/images/tapone/strength/op-t1strenghtgarp.webp' },
      { name: 'Big Mom', image: '/images/tapone/strength/op-t1strenghtbigmom.webp' },
      { name: 'Jinbe', image: '/images/tapone/strength/op-t1strenghtjinbe.webp' },
      { name: 'Franky', image: '/images/tapone/strength/op-t1strenghtfranky.webp' },
      { name: 'Usopp', image: '/images/tapone/strength/op-t1strenghtussop.webp' },
      { name: 'Nami', image: '/images/tapone/strength/op-t1strenghtnami.webp' },
    ]
  },
  {
    id: 'haki', label: 'Haki', elements: [
      { name: 'Shanks', image: '/images/tapone/haki/op-t1hakishanks.webp' },
      { name: 'Gol D. Roger', image: '/images/tapone/haki/op-t1hakiroger.webp' },
      { name: 'Monkey D. Garp', image: '/images/tapone/haki/op-t1hakigarp.webp' },
      { name: 'Luffy', image: '/images/tapone/haki/op-t1hakiluffy.webp' },
      { name: 'Silvers Rayleigh', image: '/images/tapone/haki/op-t1hakirayleigh.webp' },
      { name: 'Charlotte Katakuri', image: '/images/tapone/haki/op-t1hakikatakuri.webp' },
      { name: 'Roronoa Zoro', image: '/images/tapone/haki/op-t1hakizoro.webp' },
      { name: 'Chopper', image: '/images/tapone/haki/op-t1hakicopper.webp' },
      { name: 'Bepo', image: '/images/tapone/haki/op-t1hakibepo.webp' },
    ]
  },
  {
    id: 'race', label: 'Race', elements: [
      { name: 'Lunaria', image: '/images/tapone/race/op-t1lunarian.webp' },
      { name: 'Oni', image: '/images/tapone/race/op-t1oni.webp' },
      { name: 'Giant', image: '/images/tapone/race/op-t1giant.webp' },
      { name: 'Mink', image: '/images/tapone/race/op-t1mink.webp' },
      { name: 'Gyojin', image: '/images/tapone/race/op-t1gyogin.webp' },
      { name: 'Human', image: '/images/tapone/race/op-t1human.webp' },
      { name: 'Shandia', image: '/images/tapone/race/op-t1shandia.webp' },
      { name: 'Tontatta', image: '/images/tapone/race/op-t1tontatta.webp' },
      { name: 'Long Leg', image: '/images/tapone/race/op-t1longleg.webp' },
    ]
  },
  {
    id: 'logia', label: 'Logia', elements: [
      { name: 'Blackbeard', image: '/images/tapone/logia/op-t1blackbeard.webp' },
      { name: 'Kizaru', image: '/images/tapone/logia/op-t1kizaru.webp' },
      { name: 'Akainu', image: '/images/tapone/logia/op-t1akainu.webp' },
      { name: 'Aokiji', image: '/images/tapone/logia/op-t1aokiji.webp' },
      { name: 'Enel', image: '/images/tapone/logia/op-t1enel.webp' },
      { name: 'Crocodile', image: '/images/tapone/logia/op-t1crocodile.webp' },
      { name: 'Smoker', image: '/images/tapone/logia/op-t1smoker.webp' },
      { name: 'Katakuri', image: '/images/tapone/logia/op-t1katakuri.webp' },
      { name: 'Caesar Clown', image: '/images/tapone/logia/op-t1caesarclown.webp' },
    ]
  },
  {
    id: 'paramecia', label: 'Paramecia', elements: [
      { name: 'Edward Newgate', image: '/images/tapone/paramecia/op-t1newgate.webp' },
      { name: 'Trafalgar Law', image: '/images/tapone/paramecia/op-t1law.webp' },
      { name: 'Bartholomew Kuma', image: '/images/tapone/paramecia/op-t1kuma.webp' },
      { name: 'Magellan', image: '/images/tapone/paramecia/op-t1magellan.webp' },
      { name: 'Donquixote Doflamingo', image: '/images/tapone/paramecia/op-t1doflamingo.webp' },
      { name: 'Nico Robin', image: '/images/tapone/paramecia/op-t1robin.webp' },
      { name: 'Mr. 5', image: '/images/tapone/paramecia/op-t1mr5.webp' },
      { name: 'Sugar', image: '/images/tapone/paramecia/op-t1sugar.webp' },
      { name: 'Alvida', image: '/images/tapone/paramecia/op-t1alvida.webp' },
    ]
  },
  {
    id: 'zoan', label: 'Zoan', elements: [
      { name: 'Rob Lucci', image: '/images/tapone/zoan/op-t1luccy.webp' },
      { name: 'Jack', image: '/images/tapone/zoan/op-t1jack.webp' },
      { name: 'X Drake', image: '/images/tapone/zoan/op-t1drake.webp' },
      { name: 'Page One', image: '/images/tapone/zoan/op-t1pageone.webp' },
      { name: 'Who’s Who', image: '/images/tapone/zoan/op-t1whoswho.webp' },
      { name: 'Catarina Devon', image: '/images/tapone/zoan/op-t1catarinazoan.webp' },
      { name: 'Babanuki', image: '/images/tapone/zoan/op-t1babanuki.webp' },
      { name: 'Kaku', image: '/images/tapone/zoan/op-t1kaku.webp' },
      { name: 'Dalton', image: '/images/tapone/zoan/op-t1dalton.webp' },
    ]
  },
  {
    id: 'mythical-zoan', label: 'Mythical Zoan', elements: [
      { name: 'Luffy', image: '/images/tapone/mythical-zoan/op-t1luffy.webp' },
      { name: 'Kaido', image: '/images/tapone/mythical-zoan/op-t1kaido.webp' },
      { name: 'Sengoku', image: '/images/tapone/mythical-zoan/op-t1sengoku.webp' },
      { name: 'Marco', image: '/images/tapone/mythical-zoan/op-t1marco.webp' },
      { name: 'Yamato', image: '/images/tapone/mythical-zoan/op-t1yamato.webp' },
      { name: 'Catarina Devon', image: '/images/tapone/mythical-zoan/op-t1catarinadevon.webp' },
      { name: 'Orochi', image: '/images/tapone/mythical-zoan/op-t1orochi.webp' },
      { name: 'Onimaru', image: '/images/tapone/mythical-zoan/op-t1onimaru.webp' },
      { name: 'Stronger', image: '/images/tapone/mythical-zoan/op-t1stronger.webp' },
    ]
  },
  {
    id: 'sensei', label: 'Sensei', elements: [
      { name: 'Rayleigh', image: '/images/tapone/sensei/op-t1rayleigh.webp' },
      { name: 'Garp', image: '/images/tapone/sensei/op-t1garp.webp' },
      { name: 'Mihawk', image: '/images/tapone/sensei/op-t1mihawk.webp' },
      { name: 'Whitebeard', image: '/images/tapone/sensei/op-t1whitebeard.webp' },
      { name: 'Oden', image: '/images/tapone/sensei/op-t1oden.webp' },
      { name: 'Shanks', image: '/images/tapone/sensei/op-t1shanks.webp' },
      { name: 'Jinbe', image: '/images/tapone/sensei/op-t1jinbe.webp' },
      { name: 'Koby', image: '/images/tapone/sensei/op-t1koby.webp' },
      { name: 'Tiger', image: '/images/tapone/sensei/op-t1tiger.webp' },
    ]
  },
  {
    id: 'ship', label: 'Ship', elements: [
      { name: 'Thousand Sunny', image: '/images/tapone/ship/op-t1thousandsunny.webp' },
      { name: 'Oro Jackson', image: '/images/tapone/ship/op-t1orojackson.webp' },
      { name: 'Red Force', image: '/images/tapone/ship/op-t1redforce.webp' },
      { name: 'Moby Dick', image: '/images/tapone/ship/op-t1mobydick.webp' },
      { name: 'Queen Mama Chanter', image: '/images/tapone/ship/op-t1queenmamachanter.webp' },
      { name: 'Noah', image: '/images/tapone/ship/op-t1noah.webp' },
      { name: 'Beast Pirates', image: '/images/tapone/ship/op-t1beastpiratesship.webp' },
      { name: 'Polar Tang', image: '/images/tapone/ship/op-t1polartang.webp' },
      { name: 'Germa 66', image: '/images/tapone/ship/op-t1germa66.webp' },
    ]
  },
  {
    id: 'creature', label: 'Creature', elements: [
      { name: 'Zunesha', image: '/images/tapone/creature/op-t1zunesha.webp' },
      { name: 'Sea King', image: '/images/tapone/creature/op-t1seaking.webp' },
      { name: 'Dragon 13', image: '/images/tapone/creature/op-t1dragon13.webp' },
      { name: 'Smiley', image: '/images/tapone/creature/op-t1smiley.webp' },
      { name: 'Nola', image: '/images/tapone/creature/op-t1nola.webp' },
      { name: 'Laboon', image: '/images/tapone/creature/op-t1laboon.webp' },
      { name: 'Humandrill', image: '/images/tapone/creature/op-t1humandrill.webp' },
      { name: 'Surume', image: '/images/tapone/creature/op-t1surume.webp' },
      { name: 'Ucy', image: '/images/tapone/creature/op-t1ucy.webp' },
    ]
  },
];


const ROTATE_INTERVAL = 150; // ms (un poco más lento)

const TapOneGame: React.FC = () => {

  // Estado de rotación global
  const [rotating, setRotating] = useState(true);
  // Índices actuales de cada categoría (para rotar)
  const [indices, setIndices] = useState<number[]>(categories.map(() => 0));
  // Categorías ya seleccionadas (no rotan)
  const [locked, setLocked] = useState<boolean[]>(categories.map(() => false));
  // Elementos seleccionados por el usuario (índice por categoría)
  const [selected, setSelected] = useState<(number | null)[]>(categories.map(() => null));
  // Ronda actual (cuántas selecciones llevamos)
  const [round, setRound] = useState(0);
  // Estado de fin de juego
  const finished = locked.every(Boolean);

  // Rotación automática de elementos (solo si rotating y no finished)
  useEffect(() => {
    if (!rotating || finished) return;
    const interval = setInterval(() => {
      setIndices(prev => prev.map((idx, i) =>
        locked[i] ? idx : (idx + 1) % categories[i].elements.length
      ));
    }, ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [locked, finished, rotating]);

  // Parar la rotación
  const handleStop = () => setRotating(false);

  // Seleccionar una categoría (solo si está parado)
  const handleSelect = (catIdx: number) => {
    if (locked[catIdx] || finished || rotating) return;
    const newLocked = [...locked];
    newLocked[catIdx] = true;
    const newSelected = [...selected];
    newSelected[catIdx] = indices[catIdx];
    setLocked(newLocked);
    setSelected(newSelected);
    setRound(round + 1);
    // Si no es la última ronda, volver a rotar tras un pequeño delay
    if (newLocked.filter(Boolean).length < categories.length) {
      setTimeout(() => setRotating(true), 600);
    }
  };

  // Reiniciar el juego
  const handleRestart = () => {
    setIndices(categories.map(() => 0));
    setLocked(categories.map(() => false));
    setSelected(categories.map(() => null));
    setRound(0);
    setRotating(true);
  };

  return (
    <div>
      {/* Header: breadcrumb + title + actions */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 mb-4">
        <div className="flex items-center gap-2 text-slate-300/90 text-sm mb-2">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-white/90 transition-colors">
            <span className="text-slate-300/80">←</span>
            <span>Inicio</span>
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-slate-100/90">Tap One</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide uppercase bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 drop-shadow">
            Tap One
          </h1>

          <div className="shrink-0">
            {finished && (
              <button
                onClick={handleRestart}
                className="px-4 md:px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg hover:from-emerald-400 hover:to-emerald-600 transition-colors"
              >
                Nuevo Juego
              </button>
            )}
          </div>
        </div>

        {/* Status pill */}
        <div className="mt-3 rounded-xl border border-violet-400/20 bg-violet-600/10 px-4 py-2 text-violet-200/90 text-sm">
          {finished ? (
            <span>Juego terminado — {categories.length}/{categories.length} seleccionadas.</span>
          ) : rotating ? (
            <span>Objetivo: elige a los mejores en cada categoría. Pulsa <b>¡Para!</b> para detener y elegir.</span>
          ) : (
            <span>Selecciona una categoría ({round + 1}/{categories.length}). Las demás volverán a girar.</span>
          )}
        </div>
      </section>

      {/* Grid: prefer 2 rows x 5 columns on desktop */}
      <div className="mx-auto max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 px-2">
        {categories.map((cat, i) => {
          const idx = locked[i] && selected[i] !== null ? selected[i]! : indices[i];
          const el = cat.elements[idx];
          const clickable = !locked[i] && !finished && !rotating;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(i)}
              disabled={!clickable}
              className={`group relative rounded-2xl p-[2px] transition-transform duration-200 ${clickable ? 'hover:scale-[1.02]' : ''}`}
              aria-label={`Seleccionar ${cat.label}`}
              style={{
                boxShadow: locked[i]
                  ? '0 0 0 2px rgba(139,92,246,0.65), 0 8px 24px rgba(139,92,246,0.25)'
                  : '0 12px 24px rgba(0,0,0,0.35)'
              }}
            >
              {/* Gradient border */}
              <div className={`rounded-2xl bg-gradient-to-br ${locked[i] ? 'from-violet-500/80 via-fuchsia-500/70 to-pink-500/70' : 'from-slate-600/50 via-slate-700/50 to-slate-800/50'}`}>
                {/* Card body */}
                <div className="rounded-[14px] bg-slate-900/70 backdrop-blur-md overflow-hidden flex flex-col items-center justify-between h-[230px] md:h-[260px]">
                  <div className="w-full flex-1 flex items-center justify-center">
                    <img
                      src={el.image}
                      alt={el.name}
                      className="w-full max-w-[220px] md:max-w-[240px] h-[140px] md:h-[160px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
                      draggable={false}
                      onError={e => { (e.target as HTMLImageElement).style.opacity = '0.35'; }}
                    />
                  </div>

                  {/* Footer label */}
                  <div className={`w-full py-2 text-center text-[11px] md:text-sm font-extrabold uppercase tracking-wide border-t ${locked[i] ? 'bg-gradient-to-r from-violet-600/30 via-fuchsia-600/25 to-pink-600/30 border-violet-400/30 text-violet-200' : 'bg-gradient-to-r from-slate-700/40 to-slate-800/40 border-slate-600/50 text-slate-200/90'}`}>
                    {cat.label}
                  </div>
                </div>
              </div>

              {/* Corner badge when locked */}
              {locked[i] && (
                <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-violet-600 text-white text-[11px] px-2 py-1 rounded-xl shadow-md">
                  ✓
                </span>
              )}

              {/* Focus ring when it is the time to select */}
              {clickable && (
                <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-violet-400/60 group-hover:ring-violet-300/80" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-center mt-8 gap-4">
        {finished ? (
          <button
            onClick={handleRestart}
            className="px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg hover:from-emerald-400 hover:to-emerald-600 transition-colors"
          >
            Nuevo Juego
          </button>
        ) : rotating ? (
          <button
            onClick={handleStop}
            className="px-8 py-3 rounded-xl font-extrabold text-white bg-gradient-to-r from-violet-500 to-fuchsia-600 shadow-[0_10px_24px_rgba(139,92,246,0.35)]"
          >
            ¡Para!
          </button>
        ) : (
          <span className="text-base md:text-lg text-violet-200/90 bg-violet-600/10 border border-violet-400/30 rounded-lg px-3 py-2">
            Selecciona una categoría ({round + 1}/{categories.length})
          </span>
        )}
      </div>

      {/* Summary */}
      {finished && (
        <div className="mt-10 text-center">
          <h2 className="text-xl font-bold mb-4 text-emerald-300">¡Juego terminado!</h2>
          <div className="mx-auto max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 px-2">
            {categories.map((cat, i) => {
              const idx = selected[i]!;
              const el = cat.elements[idx];
              return (
                <div key={cat.id} className="rounded-2xl p-[2px] bg-gradient-to-br from-violet-500/60 via-fuchsia-500/50 to-pink-500/50">
                  <div className="rounded-[14px] bg-slate-900/75 backdrop-blur-md overflow-hidden flex flex-col items-center h-[220px] md:h-[240px]">
                    <div className="w-full flex-1 flex items-center justify-center">
                      <img src={el.image} alt={el.name} className="w-full max-w-[220px] md:max-w-[240px] h-[130px] md:h-[150px] object-contain" />
                    </div>
                    <div className="w-full text-center text-[12px] font-semibold py-2 bg-gradient-to-r from-violet-700/30 via-fuchsia-700/25 to-pink-700/30">
                      <div className="text-violet-200">{cat.label}</div>
                      <div className="text-fuchsia-200/90">{el.name}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TapOneGame;
