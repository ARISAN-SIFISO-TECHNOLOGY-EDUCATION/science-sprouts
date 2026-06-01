// Activity: Nutrients in Food — Age 11 (Band C11 · CAPS Gr 6)
//   Plan (predict) → Classify foods by nutrient → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';
type Group = 'carb' | 'protein' | 'vitamin';

interface Food { id: string; emoji: string; name: string; group: Group; }
const FOODS: Food[] = [
  { id: 'bread',   emoji: '🍞', name: 'Bread',   group: 'carb' },
  { id: 'rice',    emoji: '🍚', name: 'Rice',    group: 'carb' },
  { id: 'egg',     emoji: '🥚', name: 'Egg',     group: 'protein' },
  { id: 'chicken', emoji: '🍗', name: 'Chicken', group: 'protein' },
  { id: 'orange',  emoji: '🍊', name: 'Orange',  group: 'vitamin' },
  { id: 'carrot',  emoji: '🥕', name: 'Carrot',  group: 'vitamin' },
];
const GROUPS: { id: Group; label: string; emoji: string }[] = [
  { id: 'carb',    label: 'Carbohydrate', emoji: '⚡' },
  { id: 'protein', label: 'Protein',      emoji: '💪' },
  { id: 'vitamin', label: 'Vitamins',     emoji: '🍊' },
];

const OBJECTIVE_ID = 'll.nutrients';
const BADGE = 'Nutrition Expert Badge 🥗';

const PLAN_VOICE = "Food contains different nutrients. Carbohydrates give energy, proteins build the body, and vitamins keep us healthy. Is bread mostly a carbohydrate, or a protein? Predict!";
const TEST_VOICE = "Sort each food by its main nutrient: carbohydrate, protein, or vitamins.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Nutrition Expert Badge! At your next meal, find one carbohydrate, one protein, and one fruit or vegetable. A balanced plate has all three kinds of nutrient!";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function NutrientsActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle');
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const cur = FOODS[idx];
  const done = idx >= FOODS.length;

  function predict() { setPredicted(true); speak("Let's sort foods by their nutrients!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function sort(g: Group) {
    if (feedback !== 'idle') return;
    const correct = g === cur.group;
    setFeedback(correct ? 'right' : 'wrong');
    const grp = GROUPS.find(x => x.id === cur.group)!.label.toLowerCase();
    speak(correct ? `Correct! ${cur.name} is mostly ${grp}.` : `Actually, ${cur.name} is mostly ${grp}.`, 0.92);
    setTimeout(() => {
      setFeedback('idle');
      if (idx + 1 >= FOODS.length) setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 200);
      setIdx(i => i + 1);
    }, 1400);
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'carbohydrates' && blank2 === 'protein') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! Bread and rice are full of carbohydrates for energy. Eggs and meat give us protein to build our bodies. Fruit and veg give vitamins. You are a Nutrition Expert!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Bread is carbohydrate. Eggs and meat are protein. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-orange-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-orange-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🍞🍗🍊</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Is bread mostly a carbohydrate or a protein?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-orange-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-orange-200 rounded-3xl active:scale-95"><span className="text-3xl">⚡</span><p className="font-black text-orange-700 text-[11px] uppercase mt-1">Carbohydrate</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-orange-200 rounded-3xl active:scale-95"><span className="text-3xl">💪</span><p className="font-black text-orange-700 text-[11px] uppercase mt-1">Protein</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🥗</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && !done && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold">← Back</button>
            <p className="text-center text-xs text-orange-400 font-black uppercase">Food {idx + 1} of {FOODS.length}</p>
            <motion.div key={cur.id} initial={{ scale: 0.8, opacity: 0 }} animate={feedback === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : { scale: 1, opacity: 1 }}
              className={`bg-white rounded-3xl p-6 border-2 shadow-md text-center w-full max-w-xs ${feedback === 'right' ? 'border-green-300' : feedback === 'wrong' ? 'border-red-300' : 'border-orange-100'}`}>
              <p className="text-6xl mb-2">{cur.emoji}</p>
              <p className="font-display font-black text-xl text-gray-800">{cur.name}</p>
            </motion.div>
            <p className="text-xs text-orange-500 font-bold">Which nutrient is it mostly?</p>
            <div className="flex gap-2 w-full max-w-xs">
              {GROUPS.map(g => (
                <motion.button key={g.id} whileTap={{ scale: 0.92 }} onClick={() => sort(g.id)} disabled={feedback !== 'idle'} className="flex-1 py-3 bg-white border-2 border-orange-200 rounded-2xl font-black text-orange-700 text-[9px] uppercase active:scale-95 flex flex-col items-center gap-1">
                  <span className="text-xl">{g.emoji}</span>{g.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-orange-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-orange-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                Bread and rice are full of{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-orange-100 border-orange-400 text-orange-700' : 'border-orange-200 text-orange-300'}`}>{blank1 ?? '____'}</span>.
                Eggs and meat give us{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-orange-100 border-orange-400 text-orange-700' : 'border-orange-200 text-orange-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — bread &amp; rice are…</p>
              <div className="flex gap-2">{['carbohydrates', 'vitamins'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-xs border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-orange-700 border-orange-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — eggs &amp; meat give…</p>
              <div className="flex gap-2">{['protein', 'carbohydrates'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-xs border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-orange-700 border-orange-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-orange-500 shadow-[0_5px_0_#EA580C]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🥗</div>
        <p className="font-display font-black text-orange-700 text-sm">Nutrition Expert Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-orange-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🍞🍗🍊</p>
        <p className="font-black text-gray-700 text-base leading-snug">At your next meal, find one carbohydrate, one protein, and one fruit or veg. A balanced plate has all three!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FFEDD5" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EA580C" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-orange-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-orange-600 shadow-[0_6px_0_#C2410C] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
