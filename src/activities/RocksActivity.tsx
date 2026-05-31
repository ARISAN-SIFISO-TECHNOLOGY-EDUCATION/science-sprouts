// Activity: Rocks & Soils — Hardness — Age 8 (Band B8)
// Intermediate Phase Gr 3 — observe & test rocks, record a property (hardness).
//   Plan (predict) → Scratch-test 3 rocks → Conclude (fill blanks) → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Rock { id: string; emoji: string; name: string; hardness: number; } // 1–10 scratch scale
const ROCKS: Rock[] = [
  { id: 'chalk',     emoji: '🧂', name: 'Chalk',     hardness: 2 },
  { id: 'sandstone', emoji: '🟫', name: 'Sandstone', hardness: 5 },
  { id: 'granite',   emoji: '⬜', name: 'Granite',   hardness: 7 },
];
const MAX_H = 10;

const OBJECTIVE_ID = 'eb.rocks';
const BADGE = 'Rock Investigator 🪨';

const PLAN_VOICE = "Rocks are Earth materials. Are all rocks equally hard? Predict yes or no.";
const TEST_VOICE = "Tap each rock to do a scratch test. The higher the number, the harder the rock.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Rock Investigator Badge! Outside: collect three different rocks. Try scratching one with another. Which rock scratches the others?";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function RocksActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [tested, setTested] = useState<Set<string>>(new Set());
  const [scratching, setScratching] = useState<string | null>(null);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const all = tested.size >= ROCKS.length;
  const hardest = ROCKS.reduce((a, b) => (b.hardness > a.hardness ? b : a));

  function predict() { setPredicted(true); speak("Let's test them and record the hardness!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }
  function test(rk: Rock) {
    if (tested.has(rk.id) || scratching) return;
    setScratching(rk.id);
    speak(`${rk.name}: hardness ${rk.hardness} out of 10.`, 0.95);
    setTimeout(() => { setTested(prev => new Set([...prev, rk.id])); setScratching(null); }, 1100);
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'granite' && blank2 === 'hardest') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! Granite is the hardest rock because it was the hardest to scratch. You are a Rock Investigator!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Look at your data — which rock had the highest hardness number? Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-slate-100 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-slate-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🧂🟫⬜</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Are all rocks equally hard?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-slate-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-slate-200 rounded-3xl active:scale-95"><span className="text-3xl">🟰</span><p className="font-black text-slate-700 text-[11px] uppercase mt-1">All the same</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-slate-200 rounded-3xl active:scale-95"><span className="text-3xl">↕️</span><p className="font-black text-slate-700 text-[11px] uppercase mt-1">All different</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🪨</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-slate-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-slate-700 text-base mb-1">Scratch Test 🪨</p>
            <p className="text-center text-xs text-slate-400 font-bold mb-3">Tap each rock · record hardness (out of 10)</p>

            <p className="text-center text-[10px] font-black text-gray-400 uppercase mb-1">Hardness</p>
            <div className="flex-1 flex items-end justify-around gap-4 bg-white rounded-2xl border-2 border-slate-100 p-3 min-h-[150px]">
              {ROCKS.map(rk => {
                const done = tested.has(rk.id);
                const top = rk.id === hardest.id;
                return (
                  <div key={rk.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    {done && <span className="text-[11px] font-black text-slate-700 mb-0.5">{rk.hardness}/10</span>}
                    <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(rk.hardness / MAX_H) * 100}%` : 0 }} transition={{ type: 'spring', damping: 14 }} className={`w-full rounded-t-xl ${done ? (top ? 'bg-slate-700' : 'bg-slate-400') : 'bg-gray-100'}`} style={{ minHeight: done ? 6 : 0 }} />
                    <span className="text-xl mt-1">{rk.emoji}</span>
                    <span className="text-[8px] font-black text-gray-400 uppercase">{rk.name}</span>
                  </div>
                );
              })}
            </div>

            {!all ? (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {ROCKS.map(rk => (
                  <button key={rk.id} onClick={() => test(rk)} disabled={tested.has(rk.id) || !!scratching} className={`py-3 rounded-2xl border-2 font-black text-[11px] active:scale-95 flex flex-col items-center gap-0.5 ${tested.has(rk.id) ? 'bg-slate-100 border-slate-200 text-slate-400' : scratching === rk.id ? 'bg-amber-50 border-amber-300 text-amber-600' : 'bg-white border-slate-200 text-slate-700'}`}>
                    <span className="text-xl">{rk.emoji}</span>{scratching === rk.id ? '✏️…' : tested.has(rk.id) ? '✓' : rk.name}
                  </button>
                ))}
              </div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }} className="mt-3 w-full py-4 bg-slate-600 shadow-[0_5px_0_#475569] text-white font-display font-black text-lg rounded-3xl btn-press">Write my conclusion →</motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-slate-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-slate-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                <span className={`inline-block min-w-[64px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-slate-200 border-slate-400 text-slate-700' : 'border-slate-200 text-slate-300'}`}>{blank1 ? blank1[0].toUpperCase() + blank1.slice(1) : '______'}</span>{' '}
                is the hardest rock because it was the{' '}
                <span className={`inline-block min-w-[64px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-slate-200 border-slate-400 text-slate-700' : 'border-slate-200 text-slate-300'}`}>{blank2 ?? '______'}</span>{' '}
                to scratch.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — which rock?</p>
              <div className="flex gap-2">{['chalk', 'sandstone', 'granite'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-[11px] border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-slate-600 text-white border-slate-600' : 'bg-white text-slate-700 border-slate-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">{['hardest', 'easiest'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-slate-600 text-white border-slate-600' : 'bg-white text-slate-700 border-slate-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-slate-600 shadow-[0_5px_0_#475569]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-slate-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-slate-600 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🪨</div>
        <p className="font-display font-black text-slate-700 text-sm">Rock Investigator!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-slate-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🪨🔍🪨</p>
        <p className="font-black text-gray-700 text-base leading-snug">Outside: collect 3 different rocks. Try scratching one with another. Which rock scratches the others? That one is hardest!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E2E8F0" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#475569" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-slate-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-slate-700 shadow-[0_6px_0_#334155] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
