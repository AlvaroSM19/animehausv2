
'use client';
import React, { useState, useEffect } from 'react';

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
      { name: 'Kaido', image: '/images/tapone/strength/kaido.webp' },
      { name: 'Edward Newgate', image: '/images/tapone/strength/edward-newgate.webp' },
      { name: 'Gol D. Roger', image: '/images/tapone/strength/gol-d-roger.webp' },
      { name: 'Monkey D. Garp', image: '/images/tapone/strength/monkey-d-garp.webp' },
      { name: 'Big Mom', image: '/images/tapone/strength/big-mom.webp' },
      { name: 'Jinbe', image: '/images/tapone/strength/jinbe.webp' },
      { name: 'Franky', image: '/images/tapone/strength/franky.webp' },
      { name: 'Usopp', image: '/images/tapone/strength/usopp.webp' },
      { name: 'Nami', image: '/images/tapone/strength/nami.webp' },
    ]
  },
  {
    id: 'haki', label: 'Haki', elements: [
      { name: 'Shanks', image: '/images/tapone/haki/shanks.webp' },
      { name: 'Gol D. Roger', image: '/images/tapone/haki/gol-d-roger.webp' },
      { name: 'Monkey D. Garp', image: '/images/tapone/haki/monkey-d-garp.webp' },
      { name: 'Luffy', image: '/images/tapone/haki/luffy.webp' },
      { name: 'Silvers Rayleigh', image: '/images/tapone/haki/silvers-rayleigh.webp' },
      { name: 'Charlotte Katakuri', image: '/images/tapone/haki/charlotte-katakuri.webp' },
      { name: 'Roronoa Zoro', image: '/images/tapone/haki/roronoa-zoro.webp' },
      { name: 'Chopper', image: '/images/tapone/haki/chopper.webp' },
      { name: 'Bepo', image: '/images/tapone/haki/bepo.webp' },
    ]
  },
  {
    id: 'race', label: 'Race', elements: [
      { name: 'King (Lunaria)', image: '/images/tapone/race/king-lunaria.webp' },
      { name: 'Kaido (Oni)', image: '/images/tapone/race/kaido-oni.webp' },
      { name: 'Dorry (Gigante)', image: '/images/tapone/race/dorry-gigante.webp' },
      { name: 'Inuarashi (Mink)', image: '/images/tapone/race/inuarashi-mink.webp' },
      { name: 'Tiger (gyogin)', image: '/images/tapone/race/tiger-gyogin.webp' },
      { name: 'Luffy (humanos)', image: '/images/tapone/race/luffy-humanos.webp' },
      { name: 'shandia', image: '/images/tapone/race/shandia.webp' },
      { name: 'tontatta', image: '/images/tapone/race/tontatta.webp' },
      { name: 'Smoothie (piernas largas)', image: '/images/tapone/race/smoothie-piernas-largas.webp' },
    ]
  },
  {
    id: 'logia', label: 'Logia', elements: [
      { name: 'Blackbeard', image: '/images/tapone/logia/blackbeard.webp' },
      { name: 'Kizaru', image: '/images/tapone/logia/kizaru.webp' },
      { name: 'Akainu', image: '/images/tapone/logia/akainu.webp' },
      { name: 'Aokiji', image: '/images/tapone/logia/aokiji.webp' },
      { name: 'Enel', image: '/images/tapone/logia/enel.webp' },
      { name: 'Crocodile', image: '/images/tapone/logia/crocodile.webp' },
      { name: 'Smoker', image: '/images/tapone/logia/smoker.webp' },
      { name: 'Katakuri', image: '/images/tapone/logia/katakuri.webp' },
      { name: 'Caesar Clown', image: '/images/tapone/logia/caesar-clown.webp' },
    ]
  },
  {
    id: 'paramecia', label: 'Paramecia', elements: [
      { name: 'Edward Newgate', image: '/images/tapone/paramecia/edward-newgate.webp' },
      { name: 'Trafalgar Law', image: '/images/tapone/paramecia/trafalgar-law.webp' },
      { name: 'Bartholomew Kuma', image: '/images/tapone/paramecia/bartholomew-kuma.webp' },
      { name: 'Magellan', image: '/images/tapone/paramecia/magellan.webp' },
      { name: 'Donquixote Doflamingo', image: '/images/tapone/paramecia/donquixote-doflamingo.webp' },
      { name: 'Nico Robin', image: '/images/tapone/paramecia/nico-robin.webp' },
      { name: 'Mr. 5', image: '/images/tapone/paramecia/mr-5.webp' },
      { name: 'Sugar', image: '/images/tapone/paramecia/sugar.webp' },
      { name: 'Alvida', image: '/images/tapone/paramecia/alvida.webp' },
    ]
  },
  {
    id: 'zoan', label: 'Zoan', elements: [
      { name: 'Rob Lucci', image: '/images/tapone/zoan/rob-lucci.webp' },
      { name: 'Jack', image: '/images/tapone/zoan/jack.webp' },
      { name: 'X Drake', image: '/images/tapone/zoan/x-drake.webp' },
      { name: 'Page One', image: '/images/tapone/zoan/page-one.webp' },
      { name: 'Who’s Who', image: '/images/tapone/zoan/whos-who.webp' },
      { name: 'Catarina Devon', image: '/images/tapone/zoan/catarina-devon.webp' },
      { name: 'Babanuki', image: '/images/tapone/zoan/babanuki.webp' },
      { name: 'Kaku', image: '/images/tapone/zoan/kaku.webp' },
      { name: 'Dalton', image: '/images/tapone/zoan/dalton.webp' },
    ]
  },
  {
    id: 'mythical-zoan', label: 'Mythical Zoan', elements: [
      { name: 'Luffy', image: '/images/tapone/mythical-zoan/luffy.webp' },
      { name: 'Kaido', image: '/images/tapone/mythical-zoan/kaido.webp' },
      { name: 'Sengoku', image: '/images/tapone/mythical-zoan/sengoku.webp' },
      { name: 'Marco', image: '/images/tapone/mythical-zoan/marco.webp' },
      { name: 'Yamato', image: '/images/tapone/mythical-zoan/yamato.webp' },
      { name: 'Catarina Devon', image: '/images/tapone/mythical-zoan/catarina-devon.webp' },
      { name: 'Orochi', image: '/images/tapone/mythical-zoan/orochi.webp' },
      { name: 'Onimaru', image: '/images/tapone/mythical-zoan/onimaru.webp' },
      { name: 'Stronger', image: '/images/tapone/mythical-zoan/stronger.webp' },
    ]
  },
  {
    id: 'sensei', label: 'Sensei', elements: [
      { name: 'Silvers Rayleigh', image: '/images/tapone/sensei/silvers-rayleigh.webp' },
      { name: 'Monkey D. Garp', image: '/images/tapone/sensei/monkey-d-garp.webp' },
      { name: 'Dracule Mihawk', image: '/images/tapone/sensei/dracule-mihawk.webp' },
      { name: 'Whitebeard', image: '/images/tapone/sensei/whitebeard.webp' },
      { name: 'Kozuki Oden', image: '/images/tapone/sensei/kozuki-oden.webp' },
      { name: 'Shanks', image: '/images/tapone/sensei/shanks.webp' },
      { name: 'Jinbe', image: '/images/tapone/sensei/jinbe.webp' },
      { name: 'Koby', image: '/images/tapone/sensei/koby.webp' },
      { name: 'Fisher Tiger', image: '/images/tapone/sensei/fisher-tiger.webp' },
    ]
  },
  {
    id: 'ship', label: 'Ship', elements: [
      { name: 'Thousand Sunny', image: '/images/tapone/ship/thousand-sunny.webp' },
      { name: 'Oro Jackson', image: '/images/tapone/ship/oro-jackson.webp' },
      { name: 'Red Force', image: '/images/tapone/ship/red-force.webp' },
      { name: 'Moby Dick', image: '/images/tapone/ship/moby-dick.webp' },
      { name: 'Queen Mama Chanter', image: '/images/tapone/ship/queen-mama-chanter.webp' },
      { name: 'Noah', image: '/images/tapone/ship/noah.webp' },
      { name: 'Barco de los Piratas Bestia', image: '/images/tapone/ship/barco-piratas-bestia.webp' },
      { name: 'Polar Tang', image: '/images/tapone/ship/polar-tang.webp' },
      { name: 'Barco de Germa 66', image: '/images/tapone/ship/barco-germa-66.webp' },
    ]
  },
  {
    id: 'creature', label: 'Creature', elements: [
      { name: 'Zunesha', image: '/images/tapone/creature/zunesha.webp' },
      { name: 'Sea King', image: '/images/tapone/creature/sea-king.webp' },
      { name: 'Dragon 13', image: '/images/tapone/creature/dragon-13.webp' },
      { name: 'Smiley', image: '/images/tapone/creature/smiley.webp' },
      { name: 'Nola', image: '/images/tapone/creature/nola.webp' },
      { name: 'Laboon', image: '/images/tapone/creature/laboon.webp' },
      { name: 'Humandrill', image: '/images/tapone/creature/humandrill.webp' },
      { name: 'Surume', image: '/images/tapone/creature/surume.webp' },
      { name: 'Ucy', image: '/images/tapone/creature/ucy.webp' },
    ]
  },
];


