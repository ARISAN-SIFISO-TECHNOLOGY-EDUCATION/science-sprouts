// Activity: Light & Shadows — Shadow Size — Age 8 (Band B8)
// Intermediate Phase Gr 3 — measure & spot the pattern:
//   Plan (predict) → Measure shadow height (cm) at 3 distances → see the pattern
//   → Conclude (fill-in-the-blanks) → Apply (caregiver card)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Spot { id: string; name: string; dist: number; shadow: number; } // dist=cm from light, shadow=cm tall

// Closer to the light → bigger shadow (light spreads out behind the object).
const SPOTS: Spot[] = [
  { id: 'near', name: 'Near',   dist: 5,  shadow: 42 },
  { id: 'mid',  name: 'Middle', dist: 15, shadow: 24 },
  { id: 'far',  name: 'Far',    dist: 30, shadow: 13 },
];
const MAX_SHADOW = 50;

const OBJECTIVE_ID = 'ec.shadow_size';
const BADGE = 'Shadow Scientist Badge 🔦';

const PLAN_VOICE = "What happens to a shadow when the toy moves closer to the light? Bigger or smaller? Predict!";
const TEST_VOICE = "Move the toy to each spot and measure how tall its shadow is, in centimetres.";
const CONCLUDE_VOICE = "Look at your data, then finish the conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Shadow Scientist Badge! At home: measure your own shadow at nine in the morning and again at three in the afternoon. Which is longer?";

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

