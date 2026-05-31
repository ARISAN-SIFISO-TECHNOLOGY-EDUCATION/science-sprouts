// Activity: Planets & The Solar System — Age 9 (Band B · CAPS Gr 4)
// Planets orbit the sun; the farther out, the longer the year.
//   Plan (predict) → Measure orbit time of 3 planets → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Planet { id: string; emoji: string; name: string; days: number; }
const PLANETS: Planet[] = [
  { id: 'mercury', emoji: '☄️', name: 'Mercury', days: 88 },
  { id: 'earth',   emoji: '🌍', name: 'Earth',   days: 365 },
  { id: 'mars',    emoji: '🔴', name: 'Mars',    days: 687 },
];
const MAX_DAYS = 687;

const OBJECTIVE_ID = 'eb.solar_system';
const BADGE = 'Astronomer Badge 🪐';

const PLAN_VOICE = "Planets travel around the sun. Does a planet far from the sun have a longer year or a shorter year? Predict!";
const TEST_VOICE = "Tap each planet to send it around the sun. Measure how many Earth-days one orbit takes.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Astronomer Badge! At night with a grown-up: look for a planet. Planets shine steadily and do not twinkle like the stars.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function SolarSystemActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [measured, setMeasured] = useState<Set<string>>(new Set());
  const [orbiting, setOrbiting] = useState<string | null>(null);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const all = measured.size >= PLANETS.length;

  function predict() { setPredicted(true); speak("Let's time each planet's orbit and find out!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }
  function measure(p: Planet) {
    if (measured.has(p.id) || orbiting) return;
    setOrbiting(p.id);
    speak(`${p.name}: one orbit takes ${p.days} Earth-days.`, 0.92);
    setTimeout(() => { setMeasured(prev => new Set([...prev, p.id])); setOrbiting(null); }, 1100);
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'farther' && blank2 === 'longer') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! A planet farther from the sun takes longer to orbit. That is why Mars has a longer year than Earth. You are an Astronomer!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Look at your graph — Mars is farthest and its bar was the biggest. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-indigo-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-indigo-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-indigo-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">☀️🪐</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Does a planet far from the sun have a longer or shorter year?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-indigo-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-indigo-200 rounded-3xl active:scale-95"><span className="text-3xl">⏳</span><p className="font-black text-indigo-700 text-[11px] uppercase mt-1">Longer</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-indigo-200 rounded-3xl active:scale-95"><span className="text-3xl">⚡</span><p className="font-black text-indigo-700 text-[11px] uppercase mt-1">Shorter</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🪐</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-indigo-300 text-sm font-bold mb-1">← Back</button>
            <p className="text-center font-display font-black text-indigo-700 text-base">Solar System Lab 🪐</p>
            <p className="text-center text-[11px] text-indigo-500 font-bold mb-2">Tap each planet · time one orbit</p>

            {/* orbit scene */}
            <div className="rounded-2xl bg-indigo-950 border-2 border-indigo-200 h-28 relative flex items-center justify-center overflow-hidden">
              <span className="text-3xl z-10">☀️</span>
              {PLANETS.map((p, i) => (
                <div key={p.id} className="absolute rounded-full border border-indigo-700/50" style={{ width: 50 + i * 30, height: 50 + i * 30 }}>
                  <motion.span className="absolute -top-2 left-1/2 text-base" animate={orbiting === p.id ? { rotate: 360 } : {}} transition={{ duration: 1, ease: 'linear' }} style={{ originX: '0px', originY: `${25 + i * 15}px` }}>{p.emoji}</motion.span>
                </div>
              ))}
            </div>

            <p className="text-center text-[10px] font-black text-gray-400 uppercase mt-3 mb-1">Days per orbit (one year)</p>
            <div className="flex-1 flex items-end justify-around gap-4 bg-white rounded-2xl border-2 border-indigo-100 p-3 min-h-[120px]">
              {PLANETS.map(p => {
                const done = measured.has(p.id);
                const top = p.id === 'mars';
                return (
                  <div key={p.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    {done && <span className="text-[10px] font-black text-indigo-700 mb-0.5">{p.days}d</span>}
                    <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(p.days / MAX_DAYS) * 100}%` : 0 }} transition={{ type: 'spring', damping: 14 }} className={`w-full rounded-t-xl ${done ? (top ? 'bg-indigo-600' : 'bg-indigo-400') : 'bg-gray-100'}`} style={{ minHeight: done ? 6 : 0 }} />
                    <span className="text-base mt-1">{p.emoji}</span>
                    <span className="text-[8px] font-black text-gray-400 uppercase">{p.name}</span>
                  </div>
                );
              })}
            </div>

            {!all ? (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {PLANETS.map(p => (
                  <button key={p.id} onClick={() => measure(p)} disabled={measured.has(p.id) || !!orbiting} className={`py-3 rounded-2xl border-2 font-black text-[11px] active:scale-95 flex flex-col items-center gap-0.5 ${measured.has(p.id) ? 'bg-indigo-100 border-indigo-200 text-indigo-400' : 'bg-white border-indigo-200 text-indigo-700'}`}>
                    <span className="text-base">{p.emoji}</span>{orbiting === p.id ? '🔄…' : measured.has(p.id) ? '✓' : p.name}
                  </button>
                ))}
              </div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }} className="mt-3 w-full py-4 bg-indigo-500 shadow-[0_5px_0_#4338CA] text-white font-display font-black text-lg rounded-3xl btn-press">Write my conclusion →</motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-indigo-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-indigo-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-indigo-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                A planet{' '}
                <span className={`inline-block min-w-[64px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-indigo-200 text-indigo-300'}`}>{blank1 ?? '______'}</span>{' '}
                from the sun takes{' '}
                <span className={`inline-block min-w-[60px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-indigo-200 text-indigo-300'}`}>{blank2 ?? '____'}</span>{' '}
                to orbit.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">{['farther', 'closer'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-indigo-700 border-indigo-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">{['longer', 'shorter'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-indigo-700 border-indigo-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-indigo-500 shadow-[0_5px_0_#4338CA]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-indigo-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🪐</div>
        <p className="font-display font-black text-indigo-700 text-sm">Astronomer Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-indigo-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌌🔭</p>
        <p className="font-black text-gray-700 text-base leading-snug">At night with a grown-up: look for a planet. Planets shine with a steady light and do not twinkle like the stars.</p>
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
