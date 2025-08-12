
'use client';
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
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


const ROTATE_INTERVAL = 120; // ms (más fluido)
const AUTO_STOP_MIN = 2200; // 2.2 segundos mínimo
const AUTO_STOP_MAX = 3200; // 3.2 segundos máximo

// Rank info type and lookup table
type RankInfo = { title: string; bountyValue: number; rank: number };

const RANKS: RankInfo[] = [
  { rank: 1, title: '#1 PIRATE KING', bountyValue: 25_000_000_000 },
  { rank: 2, title: '#2 EMPEROR OF THE SEA', bountyValue: 15_000_000_000 },
  { rank: 3, title: '#3 LEGENDARY ADMIRAL', bountyValue: 10_000_000_000 },
  { rank: 4, title: '#4 FLEET ADMIRAL', bountyValue: 8_000_000_000 },
  { rank: 5, title: '#5 LEGEND OF THE SEAS', bountyValue: 6_000_000_000 },
  { rank: 6, title: '#6 WORLD GOVERNMENT ENEMY', bountyValue: 4_500_000_000 },
  { rank: 7, title: '#7 STRONGEST CREATURE', bountyValue: 3_500_000_000 },
  { rank: 8, title: '#8 WARLORD OF THE SEA', bountyValue: 2_800_000_000 },
  { rank: 9, title: '#9 FAMOUS CAPTAIN', bountyValue: 2_200_000_000 },
  { rank: 10, title: '#10 SUPERNOVA ELITE', bountyValue: 1_800_000_000 },
  { rank: 11, title: '#11 RESPECTED PIRATE', bountyValue: 1_400_000_000 },
  { rank: 12, title: '#12 SUPERNOVA', bountyValue: 1_000_000_000 },
  { rank: 13, title: '#13 ELITE BOUNTY HUNTER', bountyValue: 750_000_000 },
  { rank: 14, title: '#14 DANGEROUS PIRATE', bountyValue: 500_000_000 },
  { rank: 15, title: '#15 BOUNTY HUNTER', bountyValue: 300_000_000 },
  { rank: 16, title: '#16 PROMISING ROOKIE', bountyValue: 150_000_000 },
  { rank: 17, title: '#17 CREW MEMBER', bountyValue: 80_000_000 },
  { rank: 18, title: '#18 ROOKIE PIRATE', bountyValue: 30_000_000 },
  { rank: 19, title: '#19 SMALL THREAT', bountyValue: 5_000_000 },
  { rank: 20, title: '#20 ERRAND BOY', bountyValue: 100_000 },
];

const getRankInfoByRankNumber = (rank: number): RankInfo => {
  return RANKS[Math.min(Math.max(rank, 1), 20) - 1];
};

const TapOneGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  // Estado de rotación global
  const [rotating, setRotating] = useState(true);
  // Timer de auto-stop por fase de rotación
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  // Estado para mostrar los resultados
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [playerRank, setPlayerRank] = useState<RankInfo>({ title: '', bountyValue: 0, rank: 0 });
  // Estado para manejar localStorage en cliente
  const [isClient, setIsClient] = useState(false);
  const [bestRank, setBestRank] = useState<RankInfo | null>(null);
  // Ref to export only the poster area
  const posterRef = useRef<HTMLDivElement>(null);

  // Efecto para detectar si estamos en el cliente
  useEffect(() => {
    setIsClient(true);
    // Client-only: migrate old storage and load best rank
    try {
      const savedBestJson = localStorage.getItem('tapOneBest');
      if (savedBestJson) {
        const parsed = JSON.parse(savedBestJson) as RankInfo;
        if (parsed && typeof parsed.rank === 'number') {
          setBestRank(getRankInfoByRankNumber(parsed.rank));
          return;
        }
      }
      // Fallback to legacy key storing only rank number
      const legacyRank = localStorage.getItem('tapOneBestRank');
      if (legacyRank) {
        const rankNum = parseInt(legacyRank);
        if (!isNaN(rankNum)) {
          const info = getRankInfoByRankNumber(rankNum);
          setBestRank(info);
          localStorage.setItem('tapOneBest', JSON.stringify(info));
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Sistema de puntuación y rangos
  const calculateScore = () => {
    let totalScore = 0;
    selected.forEach((selectedIndex, categoryIndex) => {
      if (selectedIndex !== null) {
        // Puntuación inversa: 1º=100pts, 2º=90pts, ..., 9º=20pts
        const points = 110 - (selectedIndex + 1) * 10;
        totalScore += points;
      }
    });
    return totalScore;
  };

  const getRankAndBounty = (score: number): RankInfo => {
    let rank = 20;
    if (score >= 950) rank = 1;
    else if (score >= 900) rank = 2;
    else if (score >= 850) rank = 3;
    else if (score >= 800) rank = 4;
    else if (score >= 750) rank = 5;
    else if (score >= 700) rank = 6;
    else if (score >= 650) rank = 7;
    else if (score >= 600) rank = 8;
    else if (score >= 550) rank = 9;
    else if (score >= 500) rank = 10;
    else if (score >= 450) rank = 11;
    else if (score >= 400) rank = 12;
    else if (score >= 350) rank = 13;
    else if (score >= 300) rank = 14;
    else if (score >= 250) rank = 15;
    else if (score >= 200) rank = 16;
    else if (score >= 150) rank = 17;
    else if (score >= 100) rank = 18;
    else if (score >= 50) rank = 19;
    return getRankInfoByRankNumber(rank);
  };

  // Rotación automática de elementos
  useEffect(() => {
    if (!rotating || finished) return;
    
    const interval = setInterval(() => {
      setIndices(prev => prev.map((idx, i) =>
        locked[i] ? idx : (idx + 1) % categories[i].elements.length
      ));
    }, ROTATE_INTERVAL);
    
    return () => clearInterval(interval);
  }, [locked, finished, rotating]);

  // Auto-stop timer: para automáticamente entre MIN y MAX (solo cliente)
  useEffect(() => {
    if (!isClient) return;
    // Cuando inicia una rotación, programamos un auto-stop
    if (rotating && !finished) {
      // Cancelar cualquier timer previo
      if (autoStopRef.current) {
        clearTimeout(autoStopRef.current);
        autoStopRef.current = null;
      }
      const randomDelay = AUTO_STOP_MIN + Math.floor(Math.random() * (AUTO_STOP_MAX - AUTO_STOP_MIN + 1));
      autoStopRef.current = setTimeout(() => {
        setRotating(false);
      }, randomDelay);
    }
    // Cleanup cuando se detiene la rotación o finaliza el juego
    return () => {
      if ((!rotating || finished) && autoStopRef.current) {
        clearTimeout(autoStopRef.current);
        autoStopRef.current = null;
      }
    };
  }, [rotating, finished, round, isClient]);

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
      // limpiar auto-stop previo y re-iniciar rotación limpia
      if (autoStopRef.current) {
        clearTimeout(autoStopRef.current);
        autoStopRef.current = null;
      }
      setTimeout(() => setRotating(true), 500);
    }
  };

  // Funciones de exportación
  const exportBountyPoster = async () => {
    // Export only the poster area if available
    const target = posterRef.current ?? gameRef.current;
    if (!target) return;
    
    try {
  const canvas = await html2canvas(target, {
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
  link.download = `tap-one-bounty-rank-${playerRank.rank}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  // Reiniciar el juego
  const handleRestart = () => {
    if (autoStopRef.current) {
      clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
    setIndices(categories.map(() => 0));
    setLocked(categories.map(() => false));
    setSelected(categories.map(() => null));
    setRound(0);
    setRotating(true);
    setShowResults(false);
    setFinalScore(0);
  };

  // Calcular puntuación al finalizar
  useEffect(() => {
    if (finished && !showResults && isClient) {
      const score = calculateScore();
      const rank = getRankAndBounty(score);
      setFinalScore(score);
      setPlayerRank(rank);
      
      // Guardar mejor rango (menor número es mejor) solo en cliente
      if (isClient) {
        try {
          const currentBestJson = localStorage.getItem('tapOneBest');
          let currentBest: RankInfo | null = null;
          if (currentBestJson) {
            currentBest = JSON.parse(currentBestJson) as RankInfo;
          }
          if (!currentBest || rank.rank < currentBest.rank) {
            localStorage.setItem('tapOneBest', JSON.stringify(rank));
            setBestRank(rank);
          }
        } catch (e) {
          // ignore
        }
      }
      
      // Mostrar resultados tras un breve delay
      setTimeout(() => setShowResults(true), 1000);
    }
  }, [finished, showResults, isClient]);

  return (
    <div ref={gameRef}>
      {/* Header: breadcrumb + title + actions */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 mb-4">
        <div className="flex items-center gap-2 text-slate-300/90 text-sm mb-2">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-white/90 transition-colors">
            <span className="text-slate-300/80">←</span>
            <span>Home</span>
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
                New Game
              </button>
            )}
          </div>
        </div>

        {/* Status pill */}
        <div className="mt-3 rounded-xl border border-violet-400/20 bg-violet-600/10 px-4 py-2 text-violet-200/90 text-sm">
          {finished ? (
            <span>Game completed — {categories.length}/{categories.length} categories selected.</span>
          ) : rotating ? (
            <span>🎰 Categories rotating automatically. Wait for auto-stop, then choose the best!</span>
          ) : (
            <span>Select a category ({round + 1}/{categories.length}). The others will start spinning again.</span>
          )}
        </div>
      </section>

      {/* Grid: 3 filas x 4 columnas */}
      <div className="mx-auto max-w-6xl">
        {/* Fila 1: Strength, Haki, Race, Sensei */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 px-2 mb-4">
          {categories.slice(0, 4).map((cat, i) => {
            const idx = locked[i] && selected[i] !== null ? selected[i]! : indices[i];
            const el = cat.elements[idx];
            const clickable = !locked[i] && !finished && !rotating;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(i)}
                disabled={!clickable}
                className={`group relative rounded-2xl p-[2px] transition-transform duration-200 ${clickable ? 'hover:scale-[1.02]' : ''}`}
                aria-label={`Select ${cat.label}`}
                style={{
                  boxShadow: locked[i]
                    ? '0 0 0 2px rgba(139,92,246,0.65), 0 8px 24px rgba(139,92,246,0.25)'
                    : '0 12px 24px rgba(0,0,0,0.35)'
                }}
              >
                <div className={`rounded-2xl bg-gradient-to-br ${locked[i] ? 'from-violet-500/80 via-fuchsia-500/70 to-pink-500/70' : 'from-slate-600/50 via-slate-700/50 to-slate-800/50'}`}>
                  <div className="rounded-[14px] bg-slate-900/70 backdrop-blur-md overflow-hidden flex flex-col items-center justify-between h-[200px] md:h-[220px]">
                    <div className="w-full flex-1 flex items-center justify-center">
                      <img
                        src={el.image}
                        alt={el.name}
                        className="w-full max-w-[180px] md:max-w-[200px] h-[110px] md:h-[130px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
                        draggable={false}
                        onError={e => { (e.target as HTMLImageElement).style.opacity = '0.35'; }}
                      />
                    </div>
                    <div className={`w-full py-2 text-center text-[11px] md:text-sm font-extrabold uppercase tracking-wide border-t ${locked[i] ? 'bg-gradient-to-r from-violet-600/30 via-fuchsia-600/25 to-pink-600/30 border-violet-400/30 text-violet-200' : 'bg-gradient-to-r from-slate-700/40 to-slate-800/40 border-slate-600/50 text-slate-200/90'}`}>
                      {cat.label}
                    </div>
                  </div>
                </div>
                {locked[i] && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-violet-600 text-white text-[11px] px-2 py-1 rounded-xl shadow-md">✓</span>
                )}
                {clickable && (
                  <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-violet-400/60 group-hover:ring-violet-300/80" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Fila 2: Logia, Paramecia, Zoan, Mythical Zoan */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 px-2 mb-4">
          {categories.slice(4, 8).map((cat, i) => {
            const catIndex = i + 4;
            const idx = locked[catIndex] && selected[catIndex] !== null ? selected[catIndex]! : indices[catIndex];
            const el = cat.elements[idx];
            const clickable = !locked[catIndex] && !finished && !rotating;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(catIndex)}
                disabled={!clickable}
                className={`group relative rounded-2xl p-[2px] transition-transform duration-200 ${clickable ? 'hover:scale-[1.02]' : ''}`}
                aria-label={`Select ${cat.label}`}
                style={{
                  boxShadow: locked[catIndex]
                    ? '0 0 0 2px rgba(139,92,246,0.65), 0 8px 24px rgba(139,92,246,0.25)'
                    : '0 12px 24px rgba(0,0,0,0.35)'
                }}
              >
                <div className={`rounded-2xl bg-gradient-to-br ${locked[catIndex] ? 'from-violet-500/80 via-fuchsia-500/70 to-pink-500/70' : 'from-slate-600/50 via-slate-700/50 to-slate-800/50'}`}>
                  <div className="rounded-[14px] bg-slate-900/70 backdrop-blur-md overflow-hidden flex flex-col items-center justify-between h-[200px] md:h-[220px]">
                    <div className="w-full flex-1 flex items-center justify-center">
                      <img
                        src={el.image}
                        alt={el.name}
                        className="w-full max-w-[180px] md:max-w-[200px] h-[110px] md:h-[130px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
                        draggable={false}
                        onError={e => { (e.target as HTMLImageElement).style.opacity = '0.35'; }}
                      />
                    </div>
                    <div className={`w-full py-2 text-center text-[11px] md:text-sm font-extrabold uppercase tracking-wide border-t ${locked[catIndex] ? 'bg-gradient-to-r from-violet-600/30 via-fuchsia-600/25 to-pink-600/30 border-violet-400/30 text-violet-200' : 'bg-gradient-to-r from-slate-700/40 to-slate-800/40 border-slate-600/50 text-slate-200/90'}`}>
                      {cat.label}
                    </div>
                  </div>
                </div>
                {locked[catIndex] && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-violet-600 text-white text-[11px] px-2 py-1 rounded-xl shadow-md">✓</span>
                )}
                {clickable && (
                  <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-violet-400/60 group-hover:ring-violet-300/80" />
                )}
              </button>
            );
          })}
        </div>
        
  {/* Fila 3: Ship, Best Rank, Best Rank (detail), Creature */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 px-2">
          {/* Ship (índice 8) */}
          {(() => {
            const catIndex = 8;
            const cat = categories[catIndex];
            const idx = locked[catIndex] && selected[catIndex] !== null ? selected[catIndex]! : indices[catIndex];
            const el = cat.elements[idx];
            const clickable = !locked[catIndex] && !finished && !rotating;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(catIndex)}
                disabled={!clickable}
                className={`group relative rounded-2xl p-[2px] transition-transform duration-200 ${clickable ? 'hover:scale-[1.02]' : ''}`}
                aria-label={`Select ${cat.label}`}
                style={{
                  boxShadow: locked[catIndex]
                    ? '0 0 0 2px rgba(139,92,246,0.65), 0 8px 24px rgba(139,92,246,0.25)'
                    : '0 12px 24px rgba(0,0,0,0.35)'
                }}
              >
                <div className={`rounded-2xl bg-gradient-to-br ${locked[catIndex] ? 'from-violet-500/80 via-fuchsia-500/70 to-pink-500/70' : 'from-slate-600/50 via-slate-700/50 to-slate-800/50'}`}>
                  <div className="rounded-[14px] bg-slate-900/70 backdrop-blur-md overflow-hidden flex flex-col items-center justify-between h-[200px] md:h-[220px]">
                    <div className="w-full flex-1 flex items-center justify-center">
                      <img
                        src={el.image}
                        alt={el.name}
                        className="w-full max-w-[180px] md:max-w-[200px] h-[110px] md:h-[130px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
                        draggable={false}
                        onError={e => { (e.target as HTMLImageElement).style.opacity = '0.35'; }}
                      />
                    </div>
                    <div className={`w-full py-2 text-center text-[11px] md:text-sm font-extrabold uppercase tracking-wide border-t ${locked[catIndex] ? 'bg-gradient-to-r from-violet-600/30 via-fuchsia-600/25 to-pink-600/30 border-violet-400/30 text-violet-200' : 'bg-gradient-to-r from-slate-700/40 to-slate-800/40 border-slate-600/50 text-slate-200/90'}`}>
                      {cat.label}
                    </div>
                  </div>
                </div>
                {locked[catIndex] && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-violet-600 text-white text-[11px] px-2 py-1 rounded-xl shadow-md">✓</span>
                )}
                {clickable && (
                  <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-violet-400/60 group-hover:ring-violet-300/80" />
                )}
              </button>
            );
          })()}
          
          {/* Best Rank Display (compact) */}
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-amber-500/60 via-yellow-500/60 to-orange-500/60">
            <div className="rounded-[14px] bg-slate-900/70 backdrop-blur-md overflow-hidden flex flex-col items-center justify-center h-[200px] md:h-[220px] px-3">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-semibold text-amber-300">🏆 Best Rank</h3>
                {bestRank ? (
                  <>
                    <div className="text-2xl md:text-3xl font-extrabold text-amber-200">#{bestRank.rank}</div>
                    <div className="text-[11px] md:text-xs text-amber-100/90 font-bold leading-snug">{bestRank.title}</div>
                    <div className="text-[11px] md:text-xs text-emerald-300 font-extrabold">
                      ₿{bestRank.bountyValue.toLocaleString()} BERRIES
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-amber-200/90">Not set</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Best Rank Display (detailed) */}
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-amber-500/60 via-yellow-500/60 to-orange-500/60">
            <div className="rounded-[14px] bg-slate-900/70 backdrop-blur-md overflow-hidden flex flex-col items-center justify-center h-[200px] md:h-[220px] px-3">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-semibold text-amber-300">� Best Rank</h3>
                {bestRank ? (
                  <>
                    <div className="text-2xl md:text-3xl font-extrabold text-amber-200">#{bestRank.rank}</div>
                    <div className="text-[11px] md:text-xs text-amber-100/90 font-bold leading-snug">{bestRank.title}</div>
                    <div className="text-[11px] md:text-xs text-emerald-300 font-extrabold">
                      ₿{bestRank.bountyValue.toLocaleString()} BERRIES
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-amber-200/90">Not set</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Creature (índice 9) */}
          {(() => {
            const catIndex = 9;
            const cat = categories[catIndex];
            const idx = locked[catIndex] && selected[catIndex] !== null ? selected[catIndex]! : indices[catIndex];
            const el = cat.elements[idx];
            const clickable = !locked[catIndex] && !finished && !rotating;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(catIndex)}
                disabled={!clickable}
                className={`group relative rounded-2xl p-[2px] transition-transform duration-200 ${clickable ? 'hover:scale-[1.02]' : ''}`}
                aria-label={`Select ${cat.label}`}
                style={{
                  boxShadow: locked[catIndex]
                    ? '0 0 0 2px rgba(139,92,246,0.65), 0 8px 24px rgba(139,92,246,0.25)'
                    : '0 12px 24px rgba(0,0,0,0.35)'
                }}
              >
                <div className={`rounded-2xl bg-gradient-to-br ${locked[catIndex] ? 'from-violet-500/80 via-fuchsia-500/70 to-pink-500/70' : 'from-slate-600/50 via-slate-700/50 to-slate-800/50'}`}>
                  <div className="rounded-[14px] bg-slate-900/70 backdrop-blur-md overflow-hidden flex flex-col items-center justify-between h-[200px] md:h-[220px]">
                    <div className="w-full flex-1 flex items-center justify-center">
                      <img
                        src={el.image}
                        alt={el.name}
                        className="w-full max-w-[180px] md:max-w-[200px] h-[110px] md:h-[130px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
                        draggable={false}
                        onError={e => { (e.target as HTMLImageElement).style.opacity = '0.35'; }}
                      />
                    </div>
                    <div className={`w-full py-2 text-center text-[11px] md:text-sm font-extrabold uppercase tracking-wide border-t ${locked[catIndex] ? 'bg-gradient-to-r from-violet-600/30 via-fuchsia-600/25 to-pink-600/30 border-violet-400/30 text-violet-200' : 'bg-gradient-to-r from-slate-700/40 to-slate-800/40 border-slate-600/50 text-slate-200/90'}`}>
                      {cat.label}
                    </div>
                  </div>
                </div>
                {locked[catIndex] && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-violet-600 text-white text-[11px] px-2 py-1 rounded-xl shadow-md">✓</span>
                )}
                {clickable && (
                  <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-violet-400/60 group-hover:ring-violet-300/80" />
                )}
              </button>
            );
          })()}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-center mt-8 gap-4">
        {finished ? (
          <button
            onClick={handleRestart}
            className="px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg hover:from-emerald-400 hover:to-emerald-600 transition-colors"
          >
            New Game
          </button>
        ) : rotating ? (
          <span className="text-base md:text-lg text-amber-200/90 bg-amber-600/10 border border-amber-400/30 rounded-lg px-4 py-3 animate-pulse">
            ⏱️ Auto-stopping in a few seconds...
          </span>
        ) : (
          <span className="text-base md:text-lg text-violet-200/90 bg-violet-600/10 border border-violet-400/30 rounded-lg px-3 py-2">
            Select a category ({round + 1}/{categories.length})
          </span>
        )}
      </div>

      {/* Summary */}
      {finished && !showResults && (
        <div className="mt-10 text-center">
          <h2 className="text-xl font-bold mb-4 text-emerald-300">Game completed!</h2>
          <div className="mx-auto max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 px-2">
            {categories.map((cat, i) => {
              const idx = selected[i]!;
              const el = cat.elements[idx];
              const position = idx + 1; // Position in ranking (1-9)
              return (
                <div key={cat.id} className="rounded-2xl p-[2px] bg-gradient-to-br from-violet-500/60 via-fuchsia-500/50 to-pink-500/50">
                  <div className="rounded-[14px] bg-slate-900/75 backdrop-blur-md overflow-hidden flex flex-col items-center h-[220px] md:h-[240px] relative">
                    {/* Position badge */}
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-black px-2 py-1 rounded-lg shadow-md z-10">
                      #{position}
                    </div>
                    <div className="w-full flex-1 flex items-center justify-center pt-6">
                      <img src={el.image} alt={el.name} className="w-full max-w-[200px] md:max-w-[220px] h-[120px] md:h-[140px] object-contain" />
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

      {/* Results Screen */}
      {showResults && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-6xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bounty Poster */}
              <div className="text-center">
                <div ref={posterRef} className="bg-gradient-to-b from-amber-100 to-amber-200 text-black p-8 rounded-3xl border-8 border-amber-800 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="border-4 border-black border-dashed p-6 rounded-2xl bg-white/90">
                    {/* Header */}
                    <div className="mb-6">
                      <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider mb-2">WANTED</h1>
                      <div className="w-32 h-1 bg-black mx-auto mb-4"></div>
                      <h2 className="text-lg md:text-xl font-bold">DEAD OR ALIVE</h2>
                    </div>

                    {/* Rank Title */}
                    <div className="mb-6">
                      <h3 className="text-xl md:text-3xl font-black text-red-700 mb-2 drop-shadow-lg tracking-wide leading-tight">
                        {playerRank.title}
                      </h3>
                    </div>

                    {/* Selected characters collage inside poster */}
                    <div className="mb-6">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
                        {categories.map((cat, i) => {
                          const idx = selected[i]!;
                          const el = cat.elements[idx];
                          return (
                            <div key={cat.id} className="bg-amber-200/40 rounded-lg border border-amber-700/40 p-2 flex flex-col items-center">
                              <img src={el.image} alt={el.name} className="w-full h-16 md:h-20 object-contain" />
                              <div className="text-[10px] md:text-xs font-bold text-amber-900/90 mt-1 text-center leading-tight truncate w-full" title={`${cat.label} — ${el.name}`}>
                                {el.name}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bounty Amount */}
                    <div className="mb-6">
                      <div className="text-lg md:text-xl font-bold text-gray-800 mb-2">REWARD:</div>
                      <div className="text-2xl md:text-4xl font-black text-green-700 drop-shadow-lg">
                        ₿{playerRank.bountyValue.toLocaleString()}
                      </div>
                      <div className="text-sm md:text-base font-bold text-gray-700 mt-1">BERRIES</div>
                    </div>

                    {/* Marine/Government Seal */}
                    <div className="mb-6">
                      <div className="w-16 h-16 mx-auto bg-blue-800 rounded-full flex items-center justify-center text-white font-black text-lg">
                        ⚓
                      </div>
                      <div className="text-xs font-bold text-gray-600 mt-2">MARINE HEADQUARTERS</div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <button
                        onClick={handleRestart}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:from-blue-500 hover:to-blue-600 transition-colors"
                      >
                        🏴‍☠️ New Adventure
                      </button>
                      <button
                        onClick={exportBountyPoster}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl shadow-lg hover:from-purple-500 hover:to-purple-600 transition-colors"
                      >
                        📸 Export Poster
                      </button>
                      <button
                        onClick={() => setShowResults(false)}
                        className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl shadow-lg hover:from-gray-500 hover:to-gray-600 transition-colors"
                      >
                        👁️ View Summary
                      </button>
                    </div>
                  </div>
                </div>

                {/* Best Score */}
                <div className="mt-6 text-center text-amber-200/80">
                  <div className="text-sm">
                    Best Rank: #{bestRank ? bestRank.rank : '—'}
                  </div>
                </div>
              </div>

              {/* Selection Summary Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl border border-slate-700 shadow-2xl">
                <h3 className="text-2xl font-bold text-center mb-6 text-slate-100">Your Selections</h3>
                <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                  {categories.map((cat, i) => {
                    const idx = selected[i]!;
                    const el = cat.elements[idx];
                    const position = idx + 1;
                    return (
                      <div key={cat.id} className="bg-slate-700/50 rounded-xl p-3 border border-slate-600/50">
                        <div className="relative">
                          {/* Position badge */}
                          <div className="absolute top-1 right-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-black px-2 py-1 rounded-lg z-10">
                            #{position}
                          </div>
                          <img 
                            src={el.image} 
                            alt={el.name} 
                            className="w-full h-20 object-contain mb-2" 
                          />
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-bold text-slate-300 mb-1">{cat.label}</div>
                          <div className="text-sm font-semibold text-slate-100">{el.name}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TapOneGame;
