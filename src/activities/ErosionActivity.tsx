// Activity: Soil Erosion — Age 10 (Band C · CAPS Gr 5)
//   Plan (predict) → Investigate: rain on bare vs covered soil → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

const OBJECTIVE_ID = 'eb.erosion';
const BADGE = 'Soil Guardian Badge 🌱';

const PLAN_VOICE = "When rain falls on a hill, it can wash the soil away. We call this erosion. Which loses more soil in heavy rain — bare ground, or ground covered with plants? Predict!";
const TEST_VOICE = "Drag the slider to make the rain heavier. Watch how much soil washes off each hill. When you have seen enough, record your result.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Soil Guardian Badge! After it rains, look for muddy brown puddles or little channels in bare ground — that is soil being washed away. Where plants grow, the soil stays put.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function ErosionActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [rain, setRain] = useState(0);
  const [seen, setSeen] = useState(false);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const bareLoss = rain * 8;      // grams of soil washed off bare hill
  const coveredLoss = rain * 2;   // grams off planted hill

  function predict() { setPredicted(true); speak("Let's test rain on bare and planted soil!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function onRain(v: number) {
    setRain(v);
    if (v >= 7 && !seen) { setSeen(true); speak(`Heavy rain! The bare hill lost ${v * 8} grams of soil, but the planted hill lost only ${v * 2} grams.`, 0.92); }
  }

  function record() { setPhase('conclude'); speak(CONCLUDE_VOICE); }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'faster' && blank2 === 'hold') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! Bare soil is washed away faster than soil with plants. Plant roots hold the soil in place and protect it from erosion. You are a Soil Guardian!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Bare soil erodes faster. Roots hold the soil. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-lime-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-lime-500 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-lime-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-lime-600 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🌧️⛰️🌱</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Which loses more soil in heavy rain?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-lime-600 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-lime-200 rounded-3xl active:scale-95"><span className="text-3xl">⛰️</span><p className="font-black text-lime-700 text-[11px] uppercase mt-1">Bare hill</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-lime-200 rounded-3xl active:scale-95"><span className="text-3xl">🌱</span><p className="font-black text-lime-700 text-[11px] uppercase mt-1">Planted hill</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🌧️</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-4">
            <button onClick={onExit} className="self-start text-lime-500 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-lime-700 text-base">🌧️ Rain Erosion Test</p>
            {/* Two hills with soil-loss bars */}
            <div className="flex gap-4 w-full max-w-sm justify-center items-end">
              <div className="flex-1 flex flex-col items-center gap-1">
                <span className="text-4xl">⛰️</span>
                <p className="text-[10px] font-black text-lime-700 uppercase">Bare</p>
                <div className="w-full h-32 bg-lime-100 rounded-xl flex items-end overflow-hidden">
                  <motion.div animate={{ height: `${Math.min(100, bareLoss)}%` }} className="w-full bg-amber-700" />
                </div>
                <p className="font-black text-amber-800 text-sm">{bareLoss} g lost</p>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <span className="text-4xl">🌱</span>
                <p className="text-[10px] font-black text-lime-700 uppercase">Planted</p>
                <div className="w-full h-32 bg-lime-100 rounded-xl flex items-end overflow-hidden">
                  <motion.div animate={{ height: `${Math.min(100, coveredLoss)}%` }} className="w-full bg-amber-500" />
                </div>
                <p className="font-black text-amber-700 text-sm">{coveredLoss} g lost</p>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <p className="text-xs text-lime-600 font-bold text-center mb-1">Rain strength: {rain} mm {rain >= 7 ? '🌧️🌧️' : rain >= 4 ? '🌧️' : '🌦️'}</p>
              <input type="range" min={0} max={10} value={rain} onChange={e => onRain(Number(e.target.value))} className="w-full accent-lime-600 h-3" />
            </div>
            <button onClick={record} disabled={!seen} className={`px-8 py-4 rounded-3xl font-display font-black text-lg text-white btn-press ${seen ? 'bg-lime-600 shadow-[0_5px_0_#4D7C0F]' : 'bg-gray-300'}`}>
              {seen ? 'Record result →' : 'Turn the rain up…'}
            </button>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-lime-500 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-lime-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-lime-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                Bare soil is washed away{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-lime-100 border-lime-400 text-lime-700' : 'border-lime-200 text-lime-300'}`}>{blank1 ?? '____'}</span>{' '}
                than planted soil. Plant roots{' '}
                <span className={`inline-block min-w-[48px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-lime-100 border-lime-400 text-lime-700' : 'border-lime-200 text-lime-300'}`}>{blank2 ?? '____'}</span>{' '}
                the soil.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — bare soil washes away…</p>
              <div className="flex gap-2">{['faster', 'slower'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-lime-600 text-white border-lime-600' : 'bg-white text-lime-700 border-lime-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — plant roots…</p>
              <div className="flex gap-2">{['hold', 'wash'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-lime-600 text-white border-lime-600' : 'bg-white text-lime-700 border-lime-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-lime-600 shadow-[0_5px_0_#4D7C0F]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-lime-500 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-lime-600 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌱</div>
        <p className="font-display font-black text-lime-700 text-sm">Soil Guardian Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-lime-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌧️⛰️🌱</p>
        <p className="font-black text-gray-700 text-base leading-snug">After rain, look for muddy brown puddles or channels in bare ground — that is soil washing away. Where plants grow, soil stays put.</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ECFCCB" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4D7C0F" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-lime-700 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-lime-700 shadow-[0_6px_0_#3F6212] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
