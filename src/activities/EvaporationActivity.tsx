// Activity: Solids/Liquids/Gases in Life — Evaporation — Age 8 (Band B8)
// Intermediate Phase Gr 3 — why do wet clothes dry? Measure water disappearing.
//   Plan (predict) → Measure water level over days → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Reading { id: string; label: string; ml: number; }
const READINGS: Reading[] = [
  { id: 'd0', label: 'Day 0', ml: 100 },
  { id: 'd1', label: 'Day 1', ml: 70 },
  { id: 'd2', label: 'Day 2', ml: 40 },
  { id: 'd3', label: 'Day 3', ml: 10 },
];
const MAX = 100;
const LOST = READINGS[0].ml - READINGS[READINGS.length - 1].ml; // 90

const OBJECTIVE_ID = 'mm.evaporation';
const BADGE = 'Evaporation Investigator 💨';

const PLAN_VOICE = "Wet clothes dry in the sun. Where does the water go — into the air, or does it disappear forever? Predict!";
const TEST_VOICE = "Tap each day to measure the water left in the dish. Watch what happens.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Evaporation Investigator Badge! At home: hang a wet cloth in the sun and time how long it takes to dry.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function EvaporationActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [measured, setMeasured] = useState<Set<string>>(new Set());
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const all = measured.size >= READINGS.length;
  const current = [...READINGS].reverse().find(r => measured.has(r.id)) ?? READINGS[0];

  function predict() { setPredicted(true); speak("Let's measure the water each day and find out!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }
  function measure(rd: Reading) { if (measured.has(rd.id)) return; speak(`${rd.label}: ${rd.ml} millilitres left.`, 0.95); setMeasured(prev => new Set([...prev, rd.id])); }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'gas' && blank2 === 'air') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak(`Correct! The water did not disappear. It turned into a gas and went into the air. ${LOST} millilitres evaporated! You are an Evaporation Investigator!`, 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Not quite. The water changed state — it did not vanish. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-sky-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-sky-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">👕☀️💧</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Wet clothes dry in the sun. Where does the water go?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-sky-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-sky-200 rounded-3xl active:scale-95"><span className="text-3xl">💨</span><p className="font-black text-sky-700 text-[11px] uppercase mt-1">Into the air</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-sky-200 rounded-3xl active:scale-95"><span className="text-3xl">❓</span><p className="font-black text-sky-700 text-[11px] uppercase mt-1">Gone forever</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">💨</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-sky-700 text-base mb-1">Water Dish 💧</p>
            <p className="text-center text-xs text-sky-500 font-bold mb-3">Tap each day to measure the water left</p>

            {/* dish view of current reading */}
            <div className="bg-white rounded-2xl border-2 border-sky-100 p-4 flex flex-col items-center mb-3">
              <div className="relative w-32 h-20 bg-sky-50 border-4 border-sky-200 rounded-b-3xl overflow-hidden">
                <motion.div className="absolute bottom-0 left-0 right-0 bg-sky-400" initial={false} animate={{ height: `${(current.ml / MAX) * 100}%` }} transition={{ type: 'spring', damping: 16 }} />
              </div>
              <p className="font-display font-black text-sky-600 text-lg mt-2">{current.ml} ml <span className="text-xs text-gray-400">({current.label})</span></p>
            </div>

            <p className="text-center text-[10px] font-black text-gray-400 uppercase mb-1">Water left (ml)</p>
            <div className="flex-1 flex items-end justify-around gap-2 bg-white rounded-2xl border-2 border-sky-100 p-3 min-h-[110px]">
              {READINGS.map(rd => {
                const done = measured.has(rd.id);
                return (
                  <div key={rd.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    {done && <span className="text-[10px] font-black text-sky-700 mb-0.5">{rd.ml}</span>}
                    <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(rd.ml / MAX) * 100}%` : 0 }} transition={{ type: 'spring', damping: 14 }} className={`w-full rounded-t-xl ${done ? 'bg-sky-400' : 'bg-gray-100'}`} style={{ minHeight: done ? 6 : 0 }} />
                    <span className="text-[8px] font-black text-gray-400 uppercase mt-1">{rd.label}</span>
                  </div>
                );
              })}
            </div>

            {!all ? (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {READINGS.map(rd => (
                  <button key={rd.id} onClick={() => measure(rd)} disabled={measured.has(rd.id)} className={`py-2 rounded-2xl border-2 font-black text-[11px] active:scale-95 ${measured.has(rd.id) ? 'bg-sky-100 border-sky-200 text-sky-400' : 'bg-white border-sky-200 text-sky-700'}`}>{measured.has(rd.id) ? '✓' : rd.label}</button>
                ))}
              </div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }} className="mt-3 w-full py-4 bg-sky-500 shadow-[0_5px_0_#0284C7] text-white font-display font-black text-lg rounded-3xl btn-press">Write my conclusion →</motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-sky-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-sky-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                The water did not disappear. It turned into a{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-sky-100 border-sky-400 text-sky-700' : 'border-sky-200 text-sky-300'}`}>{blank1 ?? '____'}</span>{' '}
                and went into the{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-sky-100 border-sky-400 text-sky-700' : 'border-sky-200 text-sky-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">{['gas', 'solid'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-sky-700 border-sky-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">{['air', 'ground'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-sky-700 border-sky-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-sky-500 shadow-[0_5px_0_#0284C7]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">💨</div>
        <p className="font-display font-black text-sky-700 text-sm">Evaporation Investigator!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-sky-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">👕☀️⏱️</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: hang a wet cloth in the sun. Time how long it takes to dry. Where did the water go?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E0F2FE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0284C7" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-sky-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-sky-600 shadow-[0_6px_0_#0369A1] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
