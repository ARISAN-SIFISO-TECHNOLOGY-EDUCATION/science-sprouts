// Activity: Mixtures & Separation — Age 11 (Band C11 · CAPS Gr 6)
//   Plan (predict) → Pick the right separation method → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';
type Method = 'sieve' | 'magnet' | 'evaporate';

interface Mix { id: string; emoji: string; name: string; method: Method; }
const MIXES: Mix[] = [
  { id: 'stones', emoji: '🪨', name: 'Stones in sand',       method: 'sieve' },
  { id: 'beads',  emoji: '⚪', name: 'Marbles in flour',     method: 'sieve' },
  { id: 'iron',   emoji: '🧲', name: 'Iron bits in rice',    method: 'magnet' },
  { id: 'clips',  emoji: '📎', name: 'Paperclips in sugar',  method: 'magnet' },
  { id: 'salt',   emoji: '🧂', name: 'Salt in water',        method: 'evaporate' },
  { id: 'sugar',  emoji: '🍬', name: 'Sugar in water',       method: 'evaporate' },
];
const METHODS: { id: Method; label: string; emoji: string }[] = [
  { id: 'sieve',     label: 'Sieve',     emoji: '🕳️' },
  { id: 'magnet',    label: 'Magnet',    emoji: '🧲' },
  { id: 'evaporate', label: 'Evaporate', emoji: '☀️' },
];

const OBJECTIVE_ID = 'mm.mixtures_separate';
const BADGE = 'Separation Scientist Badge 🧲';

const PLAN_VOICE = "When we mix things together, we can often separate them again. We choose the method that fits. How would you get salt back out of salty water — with a magnet, or by evaporating the water? Predict!";
const TEST_VOICE = "For each mixture, choose the best way to separate it.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Separation Scientist Badge! In the kitchen, find a sieve or a colander. Talk about what it separates — like pasta from water. Mixtures are everywhere!";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function MixturesSeparateActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle');
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const cur = MIXES[idx];
  const done = idx >= MIXES.length;

  function predict() { setPredicted(true); speak("Let's separate some mixtures!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function pick(m: Method) {
    if (feedback !== 'idle') return;
    const correct = m === cur.method;
    setFeedback(correct ? 'right' : 'wrong');
    const word = cur.method === 'sieve' ? 'a sieve catches the big pieces' : cur.method === 'magnet' ? 'a magnet pulls out the iron' : 'evaporating leaves the solid behind';
    speak(correct ? `Yes! For ${cur.name.toLowerCase()}, ${word}.` : `Actually, for ${cur.name.toLowerCase()}, ${word}.`, 0.92);
    setTimeout(() => {
      setFeedback('idle');
      if (idx + 1 >= MIXES.length) setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 200);
      setIdx(i => i + 1);
    }, 1400);
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'evaporating' && blank2 === 'magnet') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! To get salt from salt water we use evaporating — the water leaves, the salt stays. To pull iron from a mixture we use a magnet. The right method for each mixture. You are a Separation Scientist!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Salt water is separated by evaporating. Iron is pulled out with a magnet. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-cyan-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-cyan-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-cyan-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🧂💧☀️</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">How do you get salt back out of salty water?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-cyan-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-cyan-200 rounded-3xl active:scale-95"><span className="text-3xl">🧲</span><p className="font-black text-cyan-700 text-[11px] uppercase mt-1">Magnet</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-cyan-200 rounded-3xl active:scale-95"><span className="text-3xl">☀️</span><p className="font-black text-cyan-700 text-[11px] uppercase mt-1">Evaporate</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🔬</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && !done && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-cyan-300 text-sm font-bold">← Back</button>
            <p className="text-center text-xs text-cyan-400 font-black uppercase">Mixture {idx + 1} of {MIXES.length}</p>
            <motion.div key={cur.id} initial={{ scale: 0.8, opacity: 0 }} animate={feedback === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : { scale: 1, opacity: 1 }}
              className={`bg-white rounded-3xl p-6 border-2 shadow-md text-center w-full max-w-xs ${feedback === 'right' ? 'border-green-300' : feedback === 'wrong' ? 'border-red-300' : 'border-cyan-100'}`}>
              <p className="text-6xl mb-2">{cur.emoji}</p>
              <p className="font-display font-black text-lg text-gray-800">{cur.name}</p>
            </motion.div>
            <p className="text-xs text-cyan-500 font-bold">How do we separate it?</p>
            <div className="flex gap-2 w-full max-w-xs">
              {METHODS.map(m => (
                <motion.button key={m.id} whileTap={{ scale: 0.92 }} onClick={() => pick(m.id)} disabled={feedback !== 'idle'} className="flex-1 py-3 bg-white border-2 border-cyan-200 rounded-2xl font-black text-cyan-700 text-[10px] uppercase active:scale-95 flex flex-col items-center gap-1">
                  <span className="text-xl">{m.emoji}</span>{m.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-cyan-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-cyan-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-cyan-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                To get salt from salt water, we use{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-cyan-100 border-cyan-400 text-cyan-700' : 'border-cyan-200 text-cyan-300'}`}>{blank1 ?? '____'}</span>.
                To pull iron from a mixture, we use a{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-cyan-100 border-cyan-400 text-cyan-700' : 'border-cyan-200 text-cyan-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — salt from water…</p>
              <div className="flex gap-2">{['evaporating', 'a magnet'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-xs border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-white text-cyan-700 border-cyan-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — iron from a mixture…</p>
              <div className="flex gap-2">{['magnet', 'sieve'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-white text-cyan-700 border-cyan-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-cyan-500 shadow-[0_5px_0_#0891B2]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-cyan-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🧲</div>
        <p className="font-display font-black text-cyan-700 text-sm">Separation Scientist Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-cyan-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🕳️🧲☀️</p>
        <p className="font-black text-gray-700 text-base leading-snug">In the kitchen, find a sieve or colander. What does it separate — like pasta from water? Mixtures are everywhere!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#CFFAFE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0891B2" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-cyan-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-cyan-600 shadow-[0_6px_0_#0E7490] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
