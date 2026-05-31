// Activity: Reversible vs Irreversible Changes — Age 8 (Band B8)
// Intermediate Phase Gr 3 — test & classify changes you can / cannot undo.
//   Plan (predict) → Sort 6 changes → Conclude (fill blanks) → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Change { id: string; emoji: string; name: string; reversible: boolean; }
const CHANGES: Change[] = [
  { id: 'melt',   emoji: '🧊', name: 'Melt ice',       reversible: true },
  { id: 'freeze', emoji: '💧', name: 'Freeze water',   reversible: true },
  { id: 'choc',   emoji: '🍫', name: 'Melt chocolate', reversible: true },
  { id: 'toast',  emoji: '🍞', name: 'Toast bread',    reversible: false },
  { id: 'burn',   emoji: '🔥', name: 'Burn paper',     reversible: false },
  { id: 'egg',    emoji: '🍳', name: 'Cook an egg',    reversible: false },
];

const OBJECTIVE_ID = 'mm.reversible';
const BADGE = 'Change Detective 🔁';

const PLAN_VOICE = "Some changes can be undone, and some cannot. Can EVERY change be undone? Predict yes or no.";
const TEST_VOICE = "For each change, decide: can we undo it, or not? Sort all six.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Change Detective Badge! At home, ask a grown-up: toast a slice of bread. Can you ever turn it back into fresh bread?";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function ReversibleChangeActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle');
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const cur = CHANGES[idx];
  const done = idx >= CHANGES.length;

  function predict() { setPredicted(true); speak("Let's test some changes and sort them!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function sort(asReversible: boolean) {
    if (feedback !== 'idle') return;
    const correct = asReversible === cur.reversible;
    setFeedback(correct ? 'right' : 'wrong');
    const word = cur.reversible ? 'reversible — we can undo it' : 'irreversible — we cannot undo it';
    speak(correct ? `Yes! ${cur.name} is ${word}.` : `Actually, ${cur.name} is ${word}.`, 0.9);
    setTimeout(() => {
      setFeedback('idle');
      if (idx + 1 >= CHANGES.length) { setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 200); }
      setIdx(i => i + 1);
    }, 1500);
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'reversible' && blank2 === 'irreversible') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! Melting ice is reversible because we can freeze it again. Burning paper is irreversible because we cannot get the paper back. You are a Change Detective!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Not quite. Which change can be undone, and which cannot? Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-violet-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-violet-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🧊↔️💧 · 🍞🚫</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Can EVERY change be undone?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-violet-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-violet-200 rounded-3xl active:scale-95"><span className="text-3xl">✅</span><p className="font-black text-violet-700 text-[11px] uppercase mt-1">Yes, all</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-violet-200 rounded-3xl active:scale-95"><span className="text-3xl">🚫</span><p className="font-black text-violet-700 text-[11px] uppercase mt-1">No, not all</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🔁</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && !done && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold">← Back</button>
            <p className="text-center text-xs text-violet-400 font-black uppercase">Change {idx + 1} of {CHANGES.length}</p>
            <motion.div key={cur.id} initial={{ scale: 0.8, opacity: 0 }} animate={feedback === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : { scale: 1, opacity: 1 }}
              className={`bg-white rounded-3xl p-6 border-2 shadow-md text-center w-full max-w-xs ${feedback === 'right' ? 'border-green-300' : feedback === 'wrong' ? 'border-red-300' : 'border-violet-100'}`}>
              <p className="text-6xl mb-2">{cur.emoji}</p>
              <p className="font-display font-black text-xl text-gray-800">{cur.name}</p>
              {feedback !== 'idle' && <p className={`text-sm font-black mt-2 ${cur.reversible ? 'text-green-600' : 'text-red-500'}`}>{cur.reversible ? '↩️ Reversible' : '🚫 Irreversible'}</p>}
            </motion.div>
            <p className="text-xs text-violet-500 font-bold">Can we undo this change?</p>
            <div className="flex gap-3 w-full max-w-xs">
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => sort(true)} disabled={feedback !== 'idle'} className="flex-1 py-4 bg-white border-2 border-violet-200 rounded-3xl font-black text-violet-700 text-sm active:scale-95">↩️ Can undo</motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => sort(false)} disabled={feedback !== 'idle'} className="flex-1 py-4 bg-white border-2 border-violet-200 rounded-3xl font-black text-violet-700 text-sm active:scale-95">🚫 Cannot undo</motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-violet-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-violet-100 shadow-md">
              <p className="text-base text-gray-800 font-bold leading-relaxed text-center">
                Melting ice is{' '}
                <span className={`inline-block min-w-[80px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-violet-100 border-violet-400 text-violet-700' : 'border-violet-200 text-violet-300'}`}>{blank1 ?? '______'}</span>.
                Burning paper is{' '}
                <span className={`inline-block min-w-[80px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-violet-100 border-violet-400 text-violet-700' : 'border-violet-200 text-violet-300'}`}>{blank2 ?? '______'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — melting ice</p>
              <div className="flex gap-2">{['reversible', 'irreversible'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-xs border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-violet-500 text-white border-violet-500' : 'bg-white text-violet-700 border-violet-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — burning paper</p>
              <div className="flex gap-2">{['reversible', 'irreversible'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-xs border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-violet-500 text-white border-violet-500' : 'bg-white text-violet-700 border-violet-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-violet-500 shadow-[0_5px_0_#7C3AED]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-violet-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🔁</div>
        <p className="font-display font-black text-violet-700 text-sm">Change Detective!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-violet-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🍞🔥</p>
        <p className="font-black text-gray-700 text-base leading-snug">With a grown-up: toast a slice of bread. Can you ever turn it back into fresh bread? Reversible or irreversible?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EDE9FE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#7C3AED" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-violet-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-violet-600 shadow-[0_6px_0_#6D28D9] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
