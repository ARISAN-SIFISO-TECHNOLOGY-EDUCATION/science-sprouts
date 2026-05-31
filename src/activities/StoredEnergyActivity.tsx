// Activity: Stored Energy — Age 9 (Band B · CAPS Gr 4)
//   Plan (predict) → Sort items: stores energy? → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Item { id: string; emoji: string; name: string; stores: boolean; }
const ITEMS: Item[] = [
  { id: 'battery', emoji: '🔋', name: 'Battery',        stores: true },
  { id: 'banana',  emoji: '🍌', name: 'Banana',         stores: true },
  { id: 'band',    emoji: '➿', name: 'Stretched band', stores: true },
  { id: 'wood',    emoji: '🪵', name: 'Firewood',       stores: true },
  { id: 'rock',    emoji: '🪨', name: 'Plain rock',     stores: false },
  { id: 'water',   emoji: '💧', name: 'Glass of water',  stores: false },
];

const OBJECTIVE_ID = 'ec.stored_energy';
const BADGE = 'Energy Spotter Badge 🔋';

const PLAN_VOICE = "Some things store energy we can use later. Does a stretched rubber band store energy? Predict yes or no.";
const TEST_VOICE = "For each thing, decide: does it store energy we can use, or not?";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Energy Spotter Badge! At home: name three things that store energy — like food, batteries, or gas for the stove.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function StoredEnergyActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle');
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const cur = ITEMS[idx];
  const done = idx >= ITEMS.length;

  function predict() { setPredicted(true); speak("Let's check each thing for stored energy!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function answer(stores: boolean) {
    if (feedback !== 'idle') return;
    const correct = stores === cur.stores;
    setFeedback(correct ? 'right' : 'wrong');
    speak(correct ? (cur.stores ? `Yes! A ${cur.name} stores energy.` : `Right — a ${cur.name} has no stored energy.`) : (cur.stores ? `Actually, a ${cur.name} does store energy.` : `Actually, a ${cur.name} has no stored energy.`), 0.92);
    setTimeout(() => {
      setFeedback('idle');
      if (idx + 1 >= ITEMS.length) setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 200);
      setIdx(i => i + 1);
    }, 1400);
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'battery' && blank2 === 'no') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! A battery stores energy we can use later, but a plain rock has no stored energy. You are an Energy Spotter!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Which one stores energy, and which one has none? Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-yellow-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-yellow-400 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-yellow-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🔋🍌➿</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Does a stretched rubber band store energy?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-yellow-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-yellow-200 rounded-3xl active:scale-95"><span className="text-3xl">✅</span><p className="font-black text-yellow-700 text-[11px] uppercase mt-1">Yes</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-yellow-200 rounded-3xl active:scale-95"><span className="text-3xl">🚫</span><p className="font-black text-yellow-700 text-[11px] uppercase mt-1">No</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🔋</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && !done && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-yellow-400 text-sm font-bold">← Back</button>
            <p className="text-center text-xs text-yellow-500 font-black uppercase">Thing {idx + 1} of {ITEMS.length}</p>
            <motion.div key={cur.id} initial={{ scale: 0.8, opacity: 0 }} animate={feedback === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : { scale: 1, opacity: 1 }}
              className={`bg-white rounded-3xl p-6 border-2 shadow-md text-center w-full max-w-xs ${feedback === 'right' ? 'border-green-300' : feedback === 'wrong' ? 'border-red-300' : 'border-yellow-100'}`}>
              <p className="text-6xl mb-2">{cur.emoji}</p>
              <p className="font-display font-black text-xl text-gray-800">{cur.name}</p>
              {feedback !== 'idle' && <p className={`text-sm font-black mt-2 ${cur.stores ? 'text-green-600' : 'text-gray-500'}`}>{cur.stores ? '⚡ Stores energy' : '— No stored energy'}</p>}
            </motion.div>
            <p className="text-xs text-yellow-600 font-bold">Does it store energy?</p>
            <div className="flex gap-3 w-full max-w-xs">
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => answer(true)} disabled={feedback !== 'idle'} className="flex-1 py-4 bg-white border-2 border-yellow-200 rounded-3xl font-black text-yellow-700 text-sm active:scale-95">⚡ Yes</motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => answer(false)} disabled={feedback !== 'idle'} className="flex-1 py-4 bg-white border-2 border-yellow-200 rounded-3xl font-black text-yellow-700 text-sm active:scale-95">— No</motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-yellow-400 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-yellow-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-yellow-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                A{' '}
                <span className={`inline-block min-w-[60px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'border-yellow-200 text-yellow-300'}`}>{blank1 ?? '____'}</span>{' '}
                stores energy we can use later. A plain rock has{' '}
                <span className={`inline-block min-w-[44px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'border-yellow-200 text-yellow-300'}`}>{blank2 ?? '__'}</span>{' '}
                stored energy.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">{['battery', 'rock'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-yellow-700 border-yellow-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">{['no', 'lots of'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 ${blank2 === w ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-yellow-700 border-yellow-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-yellow-500 shadow-[0_5px_0_#CA8A04]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-yellow-400 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🔋</div>
        <p className="font-display font-black text-yellow-700 text-sm">Energy Spotter Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-yellow-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🍌🔋🔥</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: name 3 things that store energy — like food in the fridge, batteries in the remote, or gas for the stove.</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FEF9C3" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#CA8A04" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-yellow-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-yellow-500 shadow-[0_6px_0_#CA8A04] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