export default function ShadowSizeActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [active, setActive] = useState<Spot>(SPOTS[1]); // start at middle
  const [measured, setMeasured] = useState<Set<string>>(new Set());

  // Conclusion builder
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const allMeasured = measured.size >= SPOTS.length;

  function predict() {
    setPredicted(true);
    speak("Let's set up the light and measure!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); });
  }

  function moveTo(spot: Spot) {
    setActive(spot);
    if (!measured.has(spot.id)) {
      const isLast = measured.size + 1 >= SPOTS.length;
      speak(`${spot.name}: shadow is ${spot.shadow} centimetres tall.`, 0.9, isLast ? () => {} : undefined);
      setMeasured(prev => new Set([...prev, spot.id]));
    }
  }

  function checkConclusion() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'closer' && blank2 === 'bigger') {
      setResult('correct');
      awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! When the toy moves closer to the light, its shadow gets bigger. You are a Shadow Scientist!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else {
      setResult('wrong');
      speak("Not quite. Look at your measurements — near gave the tallest shadow. Try again.", 0.9, undefined);
      setTimeout(() => setResult('idle'), 1600);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-100 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── PLAN ─────────────────────────────────────────────── */}
        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-slate-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🔦🧸🌑</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">When the toy moves closer to the light, what happens to its shadow?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-indigo-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-indigo-200 rounded-3xl active:scale-95">
                  <span className="text-3xl">🔺</span><p className="font-black text-indigo-700 text-[11px] uppercase mt-1">Gets bigger</p>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-indigo-200 rounded-3xl active:scale-95">
                  <span className="text-3xl">🔻</span><p className="font-black text-indigo-700 text-[11px] uppercase mt-1">Gets smaller</p>
                </motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🤔</motion.div>}
          </motion.div>
        )}

        {/* ── TEST (measure shadow at 3 distances) ────────────── */}
        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-slate-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-slate-700 text-base mb-1">Shadow Lab 🔦</p>
            <p className="text-center text-xs text-slate-400 font-bold mb-3">Move the toy. Read the shadow's height in cm.</p>

            {/* Light → toy → wall scene */}
            <div className="bg-slate-800 rounded-2xl p-4 flex items-end justify-between gap-2 h-44 overflow-hidden">
              {/* torch */}
              <div className="flex flex-col items-center text-3xl">🔦<span className="text-[8px] font-black text-amber-300 uppercase mt-1">Light</span></div>
              {/* toy at chosen distance — closer to torch = left */}
              <motion.div className="flex flex-col items-center" animate={{ x: active.id === 'near' ? -40 : active.id === 'mid' ? 0 : 40 }} transition={{ type: 'spring', damping: 16 }}>
                <span className="text-3xl">🧸</span>
              </motion.div>
              {/* wall + shadow */}
              <div className="flex flex-col items-center justify-end h-full">
                <div className="relative w-10 bg-slate-600 rounded-t-md flex items-end justify-center" style={{ height: '100%' }}>
                  <motion.div className="w-7 bg-slate-900/80 rounded-t-sm" initial={false}
                    animate={{ height: `${(active.shadow / MAX_SHADOW) * 100}%` }} transition={{ type: 'spring', damping: 14 }} />
                  <span className="absolute -top-1 text-[10px] font-black text-amber-300">{measured.has(active.id) ? `${active.shadow}cm` : '?'}</span>
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase mt-1">Wall</span>
              </div>
            </div>

            {/* distance buttons */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {SPOTS.map(s => {
                const done = measured.has(s.id);
                return (
                  <button key={s.id} onClick={() => moveTo(s)}
                    className={`py-2 rounded-2xl border-2 font-black text-xs active:scale-95 ${active.id === s.id ? 'bg-indigo-500 text-white border-indigo-500' : done ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200'}`}>
                    {s.name}<span className="block text-[9px] font-bold opacity-70">{s.dist}cm away</span>
                  </button>
                );
              })}
            </div>

            {/* results bar chart */}
            <p className="text-center text-[10px] font-black text-slate-400 uppercase mt-4 mb-1">Shadow height (cm)</p>
            <div className="flex-1 flex items-end justify-around gap-3 bg-white rounded-2xl border-2 border-slate-100 p-3 min-h-[110px]">
              {SPOTS.map(s => {
                const done = measured.has(s.id);
                const tallest = s.id === 'near';
                return (
                  <div key={s.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    {done && <span className="text-[10px] font-black text-indigo-700 mb-0.5">{s.shadow}</span>}
                    <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(s.shadow / MAX_SHADOW) * 100}%` : 0 }} transition={{ type: 'spring', damping: 14 }}
                      className={`w-full rounded-t-xl ${done ? (tallest ? 'bg-indigo-600' : 'bg-indigo-300') : 'bg-gray-100'}`} style={{ minHeight: done ? 6 : 0 }} />
                    <span className="text-[8px] font-black text-gray-400 uppercase mt-1">{s.name}</span>
                  </div>
                );
              })}
            </div>

            {allMeasured && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }}
                className="mt-3 w-full py-4 bg-indigo-500 shadow-[0_5px_0_#4338CA] text-white font-display font-black text-lg rounded-3xl btn-press">
                Write my conclusion →
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ── CONCLUDE ─────────────────────────────────────────── */}
        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-slate-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-slate-700 text-base">✍️ My Conclusion</p>

            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                When the toy moves{' '}
                <span className={`inline-block min-w-[60px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-indigo-200 text-indigo-300'}`}>{blank1 ?? '____'}</span>{' '}
                to the light, its shadow gets{' '}
                <span className={`inline-block min-w-[60px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-indigo-200 text-indigo-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>

            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">
                {['closer', 'farther'].map(w => (
                  <button key={w} onClick={() => setBlank1(w)}
                    className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-indigo-700 border-indigo-200'}`}>{w}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">
                {['bigger', 'smaller'].map(w => (
                  <button key={w} onClick={() => setBlank2(w)}
                    className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-indigo-700 border-indigo-200'}`}>{w}</button>
                ))}
              </div>
            </div>

            <button onClick={checkConclusion} disabled={!blank1 || !blank2 || result === 'correct'}
              className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-indigo-500 shadow-[0_5px_0_#4338CA]' : 'bg-gray-300'}`}>
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
      <button onClick={onExit} className="self-start text-slate-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🔦</div>
        <p className="font-display font-black text-indigo-700 text-sm">Shadow Scientist Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-indigo-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌅🧍🌇</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: measure your own shadow at 9am and again at 3pm. Which time makes the longest shadow? Why do you think so?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E0E7FF" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4338CA" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-indigo-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-indigo-600 shadow-[0_6px_0_#3730A3] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
