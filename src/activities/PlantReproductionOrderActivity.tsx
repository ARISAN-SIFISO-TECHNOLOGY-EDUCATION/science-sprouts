// Activity: Sexual Reproduction in Plants — Age 12 (Band C12 · CAPS Gr 7)
//   Plan (predict) → Order the steps flower → fruit → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Step { id: string; emoji: string; name: string; }
// Correct order
const STEPS: Step[] = [
  { id: 'flower',   emoji: '🌸', name: 'Flower' },
  { id: 'pollin',   emoji: '🐝', name: 'Pollination' },
  { id: 'fertil',   emoji: '✨', name: 'Fertilisation' },
  { id: 'seed',     emoji: '🌰', name: 'Seed forms' },
  { id: 'fruit',    emoji: '🍎', name: 'Fruit grows' },
];
const SHUFFLED: Step[] = [STEPS[3], STEPS[0], STEPS[4], STEPS[1], STEPS[2]];

const OBJECTIVE_ID = 'll.plant_reproduction_c12';
const BADGE = 'Seed Maker Badge 🌰';

const PLAN_VOICE = "Flowering plants make seeds in a set order. A bee carries pollen from flower to flower — pollination. Then the egg is fertilised and grows. Does the fruit form before the seed, or after? Predict!";
const TEST_VOICE = "Tap the steps in the right order, from the flower all the way to the fruit.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Seed Maker Badge! Cut open a fruit like an apple or a tomato. Find the seeds inside. Each one could grow into a new plant. The fruit protects the seeds and helps them spread.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function PlantReproductionOrderActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [placed, setPlaced] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  function predict() { setPredicted(true); speak("Let's put plant reproduction in order!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function tap(s: Step) {
    if (placed.includes(s.id)) return;
    const expected = STEPS[placed.length];
    if (s.id === expected.id) {
      const next = [...placed, s.id];
      setPlaced(next);
      speak(s.name, 0.95);
      if (next.length === STEPS.length) setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 900);
    } else {
      setShake(true); speak("Not next — what happens next in making a seed?", 0.9);
      setTimeout(() => setShake(false), 500);
    }
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'seed' && blank2 === 'fruit') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! After pollination, the egg is fertilised and grows into a seed. The seed is then protected inside a fruit, which helps it spread. You are a Seed Maker!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Fertilisation makes a seed, and the seed is protected inside a fruit. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-pink-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-pink-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-pink-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🌸🐝🍎</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Does the fruit form before the seed, or after?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-pink-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-pink-200 rounded-3xl active:scale-95"><span className="text-3xl">⬅️</span><p className="font-black text-pink-700 text-[11px] uppercase mt-1">Before</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-pink-200 rounded-3xl active:scale-95"><span className="text-3xl">➡️</span><p className="font-black text-pink-700 text-[11px] uppercase mt-1">After</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🌱</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-4">
            <button onClick={onExit} className="self-start text-pink-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-pink-700 text-base">🌸 Flower → Fruit 🍎</p>
            <div className="flex items-center justify-center gap-1 flex-wrap w-full max-w-sm min-h-[56px]">
              {placed.map((id, i) => {
                const s = STEPS.find(x => x.id === id)!;
                return (
                  <React.Fragment key={id}>
                    {i > 0 && <span className="text-pink-400 font-black">→</span>}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                      <span className="text-2xl">{s.emoji}</span>
                    </motion.div>
                  </React.Fragment>
                );
              })}
              {placed.length === 0 && <span className="text-pink-300 text-sm font-bold">Start with the flower…</span>}
            </div>
            <motion.div animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="grid grid-cols-3 gap-3 w-full max-w-sm">
              {SHUFFLED.map(s => {
                const used = placed.includes(s.id);
                return (
                  <motion.button key={s.id} whileTap={{ scale: used ? 1 : 0.92 }} onClick={() => tap(s)} disabled={used}
                    className={`p-3 rounded-3xl border-2 active:scale-95 flex flex-col items-center gap-1 ${used ? 'bg-pink-50 border-pink-100 opacity-40' : 'bg-white border-pink-200'}`}>
                    <span className="text-3xl">{s.emoji}</span>
                    <p className="font-black text-pink-700 text-[9px] uppercase text-center leading-tight">{s.name}</p>
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-pink-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-pink-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-pink-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                After pollination, the egg is fertilised and grows into a{' '}
                <span className={`inline-block min-w-[48px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-pink-100 border-pink-400 text-pink-700' : 'border-pink-200 text-pink-300'}`}>{blank1 ?? '____'}</span>.
                The seed is protected inside a{' '}
                <span className={`inline-block min-w-[48px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-pink-100 border-pink-400 text-pink-700' : 'border-pink-200 text-pink-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — grows into a…</p>
              <div className="flex gap-2">{['seed', 'leaf'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-pink-700 border-pink-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — protected inside a…</p>
              <div className="flex gap-2">{['fruit', 'root'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-pink-700 border-pink-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-pink-500 shadow-[0_5px_0_#DB2777]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-pink-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌰</div>
        <p className="font-display font-black text-pink-700 text-sm">Seed Maker Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-pink-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌸🐝🍎</p>
        <p className="font-black text-gray-700 text-base leading-snug">Cut open an apple or tomato. Find the seeds inside. Each could grow a new plant — and the fruit helps them spread!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FCE7F3" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#DB2777" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-pink-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-pink-600 shadow-[0_6px_0_#BE185D] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
