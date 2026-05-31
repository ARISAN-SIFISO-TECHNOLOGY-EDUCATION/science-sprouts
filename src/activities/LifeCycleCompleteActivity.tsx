// Activity: Life Cycles — Complete — Age 8 (Band B8)
// Intermediate Phase Gr 3 — order the stages, add up the days, conclude.
//   Plan (predict) → Build order + count days → Conclude (fill blanks) → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Stage { id: string; emoji: string; name: string; days: number; }

// Days for a butterfly to reach each stage (approximate, CAPS-friendly).
const STAGES: Stage[] = [
  { id: 'egg',     emoji: '🥚', name: 'Egg',         days: 4 },
  { id: 'cat',     emoji: '🐛', name: 'Caterpillar', days: 14 },
  { id: 'chry',    emoji: '🛡️', name: 'Chrysalis',   days: 10 },
  { id: 'fly',     emoji: '🦋', name: 'Butterfly',   days: 0 },
];
const SCRAMBLE = ['chry', 'egg', 'fly', 'cat'];
const TOTAL_DAYS = STAGES.reduce((s, x) => s + x.days, 0); // 28

const OBJECTIVE_ID = 'll.life_cycle_b8';
const BADGE = 'Life Cycle Tracker 🦋';

const PLAN_VOICE = "How long does it take an egg to grow into a butterfly? About a week, or about a month? Predict!";
const TEST_VOICE = "Put the life cycle in order. Tap each stage from egg to butterfly, and add up the days.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Life Cycle Tracker Badge! At home: plant a seed and time how many days it takes to sprout. Write it down!";

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

export default function LifeCycleCompleteActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [placed, setPlaced] = useState<string[]>([]);
  const [shake, setShake] = useState(false);

  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const allPlaced = placed.length >= STAGES.length;

  function predict() {
    setPredicted(true);
    speak("Let's order the stages and count the days to find out!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); });
  }

  function place(id: string) {
    const needed = STAGES[placed.length].id;
    if (id !== needed) { setShake(true); speak("It starts with the egg. Try the order again!", 0.95); setTimeout(() => setShake(false), 500); return; }
    const next = [...placed, id];
    setPlaced(next);
    const st = STAGES.find(s => s.id === id)!;
    if (next.length >= STAGES.length) {
      speak(`The butterfly is born after about ${TOTAL_DAYS} days!`, 0.9, undefined);
    } else {
      speak(`${st.name}: ${st.days} days.`, 1.0);
    }
  }

  function checkConclusion() {
    if (!blank1 || !blank2) return;
    if (blank1 === '4' && blank2 === '28') {
      setResult('correct');
      awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! A butterfly has four life cycle stages and takes about twenty-eight days. You are a Life Cycle Tracker!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else {
      setResult('wrong');
      speak("Not quite. Count the stages and add the days again. Try once more.", 0.9, undefined);
      setTimeout(() => setResult('idle'), 1600);
    }
  }

  const pool = SCRAMBLE.filter(id => !placed.includes(id));
  const runningTotal = placed.reduce((s, id) => s + (STAGES.find(x => x.id === id)?.days ?? 0), 0);

  return (
    <div className="fixed inset-0 bg-amber-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🥚→🐛→🛡️→🦋</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">How long from egg to butterfly?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-amber-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-amber-200 rounded-3xl active:scale-95">
                  <span className="text-3xl">📅</span><p className="font-black text-amber-700 text-[11px] uppercase mt-1">About a week</p>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-amber-200 rounded-3xl active:scale-95">
                  <span className="text-3xl">🗓️</span><p className="font-black text-amber-700 text-[11px] uppercase mt-1">About a month</p>
                </motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🦋</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-amber-700 text-base mb-1">Order the life cycle</p>
            <p className="text-center text-xs text-amber-500 font-bold mb-3">Tap from egg to butterfly · add the days</p>

            <motion.div animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}
              className="flex items-center justify-center gap-1 flex-wrap mb-4">
              {STAGES.map((s, i) => {
                const done = placed.includes(s.id);
                return (
                  <React.Fragment key={s.id}>
                    {i > 0 && <span className="text-amber-300 font-black text-lg">→</span>}
                    <div className={`w-16 h-20 rounded-2xl border-2 flex flex-col items-center justify-center ${done ? 'bg-amber-100 border-amber-300' : 'bg-white border-dashed border-gray-200'}`}>
                      {done ? <><span className="text-2xl">{s.emoji}</span><span className="text-[9px] font-black text-amber-700">{s.days > 0 ? `${s.days}d` : '🎉'}</span></> : <span className="text-gray-200 font-black">{i + 1}</span>}
                    </div>
                  </React.Fragment>
                );
              })}
            </motion.div>

            {/* running total */}
            <div className="bg-white rounded-2xl border-2 border-amber-100 p-3 text-center mb-3">
              <p className="text-[10px] font-black text-gray-400 uppercase">Days counted so far</p>
              <p className="font-display font-black text-2xl text-amber-600">{runningTotal} days</p>
            </div>

            {!allPlaced ? (
              <>
                <p className="text-center text-[10px] font-black text-gray-400 uppercase mb-2">Tap the next stage</p>
                <div className="grid grid-cols-2 gap-3 px-2">
                  {pool.map(id => {
                    const s = STAGES.find(x => x.id === id)!;
                    return (
                      <motion.button key={id} whileTap={{ scale: 0.92 }} onClick={() => place(id)}
                        className="flex items-center gap-2 p-3 bg-white border-2 border-amber-200 rounded-2xl shadow-sm active:scale-95">
                        <span className="text-3xl">{s.emoji}</span>
                        <span className="font-black text-amber-700 text-xs uppercase leading-tight">{s.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }}
                className="mt-2 w-full py-4 bg-amber-500 shadow-[0_5px_0_#D97706] text-white font-display font-black text-lg rounded-3xl btn-press">
                Write my conclusion →
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-amber-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                A butterfly's life cycle has{' '}
                <span className={`inline-block min-w-[44px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-amber-200 text-amber-300'}`}>{blank1 ?? '__'}</span>{' '}
                stages and takes about{' '}
                <span className={`inline-block min-w-[44px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-amber-200 text-amber-300'}`}>{blank2 ?? '__'}</span>{' '}
                days.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — how many stages?</p>
              <div className="flex gap-2">
                {['3', '4', '5'].map(w => (
                  <button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 ${blank1 === w ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-700 border-amber-200'}`}>{w}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — how many days?</p>
              <div className="flex gap-2">
                {['7', '28', '100'].map(w => (
                  <button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 ${blank2 === w ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-700 border-amber-200'}`}>{w}</button>
                ))}
              </div>
            </div>
            <button onClick={checkConclusion} disabled={!blank1 || !blank2 || result === 'correct'}
              className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-amber-500 shadow-[0_5px_0_#D97706]' : 'bg-gray-300'}`}>
              {result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}
            </button>
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
      <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🦋</div>
        <p className="font-display font-black text-amber-700 text-sm">Life Cycle Tracker!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌱📅</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: plant a seed and time how many days it takes to sprout. Write the number down — just like a real scientist!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FEF3C7" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D97706" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-amber-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-amber-600 shadow-[0_6px_0_#B45309] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
