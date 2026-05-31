// Activity: Weather Patterns — Age 8 (Band B8)
// Intermediate Phase Gr 3 — record data, spot a pattern, predict the next.
//   Plan (predict trend) → Record 5 days of temperature → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Day { id: string; name: string; temp: number; }
const DAYS: Day[] = [
  { id: 'mon', name: 'Mon', temp: 18 },
  { id: 'tue', name: 'Tue', temp: 20 },
  { id: 'wed', name: 'Wed', temp: 23 },
  { id: 'thu', name: 'Thu', temp: 25 },
  { id: 'fri', name: 'Fri', temp: 27 },
];
const MAX_T = 35;

const OBJECTIVE_ID = 'eb.weather_b8';
const BADGE = 'Weather Forecaster 🌦️';

const PLAN_VOICE = "Scientists record the weather to spot patterns. Will this week get warmer or cooler? Predict!";
const TEST_VOICE = "Tap each day to record the temperature on your weather chart. Look for a pattern.";
const CONCLUDE_VOICE = "Look at the pattern, then finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Weather Forecaster Badge! At home: make a weather chart. Each day for a week, write the temperature and draw the sky.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function WeatherPatternsActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [recorded, setRecorded] = useState<Set<string>>(new Set());
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const all = recorded.size >= DAYS.length;

  function predict() { setPredicted(true); speak("Let's record the temperatures and check!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }
  function record(d: Day) { if (recorded.has(d.id)) return; speak(`${d.name}: ${d.temp} degrees.`, 0.95); setRecorded(prev => new Set([...prev, d.id])); }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'up' && blank2 === 'warmer') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! The temperature is going up each day, so tomorrow will probably be warmer. You spotted the pattern! You are a Weather Forecaster!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Look at the bars — are they getting taller or shorter? Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-cyan-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-cyan-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-cyan-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🌤️🌡️📈</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Will this week get warmer or cooler?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-cyan-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-cyan-200 rounded-3xl active:scale-95"><span className="text-3xl">🔥</span><p className="font-black text-cyan-700 text-[11px] uppercase mt-1">Warmer</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-cyan-200 rounded-3xl active:scale-95"><span className="text-3xl">❄️</span><p className="font-black text-cyan-700 text-[11px] uppercase mt-1">Cooler</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🌦️</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-cyan-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-cyan-700 text-base mb-1">Weather Chart 🌡️</p>
            <p className="text-center text-xs text-cyan-500 font-bold mb-3">Tap each day to record the temperature (°C)</p>

            <div className="flex-1 flex items-end justify-around gap-2 bg-white rounded-2xl border-2 border-cyan-100 p-3 min-h-[160px]">
              {DAYS.map(d => {
                const done = recorded.has(d.id);
                return (
                  <div key={d.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    {done && <span className="text-[10px] font-black text-cyan-700 mb-0.5">{d.temp}°</span>}
                    <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(d.temp / MAX_T) * 100}%` : 0 }} transition={{ type: 'spring', damping: 14 }} className={`w-full rounded-t-xl ${done ? 'bg-cyan-400' : 'bg-gray-100'}`} style={{ minHeight: done ? 6 : 0 }} />
                    <span className="text-[9px] font-black text-gray-400 uppercase mt-1">{d.name}</span>
                  </div>
                );
              })}
            </div>

            {!all ? (
              <div className="grid grid-cols-5 gap-1.5 mt-3">
                {DAYS.map(d => (
                  <button key={d.id} onClick={() => record(d)} disabled={recorded.has(d.id)} className={`py-2 rounded-xl border-2 font-black text-[10px] active:scale-95 ${recorded.has(d.id) ? 'bg-cyan-100 border-cyan-200 text-cyan-400' : 'bg-white border-cyan-200 text-cyan-700'}`}>{recorded.has(d.id) ? '✓' : d.name}</button>
                ))}
              </div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }} className="mt-3 w-full py-4 bg-cyan-500 shadow-[0_5px_0_#0891B2] text-white font-display font-black text-lg rounded-3xl btn-press">Write my conclusion →</motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-cyan-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-cyan-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-cyan-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                The temperature is going{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-cyan-100 border-cyan-400 text-cyan-700' : 'border-cyan-200 text-cyan-300'}`}>{blank1 ?? '____'}</span>.
                Tomorrow will probably be{' '}
                <span className={`inline-block min-w-[64px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-cyan-100 border-cyan-400 text-cyan-700' : 'border-cyan-200 text-cyan-300'}`}>{blank2 ?? '______'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">{['up', 'down'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-white text-cyan-700 border-cyan-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">{['warmer', 'cooler'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-white text-cyan-700 border-cyan-200'}`}>{w}</button>))}</div>
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
        <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌦️</div>
        <p className="font-display font-black text-cyan-700 text-sm">Weather Forecaster!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-cyan-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">📅☀️🌧️</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: make a weather chart. Each day for a week, write the temperature and draw the sky. Can you spot a pattern?</p>
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
