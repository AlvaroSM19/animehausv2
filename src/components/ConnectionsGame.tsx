"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import charactersData from '../data/characters.json';
import Link from 'next/link';

// ----------------- Types -----------------
interface Character {
  id: string;
  name: string;
  crew: string | null;
  imageUrl: string;
  haki: boolean;
  bounty: number | null;
  origin: string | null;
  hakiTypes: string[];
  devilFruit: string | null;
}

interface GroupRule {
  id: string; // unique identifier
  type: 'crew' | 'origin' | 'haki' | 'devilFruit' | 'bounty_lt' | 'bounty_gte';
  label: string; // user-facing label
  test: (c: Character) => boolean;
  // Precomputed candidate ids for performance
  candidates: string[];
}

interface PuzzleGroup {
  ruleId: string;
  type: GroupRule['type'];
  title: string;
  characterIds: string[]; // length 4
  revealed: boolean; // hint reveal title
  solved: boolean;
}

interface Puzzle {
  groups: PuzzleGroup[]; // 4 groups
  tiles: Character[]; // 16 characters (shuffled)
}

// ----------------- Helpers -----------------
const ALL_CHARACTERS: Character[] = charactersData as any;

const formatBounty = (v: number) => v.toLocaleString();

// Devil fruit classification heuristics
function classifyDevilFruitType(df: string | null): 'Paramecia' | 'Zoan' | 'Mythical Zoan' | 'Logia' | null {
  if (!df) return null;
  const lower = df.toLowerCase();
  // Logia examples
  const logiaKeywords = ['sand-sand', 'flame-flame', 'magma-magma', 'ice-ice', 'smoke-smoke', 'glint-glint', 'snow-snow', 'goro goro', 'gas-gas'];
  if (logiaKeywords.some(k => lower.includes(k))) return 'Logia';
  // Mythical indicators
  if (/(model phoenix|model seiryu|model: daibutsu|model okuchi|mythical)/i.test(lower)) return 'Mythical Zoan';
  // Zoan indicators (contains model or animal words + "model")
  if (/model/.test(lower)) return 'Zoan';
  // Composite double fruits treat individually unless above
  return 'Paramecia';
}

// Build dynamic rules from dataset
function buildRules(): GroupRule[] {
  const rules: GroupRule[] = [];
  const pushRule = (rule: Omit<GroupRule, 'candidates'>) => {
    const candidates = ALL_CHARACTERS.filter(rule.test).map(c => c.id);
    if (candidates.length >= 4) {
      rules.push({ ...rule, candidates });
    }
  };

  // Crew rules (crews with >=4 members)
  const crewCounts: Record<string, string[]> = {};
  ALL_CHARACTERS.forEach(c => {
    if (!c.crew) return;
    crewCounts[c.crew] ||= [];
    crewCounts[c.crew].push(c.id);
  });
  Object.entries(crewCounts).forEach(([crew, ids]) => {
    if (ids.length >= 4) {
      pushRule({
        id: `crew:${crew}`,
        type: 'crew',
        label: `Same crew: ${crew}`,
        test: (c) => c.crew === crew
      });
    }
  });

  // Origin rules (origins with >=4 members)
  const originCounts: Record<string, string[]> = {};
  ALL_CHARACTERS.forEach(c => {
    if (!c.origin) return;
    originCounts[c.origin] ||= [];
    originCounts[c.origin].push(c.id);
  });
  Object.entries(originCounts).forEach(([origin, ids]) => {
    if (ids.length >= 4) {
      pushRule({
        id: `origin:${origin}`,
        type: 'origin',
        label: `Same origin: ${origin}`,
        test: (c) => c.origin === origin
      });
    }
  });

  // Haki type rules
  const hakiTypes = ['Observation', 'Armament', 'Conqueror'];
  hakiTypes.forEach(ht => {
    pushRule({
      id: `haki:${ht}`,
      type: 'haki',
      label: `${ht} Haki`,
      test: (c) => c.hakiTypes.includes(ht)
    });
  });

  // Devil fruit type rules
  const dfTypeBuckets: Record<string, string[]> = {};
  ALL_CHARACTERS.forEach(c => {
    const t = classifyDevilFruitType(c.devilFruit);
    if (!t) return;
    dfTypeBuckets[t] ||= [];
    dfTypeBuckets[t].push(c.id);
  });
  Object.keys(dfTypeBuckets).forEach(t => {
    pushRule({
      id: `devilFruit:${t}`,
      type: 'devilFruit',
      label: `${t} users`,
      test: (c) => classifyDevilFruitType(c.devilFruit) === t
    });
  });

  // Bounty thresholds (less than)
  const bountyLtThresholds = [1_000_000, 10_000_000, 50_000_000, 100_000_000, 500_000_000];
  bountyLtThresholds.forEach(th => {
    pushRule({
      id: `bounty_lt:${th}`,
      type: 'bounty_lt',
      label: `Bounty < ${formatBounty(th)}`,
      test: (c) => c.bounty !== null && c.bounty < th
    });
  });

  // Bounty thresholds (greater or equal)
  const bountyGteThresholds = [4_000_000_000, 3_000_000_000, 1_000_000_000, 500_000_000, 100_000_000];
  bountyGteThresholds.forEach(th => {
    pushRule({
      id: `bounty_gte:${th}`,
      type: 'bounty_gte',
      label: `Bounty ≥ ${formatBounty(th)}`,
      test: (c) => c.bounty !== null && c.bounty >= th
    });
  });

  return rules;
}

