// Activity: Food from Plants & Animals — Age 7 (Band B7)
// Foundation Phase Gr 2 — classify where our food comes from.
// Pattern: Sort (plant / animal) → Why? → Badge + Caregiver Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { cn, speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'sort' | 'why' | 'card';

interface Food { id: string; emoji: string; name: string; fromPlant: boolean; voice: string; }

const FOODS: Food[] = [
  { id: 'apple',  emoji: '🍎', name: 'Apple',  fromPlant: true,  voice: 'An apple grows on a tree. It comes from a PLANT!' },
  { id: 'milk',   emoji: '🥛', name: 'Milk',   fromPlant: false, voice: 'Milk comes from a cow. It comes from an ANIMAL!' },
  { id: 'bread',  emoji: '🍞', name: 'Bread',  fromPlant: true,  voice: 'Bread is made from wheat. It comes from a PLANT!' },
  { id: 'egg',    emoji: '🥚', name: 'Egg',    fromPlant: false, voice: 'An egg comes from a chicken. From an ANIMAL!' },
  { id: 'carrot', emoji: '🥕', name: 'Carrot', fromPlant: true,  voice: 'A carrot grows in the soil. From a PLANT!' },
  { id: 'cheese', emoji: '🧀', name: 'Cheese', fromPlant: false, voice: 'Cheese is made from milk. From an ANIMAL!' },
];

const OBJECTIVE_ID = 'll.food_sources';
const BADGE = 'Food Sorter Badge 🍎';

const SORT_VOICE = "Our food comes from plants and animals. Tap each food to find out where it comes from!";
const WHY_VOICE  = "Where does milk come from?";
const CARD_VOICE = "You earned the Food Sorter Badge! Think about what you ate today. Did it come from a plant or an animal?";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => {
    if (r <= 0) { onDone(); return; }
    const id = setTimeout(() => setR(v => v - 1), 1000);
    return () => clearTimeout(id);
  }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function FoodSourcesActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]   = useState<Phase>('sort');
  const [sorted, setSorted] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Food | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(SORT_VOICE); return () => stopAudio(); }, []);

  const remaining = FOODS.filter(f => !(f.id in sorted));

  function tap(f: Food) {
    if (f.id in sorted) return;
    const isLast = Object.keys(sorted).length + 1 >= FOODS.length;
    setFeedback(f);
    speak(f.voice, 0.9, isLast ? () => setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 700) : undefined);
    setSorted(prev => ({ ...prev, [f.id]: f.fromPlant }));
    setTimeout(() => setFeedback(null), 1700);
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! Milk comes from a cow — an animal! You are a great food sorter!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  const plantFoods  = FOODS.filter(f => sorted[f.id] === true);
  const animalFoods = FOODS.filter(f => sorted[f.id] === false);

  return (
    <div className="fixed inset-0 bg-green-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'sort' && (
          <motion.div key="sort" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-green-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-green-600 text-sm uppercase tracking-widest mb-1">Where is it from?</p>
            <p className="text-center text-xs text-gray-400 font-bold mb-3">Tap each food 🍎</p>

            {remaining.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {remaining.map(f => (
                  <motion.button key={f.id} whileTap={{ scale: 0.88 }} onClick={() => tap(f)}
                    className="flex flex-col items-center gap-0.5 p-2 bg-white rounded-2xl shadow-md border-2 border-gray-100 active:scale-95">
                    <span className="text-3xl">{f.emoji}</span>
                    <span className="text-[9px] font-black text-gray-400 uppercase">{f.name}</span>
                  </motion.button>
                ))}
              </div>
            )}

            <AnimatePresence>
              {feedback && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={cn('mb-3 p-2 rounded-2xl text-center text-sm font-bold', feedback.fromPlant ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700')}>
                  {feedback.emoji} {feedback.fromPlant ? 'From a PLANT! 🌱' : 'From an ANIMAL! 🐄'}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-2 flex-1">
              <div className="bg-green-100 rounded-2xl p-2 border-2 border-green-300">
                <p className="text-[9px] font-black text-green-700 uppercase tracking-wide text-center mb-2">🌱 FROM PLANTS</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {plantFoods.map(f => <motion.span key={f.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="text-2xl">{f.emoji}</motion.span>)}
                </div>
              </div>
              <div className="bg-orange-100 rounded-2xl p-2 border-2 border-orange-300">
                <p className="text-[9px] font-black text-orange-700 uppercase tracking-wide text-center mb-2">🐄 FROM ANIMALS</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {animalFoods.map(f => <motion.span key={f.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="text-2xl">{f.emoji}</motion.span>)}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-green-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-green-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🥛❓</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Where does milk come from?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-green-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-orange-50 border-2 border-orange-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🐄</span><span className="font-black text-orange-700 text-xs uppercase">A cow (animal)</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🌳</span><span className="font-black text-green-700 text-xs uppercase">A tree (plant)</span>
                </motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🥛🐄</motion.div>}
          </motion.div>
        )}

        {phase === 'card' && <CaregiverCard onComplete={onComplete} onExit={onExit} />}

      </AnimatePresence>
    </div>
  );
}

function CaregiverCard({ onComplete, onExit }: { onComplete: () => void; onExit: () => void }) {
  const r = useCountdown(120, onComplete);
  const pct = (r / 120) * 100;
  useEffect(() => { const t = setTimeout(() => speak(CARD_VOICE), 400); return () => clearTimeout(t); }, []);
  return (
    <motion.div key="card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full p-6 items-center">
      <button onClick={onExit} className="self-start text-green-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🍎</div>
        <p className="font-display font-black text-green-700 text-sm">Food Sorter Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-green-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🍽️🌱🐄</p>
        <p className="font-black text-gray-700 text-base leading-snug">Think about what you ate today. For each food, ask: did it come from a plant or an animal?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#DCFCE7" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22C55E" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-green-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-green-500 shadow-[0_6px_0_#16A34A] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
