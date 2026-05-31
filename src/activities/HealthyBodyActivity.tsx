// Activity: Healthy Bodies — Age 8 (Band B8)
// Intermediate Phase Gr 3 — collect data, graph it, conclude.
//   Plan (predict healthiest day) → Log 3 days of water → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Day { id: string; name: string; glasses: number; }
const DAYS: Day[] = [
  { id: 'mon', name: 'Mon', glasses: 4 },
  { id: 'tue', name: 'Tue', glasses: 6 },
  { id: 'wed', name: 'Wed', glasses: 8 },
];
const MAX = 10;
const TOTAL = DAYS.reduce((s, d) => s + d.glasses, 0);

const OBJECTIVE_ID = 'll.healthy_body';
const BADGE = 'Health Tracker 💪';

const PLAN_VOICE = "We will track how many glasses of water you drink for three days. On which day do you think you drank the most?";
const TEST_VOICE = "Tap each day to log the glasses of water on your health graph.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Health Tracker Badge! At home: keep a real health diary for one week. Count your glasses of water each day.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function HealthyBodyActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [logged, setLogged] = useState<Set<string>>(new Set());
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const all = logged.size >= DAYS.length;
  const sum = DAYS.filter(d => logged.has(d.id)).reduce((s, d) => s + d.glasses, 0);

  function predict() { setPredicted(true); speak("Let's collect the data and see!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function log(d: Day) {
    if (logged.has(d.id)) return;
    speak(`${d.name}: ${d.glasses} glasses.`, 0.95);
    setLogged(prev => new Set([...prev, d.id]));
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'Wed' && blank2 === 'healthy') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak(`Correct! You drank the most on Wednesday, ${TOTAL} glasses in total. Water keeps your body healthy. You are a Health Tracker!`, 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else {
      setResult('wrong'); speak("Look at your graph — which bar is tallest? Try again.", 0.9); setTimeout(() => setResult('idle'), 1600);
    }
  }

  return (
    <div className="fixed inset-0 bg-rose-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-rose-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-rose-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">💧🥤💪</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Which day did you drink the most water?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-rose-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                {DAYS.map(d => (
                  <motion.button key={d.id} whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-rose-200 rounded-3xl active:scale-95">
                    <span className="font-black text-rose-700 text-sm uppercase">{d.name}</span>
                  </motion.button>
                ))}
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">💪</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-rose-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-rose-700 text-base mb-1">My Water Diary 💧</p>
            <p className="text-center text-xs text-rose-500 font-bold mb-3">Tap each day to log it</p>

            <p className="text-center text-[10px] font-black text-gray-400 uppercase mb-1">Glasses of water</p>
            <div className="flex-1 flex items-end justify-around gap-4 bg-white rounded-2xl border-2 border-rose-100 p-3 min-h-[150px]">
              {DAYS.map(d => {
                const done = logged.has(d.id);
                const best = d.id === 'wed';
                return (
                  <div key={d.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    {done && <span className="text-[11px] font-black text-rose-700 mb-0.5">{d.glasses}</span>}
                    <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(d.glasses / MAX) * 100}%` : 0 }} transition={{ type: 'spring', damping: 14 }}
                      className={`w-full rounded-t-xl ${done ? (best ? 'bg-rose-600' : 'bg-rose-300') : 'bg-gray-100'}`} style={{ minHeight: done ? 6 : 0 }} />
                    <span className="text-[10px] font-black text-gray-400 uppercase mt-1">{d.name}</span>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl border-2 border-rose-100 p-2 text-center my-3">
              <span className="text-[10px] font-black text-gray-400 uppercase">Total this week: </span>
              <span className="font-display font-black text-rose-600">{sum} glasses</span>
            </div>

            {!all ? (
              <div className="grid grid-cols-3 gap-2">
                {DAYS.map(d => (
                  <button key={d.id} onClick={() => log(d)} disabled={logged.has(d.id)}
                    className={`py-3 rounded-2xl border-2 font-black text-sm active:scale-95 ${logged.has(d.id) ? 'bg-rose-100 border-rose-200 text-rose-400' : 'bg-white border-rose-200 text-rose-700'}`}>
                    {logged.has(d.id) ? '✓' : `Log ${d.name}`}
                  </button>
                ))}
              </div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }}
                className="w-full py-4 bg-rose-500 shadow-[0_5px_0_#E11D48] text-white font-display font-black text-lg rounded-3xl btn-press">
                Write my conclusion →
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-rose-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-rose-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-rose-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                I drank the most water on{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-rose-100 border-rose-400 text-rose-700' : 'border-rose-200 text-rose-300'}`}>{blank1 ?? '____'}</span>.
                Water keeps my body{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-rose-100 border-rose-400 text-rose-700' : 'border-rose-200 text-rose-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — which day?</p>
              <div className="flex gap-2">{['Mon', 'Tue', 'Wed'].map(w => (
                <button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 ${blank1 === w ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-rose-700 border-rose-200'}`}>{w}</button>
              ))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — why?</p>
              <div className="flex gap-2">{['healthy', 'tired'].map(w => (
                <button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-rose-700 border-rose-200'}`}>{w}</button>
              ))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-rose-500 shadow-[0_5px_0_#E11D48]' : 'bg-gray-300'}`}>
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
      <button onClick={onExit} className="self-start text-rose-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">💪</div>
        <p className="font-display font-black text-rose-700 text-sm">Health Tracker!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-rose-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">📒💧🥗</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: keep a health diary for one week. Count your glasses of water, hours of sleep, and times you played outside!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FFE4E6" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E11D48" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-rose-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-rose-600 shadow-[0_6px_0_#BE123C] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