const ROTATE_INTERVAL = 900; // ms

const TapOneGame: React.FC = () => {
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

  // Rotación automática de elementos
  useEffect(() => {
    if (finished) return;
    const interval = setInterval(() => {
      setIndices(prev => prev.map((idx, i) =>
        locked[i] ? idx : (idx + 1) % categories[i].elements.length
      ));
    }, ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [locked, finished]);

  // Seleccionar una categoría (fijar el elemento actual)
  const handleSelect = (catIdx: number) => {
    if (locked[catIdx] || finished) return;
    const newLocked = [...locked];
    newLocked[catIdx] = true;
    const newSelected = [...selected];
    newSelected[catIdx] = indices[catIdx];
    setLocked(newLocked);
    setSelected(newSelected);
    setRound(round + 1);
  };

  // Reiniciar el juego
  const handleRestart = () => {
    setIndices(categories.map(() => 0));
    setLocked(categories.map(() => false));
    setSelected(categories.map(() => null));
    setRound(0);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">TAP ONE</h1>
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {categories.map((cat, i) => {
          const idx = locked[i] && selected[i] !== null ? selected[i]! : indices[i];
          const el = cat.elements[idx];
          return (
            <button
              key={cat.id}
              className={`relative flex flex-col items-center justify-center aspect-[3/4] rounded-xl border-2 shadow-lg overflow-hidden transition-all duration-200 ${locked[i] ? 'border-blue-500 ring-2 ring-blue-400/60 grayscale-0' : 'border-amber-300 hover:scale-105 grayscale'}`}
              style={{ background: '#222' }}
              onClick={() => handleSelect(i)}
              disabled={locked[i] || finished}
            >
              <img
                src={el.image}
                alt={el.name}
                className={`w-full h-28 object-contain mt-2 mb-1 ${locked[i] ? '' : 'opacity-80'}`}
                draggable={false}
              />
              <span className={`text-sm font-bold text-white drop-shadow ${locked[i] ? 'text-blue-200' : 'text-amber-200/80'}`}>{cat.label}</span>
              {locked[i] && (
                <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow">✔</span>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex justify-center mt-6 gap-4">
        {finished ? (
          <button className="px-6 py-2 bg-green-600 text-white rounded font-bold" onClick={handleRestart}>Reiniciar</button>
        ) : (
          <span className="text-lg text-amber-200">Selecciona una categoría ({round + 1}/9)</span>
        )}
      </div>
      {finished && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold mb-2 text-green-400">¡Juego terminado!</h2>
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-4">
            {categories.map((cat, i) => {
              const idx = selected[i]!;
              const el = cat.elements[idx];
              return (
                <div key={cat.id} className="flex flex-col items-center justify-center p-2 bg-black/60 rounded-xl">
                  <img src={el.image} alt={el.name} className="w-full h-24 object-contain mb-1" />
                  <span className="text-xs text-amber-100 font-bold">{cat.label}</span>
                  <span className="text-xs text-amber-300">{el.name}</span>
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