// Get exclusive candidate IDs for a rule relative to other selected rules
function exclusiveCandidates(rule: GroupRule, others: GroupRule[]): string[] {
  const otherTests = others.map(r => r.test);
  return rule.candidates.filter(id => {
    const ch = ALL_CHARACTERS_BY_ID[id];
    return !otherTests.some(t => t(ch));
  });
}

// Index for quick lookup
const ALL_CHARACTERS_BY_ID: Record<string, Character> = Object.fromEntries(ALL_CHARACTERS.map(c => [c.id, c]));

// Attempt to generate a valid puzzle under constraints
function generatePuzzle(difficulty: number): Puzzle {
  const rules = buildRules();
  const maxAttempts = 300;

  function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

  // Difficulty weighting: influences preference of complex/overlapping rule types
  const allowedTypesByDifficulty: GroupRule['type'][][] = [
    ['crew', 'origin', 'haki', 'devilFruit', 'bounty_gte', 'bounty_lt'], // default set (difficulty 0 placeholder)
    ['crew', 'origin', 'haki', 'devilFruit', 'bounty_gte', 'bounty_lt'], // 1 (easy)
    ['crew', 'origin', 'haki', 'devilFruit', 'bounty_gte', 'bounty_lt'], // 2 (medium)
    ['crew', 'origin', 'haki', 'devilFruit', 'bounty_gte', 'bounty_lt'], // 3 (hard)
    ['crew', 'origin', 'haki', 'devilFruit', 'bounty_gte', 'bounty_lt'], // 4 (extreme)
  ];

  const allowedTypes = allowedTypesByDifficulty[Math.min(Math.max(difficulty, 1),4)];
  const filteredRules = rules.filter(r => allowedTypes.includes(r.type));

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Randomly sample 4 distinct rules
    const selected: GroupRule[] = [];
    const pool = [...filteredRules];
    while (selected.length < 4 && pool.length) {
      const idx = Math.floor(Math.random() * pool.length);
      selected.push(pool.splice(idx,1)[0]);
    }
    if (selected.length !== 4) continue;

    // Verify each has >=4 exclusive candidates
    const exclusives: Record<string,string[]> = {};
    let ok = true;
    for (let i=0;i<4;i++) {
      const rule = selected[i];
      const others = selected.filter((_,j)=>j!==i);
      const ex = exclusiveCandidates(rule, others);
      if (ex.length < 4) { ok = false; break; }
      exclusives[rule.id] = ex;
    }
    if (!ok) continue;

    // Build groups choosing 4 random exclusive candidates each
    const groups: PuzzleGroup[] = selected.map(rule => {
      // shuffle exclusives and pick first 4
      const ex = [...exclusives[rule.id]].sort(()=>Math.random()-0.5).slice(0,4);
      return {
        ruleId: rule.id,
        type: rule.type,
        title: rule.label,
        characterIds: ex,
        revealed: false,
        solved: false,
      };
    });

    // Ensure final non-ambiguity: None of chosen characters satisfy another rule
    const charToRule: Record<string,string> = {};
    let conflict = false;
    for (const g of groups) {
      const r = selected.find(r=>r.id===g.ruleId)!;
      for (const cid of g.characterIds) {
        if (selected.some(or => or.id !== r.id && or.test(ALL_CHARACTERS_BY_ID[cid]))) { conflict = true; break; }
        charToRule[cid] = g.ruleId;
      }
      if (conflict) break;
    }
    if (conflict) continue;

    // Build tiles
    const tiles = groups.flatMap(g => g.characterIds.map(id => ALL_CHARACTERS_BY_ID[id]));
    // Shuffle tiles
    for (let i=tiles.length-1;i>0;i--) {
      const j = Math.floor(Math.random()* (i+1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    return { groups, tiles };
  }

  throw new Error('Failed to generate puzzle after many attempts');
}

// ----------------- Component -----------------
const ConnectionsGame: React.FC<{ difficulty?: number }> = ({ difficulty = 1 }) => {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [lives, setLives] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [status, setStatus] = useState<'playing'|'win'|'lose'>('playing');
  const [message, setMessage] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);
  const maxHints = 2;
  const boardRef = useRef<HTMLDivElement>(null);

  // Generate puzzle on mount / difficulty change
  useEffect(() => {
    try {
      const p = generatePuzzle(difficulty);
      setPuzzle(p);
      setStartTime(Date.now());
      setSelected([]);
      setLives(3);
      setHintsUsed(0);
      setStatus('playing');
      setMessage(null);
      setEndTime(null);
    } catch (e:any) {
      setMessage('Error generating puzzle');
      console.error(e);
    }
  }, [difficulty]);

  const remainingTiles = useMemo(() => {
    if (!puzzle) return [];
    const solvedIds = new Set(puzzle.groups.filter(g=>g.solved).flatMap(g=>g.characterIds));
    return puzzle.tiles.filter(c => !solvedIds.has(c.id));
  }, [puzzle]);

  const solvedCount = puzzle?.groups.filter(g=>g.solved).length ?? 0;

  // Selection toggle
  const toggleSelect = (id: string) => {
    if (status !== 'playing') return;
    if (!remainingTiles.find(t=>t.id===id)) return; // can't select solved tile
    setSelected(prev => prev.includes(id)
      ? prev.filter(x=>x!==id)
      : prev.length < 4 ? [...prev, id] : prev);
  };

  // Submit group
  const submitGroup = () => {
    if (!puzzle || selected.length !== 4 || status !== 'playing') return;
    const selSet = new Set(selected);
    const matched = puzzle.groups.find(g => !g.solved && g.characterIds.every(id => selSet.has(id)) && g.characterIds.length === selected.length);
    if (matched) {
      // Mark solved
      setPuzzle(prev => prev ? ({
        ...prev,
        groups: prev.groups.map(g => g.ruleId === matched.ruleId ? { ...g, solved: true } : g)
      }) : prev);
      setMessage(matched.title);
      setSelected([]);
      // Reveal automatically
      setPuzzle(prev => prev ? ({
        ...prev,
        groups: prev.groups.map(g => g.ruleId === matched.ruleId ? { ...g, revealed: true } : g)
      }) : prev);
      // Win check
      if (puzzle.groups.filter(g=>g.solved).length + 1 === 4) {
        setStatus('win');
        setEndTime(Date.now());
        incrementStreak();
      }
    } else {
      // Fail
      setLives(l => l-1);
      setMessage('❌ Grupo incorrecto');
      // Shake animation trigger
      if (boardRef.current) {
        boardRef.current.classList.remove('animate-[shake_0.4s]');
        void boardRef.current.offsetWidth; // force reflow
        boardRef.current.classList.add('animate-[shake_0.4s]');
      }
      if (lives -1 <= 0) {
        setStatus('lose');
        setEndTime(Date.now());
      }
    }
  };

  // Hint: reveal one unrevealed group title
  const useHint = () => {
    if (!puzzle || hintsUsed >= maxHints || status !== 'playing') return;
    const target = puzzle.groups.find(g => !g.revealed && !g.solved);
    if (!target) return;
    setPuzzle(prev => prev ? ({
      ...prev,
      groups: prev.groups.map(g => g.ruleId === target.ruleId ? { ...g, revealed: true } : g)
    }) : prev);
    setHintsUsed(h => h+1);
  };

  const shuffleTiles = () => {
    if (!puzzle || status !== 'playing') return;
    setPuzzle(prev => prev ? ({
      ...prev,
      tiles: [...prev.tiles].sort(()=>Math.random()-0.5)
    }) : prev);
  };

  const resetGame = () => {
    try {
      const p = generatePuzzle(difficulty);
      setPuzzle(p);
      setStartTime(Date.now());
      setSelected([]);
      setLives(3);
      setHintsUsed(0);
      setStatus('playing');
      setMessage(null);
      setEndTime(null);
    } catch (e) {
      setMessage('Error regenerating puzzle');
    }
  };

  // Streak management
  const incrementStreak = () => {
    try {
      const key = 'connections:streak';
      const current = parseInt(localStorage.getItem(key) || '0');
      localStorage.setItem(key, String(current + 1));
    } catch {}
  };

  const streak = (() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('connections:streak') || '0');
  })();

  const timeTakenMs = endTime ? endTime - startTime : null;

  // Scoring (optional)
  const score = useMemo(() => {
    if (status === 'playing' || !puzzle) return 0;
    let s = solvedCount * 100; // +100 per solved group
    if (hintsUsed === 0) s += 50;
    s += lives * 20;
    s -= hintsUsed * 25;
    return s;
  }, [status, solvedCount, hintsUsed, lives, puzzle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Header section */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 mb-6">
        <div className="flex items-center gap-2 text-slate-300/90 text-sm mb-3">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-white/90 transition-colors">
            <span className="text-slate-300/80">←</span>
            <span>Home</span>
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-slate-100/90">Connections</span>
        </div>

        <div className="flex items-center justify-between gap-3 mb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide uppercase bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-cyan-300 to-blue-300 drop-shadow">
            Connections
          </h1>
          
          <div className="shrink-0">
            <button
              onClick={resetGame}
              className="px-4 md:px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-slate-500 to-slate-600 shadow-lg hover:from-slate-400 hover:to-slate-600 transition-colors"
            >
              New Game
            </button>
          </div>
        </div>

        {/* Status pill */}
        <div className="mt-3 rounded-xl border border-indigo-400/20 bg-indigo-600/10 px-4 py-2 text-indigo-200/90 text-sm">
          <span>Encuentra los 4 grupos de 4 personajes que comparten una categoría común.</span>
        </div>

        {/* Stats */}
        <div className="flex gap-3 flex-wrap text-sm mt-4">
          <div className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-600/40 backdrop-blur-sm">
            <span className="text-slate-300">Vidas: </span>
            <span className="text-pink-300 font-bold">{lives}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-600/40 backdrop-blur-sm">
            <span className="text-slate-300">Pistas: </span>
            <span className="text-amber-300 font-bold">{hintsUsed}/{maxHints}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-600/40 backdrop-blur-sm">
            <span className="text-slate-300">Resueltos: </span>
            <span className="text-emerald-300 font-bold">{solvedCount}/4</span>
          </div>
        </div>
      </section>

      {/* Game Board */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Categories header (hidden until revealed/solved) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {puzzle?.groups.map((g, idx) => (
            <div key={g.ruleId} className={`rounded-2xl p-4 min-h-[80px] flex items-center justify-center text-center border-2 text-sm font-bold tracking-wide transition-all duration-300 ${g.solved ? 'bg-emerald-600/30 border-emerald-400/60 text-emerald-200 shadow-lg shadow-emerald-500/20' : g.revealed ? 'bg-indigo-600/30 border-indigo-400/60 text-indigo-200 shadow-lg shadow-indigo-500/20' : 'bg-slate-800/60 border-slate-600/50 text-slate-400'}`}> 
              {g.solved || g.revealed ? g.title : `Categoría Oculta ${idx+1}`}
            </div>
          ))}
        </div>

        {/* Message banner */}
        {message && (
          <div className="mb-6 text-center">
            <div className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600/40 to-fuchsia-600/40 text-violet-200 font-bold border border-violet-400/40 animate-pulse shadow-lg">{message}</div>
          </div>
        )}

        {/* Board */}
        <div ref={boardRef} className="grid grid-cols-4 gap-4 mb-8"> 
          {remainingTiles.map(ch => {
            const sel = selected.includes(ch.id);
            return (
              <button
                key={ch.id}
                onClick={() => toggleSelect(ch.id)}
                disabled={status !== 'playing'}
                className={`group relative rounded-2xl overflow-hidden border-2 p-4 flex flex-col items-center justify-center h-40 sm:h-44 md:h-48 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 ${sel ? 'bg-cyan-600/40 border-cyan-400 text-cyan-100 ring-2 ring-cyan-300 shadow-xl shadow-cyan-500/25 scale-105' : 'bg-slate-800/70 border-slate-600/50 text-slate-200 hover:border-slate-500 hover:bg-slate-700/70 hover:scale-102'} ${status!=='playing' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                aria-pressed={sel}
                style={{
                  boxShadow: sel 
                    ? '0 0 0 2px rgba(34,211,238,0.4), 0 8px 24px rgba(34,211,238,0.25)' 
                    : '0 4px 16px rgba(0,0,0,0.3)'
                }}
              >
                <img src={ch.imageUrl} alt={ch.name} className="w-full h-24 sm:h-28 md:h-32 object-contain mb-2 pointer-events-none drop-shadow-lg" />
                <span className="text-xs sm:text-sm font-bold text-center leading-tight line-clamp-2 tracking-wide">{ch.name}</span>
                {sel && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <button
            onClick={submitGroup}
            disabled={selected.length !== 4 || status !== 'playing'}
            className={`px-6 py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg transition-all duration-300 ${selected.length===4 && status==='playing' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-600 hover:scale-105 shadow-emerald-500/25' : 'bg-slate-700/60 text-slate-400 cursor-not-allowed'}`}
          >Confirmar Grupo</button>
          
          <button
            onClick={useHint}
            disabled={hintsUsed>=maxHints || status!=='playing'}
            className={`px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${hintsUsed<maxHints && status==='playing' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-400 hover:to-amber-600 hover:scale-105 shadow-amber-500/25' : 'bg-slate-700/60 text-slate-400 cursor-not-allowed'}`}
          >Pista</button>
          
          <button
            onClick={shuffleTiles}
            disabled={status!=='playing'}
            className={`px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${status==='playing' ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-400 hover:to-indigo-600 hover:scale-105 shadow-indigo-500/25' : 'bg-slate-700/60 text-slate-400 cursor-not-allowed'}`}
          >Mezclar</button>
          
          <button
            onClick={()=>setSelected([])}
            disabled={selected.length===0 || status!=='playing'}
            className={`px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${selected.length>0 && status==='playing' ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-400 hover:to-pink-600 hover:scale-105 shadow-pink-500/25' : 'bg-slate-700/60 text-slate-400 cursor-not-allowed'}`}
          >Limpiar</button>
        </div>
      </section>

      {/* Status overlays */}
      {status==='win' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="max-w-lg w-full bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-8 text-center shadow-2xl">
            <h2 className="text-3xl font-extrabold text-emerald-300 mb-4">¡Completado!</h2>
            <p className="text-slate-300 mb-3 text-sm">Tiempo: {timeTakenMs ? (timeTakenMs/1000).toFixed(1) + 's' : '--'} · Vidas restantes: {lives} · Pistas usadas: {hintsUsed}</p>
            <p className="text-emerald-200 text-sm mb-4">Racha: {streak}</p>
            <p className="text-fuchsia-200 font-bold mb-6 text-xl">Puntuación: {score}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={resetGame} className="px-5 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-600">Nueva Partida</button>
              <button onClick={()=>setStatus('playing')} className="px-5 py-3 rounded-xl font-bold bg-slate-700 text-slate-200 hover:bg-slate-600">Seguir viendo</button>
            </div>
          </div>
        </div>
      )}

      {status==='lose' && puzzle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-y-auto">
          <div className="max-w-4xl w-full bg-slate-900/90 border border-pink-500/40 rounded-3xl p-8 text-center shadow-2xl">
            <h2 className="text-3xl font-extrabold text-pink-300 mb-6">Game Over</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {puzzle.groups.map(g => (
                <div key={g.ruleId} className="rounded-2xl bg-slate-800/70 border border-slate-600/40 p-4">
                  <h3 className="font-bold text-amber-300 mb-3 text-sm">{g.title}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {g.characterIds.map(id => {
                      const ch = ALL_CHARACTERS_BY_ID[id];
                      return (
                        <div key={id} className="flex flex-col items-center text-center text-[11px] font-semibold bg-slate-700/60 rounded-lg p-2">
                          <img src={ch.imageUrl} alt={ch.name} className="h-16 object-contain mb-1" />
                          <span>{ch.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 justify-center">
              <button onClick={resetGame} className="px-5 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-600">Reintentar</button>
              <button onClick={()=>setStatus('playing')} className="px-5 py-3 rounded-xl font-bold bg-slate-700 text-slate-200 hover:bg-slate-600">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <details className="mt-8 text-slate-400 text-sm">
        <summary className="cursor-pointer font-semibold text-slate-200 mb-2">Cómo jugar</summary>
        <ul className="list-disc ml-6 space-y-1 mt-2">
          <li>Selecciona 4 personajes que creas comparten una categoría oculta.</li>
          <li>Pulsa &quot;Confirmar Grupo&quot;. Si es correcto se revelará la categoría y se eliminarán esas cartas.</li>
          <li>Usa Pista para revelar el título de una categoría (máx {maxHints}).</li>
          <li>Tienes 3 vidas. Cada fallo consume 1 vida.</li>
          <li>Completa los 4 grupos para ganar.</li>
        </ul>
      </details>
    </div>
  );
};

export default ConnectionsGame;
