// Activity: Stored Energy in Fuels — Age 10 (Band C · CAPS Gr 5)
//   Plan (predict) → Classify 6 things as fuel / not → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';
type Group = 'fuel' | 'not';

interface Thing { id: string; emoji: string; name: string; group: Group; }
const THINGS: Thing[] = [
  { id: 'wood',   emoji: '🪵', name: 'Wood',   group: 'fuel' },
  { id: 'coal',   emoji: '🪨', name: 'Coal',   group: 'fuel' },
  { id: 'petrol', emoji: '⛽', name: 'Petrol', group: 'fuel' },
  { id: 'gas',    emoji: '🔥', name: 'Gas',    group: 'fuel' },
  { id: 'water',  emoji: '💧', name: 'Water',  group: 'not' },
  { id: 'rock',   emoji: '🧱', name: 'Brick',  group: 'not' },
];
const GROUPS: { id: Group; label: string; emoji: string }[] = [
  { id: 'fuel', label: 'A fuel',     emoji: '🔥' },
  { id: 'not',  label: 'Not a fuel', emoji: '🚫' },
];

const OBJECTIVE_ID = 'ec.fuels';
const BADGE = 'Fuel Finder Badge 🔥';

const PLAN_VOICE = "A fuel stores energy. When we burn it, that energy is released as heat and light. Is wood a fuel that stores energy? Predict!";
const TEST_VOICE = "Sort each thing. Can we burn it to release stored energy — is it a fuel?";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Fuel Finder Badge! Find out how your home cooks food — does it burn gas or wood, or use electricity? Talk about where that energy comes from.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function FuelsActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle');
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const cur = THINGS[idx];
  const done = idx >= THINGS.length;

  function predict() { setPredicted(true); speak("Let's find the fuels that store energy!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function sort(g: Group) {
    if (feedback !== 'idle') return;
    const correct = g === cur.group;
    setFeedback(correct ? 'right' : 'wrong');
    const word = cur.group === 'fuel' ? 'a fuel — it stores energy we can burn' : 'not a fuel — it cannot be burned for energy';
    speak(correct ? `Correct! ${cur.name} is ${word}.` : `Actually, ${cur.name} is ${word}.`, 0.92);
    setTimeout(() => {
      setFeedback('idle');
      if (idx + 1 >= THINGS.length) setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 200);
      setIdx(i => i + 1);
    }, 1400);
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'burns' && blank2 === 'fuels') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! A fuel stores energy that is released when it burns. Wood, coal and petrol are fuels. Even the food you eat is a fuel for your body! You are a Fuel Finder!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Fuel releases energy when it burns. Wood and coal are fuels. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-red-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-red-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-red-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🪵🪨⛽</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Is wood a fuel that stores energy?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-red-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-red-200 rounded-3xl active:scale-95"><span className="text-3xl">🔥</span><p className="font-black text-red-700 text-[11px] uppercase mt-1">A fuel</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-red-200 rounded-3xl active:scale-95"><span className="text-3xl">🚫</span><p className="font-black text-red-700 text-[11px] uppercase mt-1">Not a fuel</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🔍</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && !done && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-red-300 text-sm font-bold">← Back</button>
            <p className="text-center text-xs text-red-400 font-black uppercase">Thing {idx + 1} of {THINGS.length}</p>
            <motion.div key={cur.id} initial={{ scale: 0.8, opacity: 0 }} animate={feedback === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : { scale: 1, opacity: 1 }}
              className={`bg-white rounded-3xl p-6 border-2 shadow-md text-center w-full max-w-xs ${feedback === 'right' ? 'border-green-300' : feedback === 'wrong' ? 'border-red-300' : 'border-red-100'}`}>
              <p className="text-6xl mb-2">{cur.emoji}</p>
              <p className="font-display font-black text-xl text-gray-800">{cur.name}</p>
            </motion.div>
            <p className="text-xs text-red-500 font-bold">Can we burn it for energy?</p>
            <div className="flex gap-2 w-full max-w-xs">
              {GROUPS.map(g => (
                <motion.button key={g.id} whileTap={{ scale: 0.92 }} onClick={() => sort(g.id)} disabled={feedback !== 'idle'} className="flex-1 py-3 bg-white border-2 border-red-200 rounded-2xl font-black text-red-700 text-[10px] uppercase active:scale-95 flex flex-col items-center gap-1">
                  <span className="text-xl">{g.emoji}</span>{g.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-red-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-red-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-red-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                A fuel releases its stored energy when it{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-red-100 border-red-400 text-red-700' : 'border-red-200 text-red-300'}`}>{blank1 ?? '____'}</span>.
                Wood and coal are{' '}
                <span className={`inline-block min-w-[48px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-red-100 border-red-400 text-red-700' : 'border-red-200 text-red-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — releases energy when it…</p>
              <div className="flex gap-2">{['burns', 'freezes'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-red-500 text-white border-red-500' : 'bg-white text-red-700 border-red-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — wood and coal are…</p>
              <div className="flex gap-2">{['fuels', 'metals'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-red-500 text-white border-red-500' : 'bg-white text-red-700 border-red-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-red-500 shadow-[0_5px_0_#DC2626]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-red-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🔥</div>
        <p className="font-display font-black text-red-700 text-sm">Fuel Finder Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-red-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🪵🔥🍳</p>
        <p className="font-black text-gray-700 text-base leading-snug">Find out how your home cooks food — gas, wood, or electricity? Where does that energy come from?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FEE2E2" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#DC2626" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-red-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-red-600 shadow-[0_6px_0_#B91C1C] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
