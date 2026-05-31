// Activity: The Water Cycle — Age 9 (Band B · CAPS Gr 4)
// Heat slider drives evaporation → condensation → precipitation.
//   Plan (predict) → Heat slider + measure time-to-rain → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Level { id: string; name: string; heat: number; mins: number; }
const LEVELS: Level[] = [
  { id: 'low',  name: 'Low',  heat: 20,  mins: 50 },
  { id: 'med',  name: 'Med',  heat: 60,  mins: 30 },
  { id: 'high', name: 'High', heat: 100, mins: 15 },
];
const MAX_MIN = 50;

const OBJECTIVE_ID = 'mm.water_cycle';
const BADGE = 'Water Cycle Badge 💧';

const PLAN_VOICE = "The sun heats the sea. Where does the water go to make rain — up into the sky, or down into the ground? Predict!";
const TEST_VOICE = "Slide the sun's heat. Watch water evaporate, form a cloud, then rain. Tap Low, Medium and High to time how long it takes to rain.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Water Cycle Badge! At home: put one glass of water in the sun and one in the shade. After a day, which lost more water? That water evaporated into the air.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function WaterCycleActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [heat, setHeat] = useState(40);
  const [measured, setMeasured] = useState<Set<string>>(new Set());
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const all = measured.size >= LEVELS.length;
  // stage by heat: 0-30 evaporate, 30-70 condense (cloud), 70+ rain
  const stage = heat < 30 ? 'evaporation' : heat < 70 ? 'condensation' : 'precipitation';
  const stageLabel = stage === 'evaporation' ? '💨 Evaporation' : stage === 'condensation' ? '☁️ Condensation' : '🌧️ Precipitation';

  function predict() { setPredicted(true); speak("Let's heat the water and watch the cycle!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }
  function measure(l: Level) {
    if (measured.has(l.id)) return;
    setHeat(l.heat);
    speak(`${l.name} heat: it took ${l.mins} minutes to rain.`, 0.95);
    setMeasured(prev => new Set([...prev, l.id]));
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'evaporate' && blank2 === 'rain') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! The sun makes water evaporate into the air. It cools to form clouds, then falls as rain. That is the water cycle! You earned the Water Cycle Badge!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Remember the stages you watched: evaporation, condensation, then rain. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-sky-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-sky-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">☀️🌊→☁️🌧️</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">The sun heats the sea. Where does the water go to make rain?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-sky-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-sky-200 rounded-3xl active:scale-95"><span className="text-3xl">⬆️</span><p className="font-black text-sky-700 text-[11px] uppercase mt-1">Up to the sky</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-sky-200 rounded-3xl active:scale-95"><span className="text-3xl">⬇️</span><p className="font-black text-sky-700 text-[11px] uppercase mt-1">Into the ground</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">💧</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold mb-1">← Back</button>
            <p className="text-center font-display font-black text-sky-700 text-base">Water Cycle Lab ☀️</p>
            <p className="text-center text-[11px] text-sky-500 font-black mb-2">{stageLabel}</p>

            {/* scene */}
            <div className="rounded-2xl border-2 border-sky-100 bg-gradient-to-b from-sky-200 to-sky-400 h-40 relative overflow-hidden">
              <span className="absolute top-2 left-3 text-3xl" style={{ opacity: 0.3 + heat / 140 }}>☀️</span>
              {/* cloud grows with condensation+ */}
              <motion.div className="absolute top-3 right-4 text-4xl" animate={{ scale: heat >= 30 ? 0.6 + heat / 100 : 0.3, opacity: heat >= 30 ? 1 : 0.3 }}>☁️</motion.div>
              {/* vapor rising */}
              {heat >= 15 && Array.from({ length: 3 }).map((_, i) => (
                <motion.span key={i} className="absolute bottom-10 text-lg" style={{ left: `${30 + i * 18}%` }} animate={{ y: [-2, -28, -2], opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}>💨</motion.span>
              ))}
              {/* rain */}
              {stage === 'precipitation' && Array.from({ length: 5 }).map((_, i) => (
                <motion.span key={i} className="absolute top-12 text-sm" style={{ left: `${50 + i * 8}%` }} animate={{ y: [0, 60], opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}>💧</motion.span>
              ))}
              {/* sea */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-blue-600/70" />
              <span className="absolute bottom-1 left-3 text-xl">🌊</span>
            </div>

            {/* heat slider */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase"><span>❄️ Cool</span><span>Heat: {heat}%</span><span>🔥 Hot</span></div>
              <input type="range" min={0} max={100} value={heat} onChange={e => setHeat(Number(e.target.value))} className="w-full accent-sky-500" />
            </div>

            {/* bars: minutes to rain */}
            <p className="text-center text-[10px] font-black text-gray-400 uppercase mt-2 mb-1">Minutes until it rained</p>
            <div className="flex-1 flex items-end justify-around gap-4 bg-white rounded-2xl border-2 border-sky-100 p-3 min-h-[100px]">
              {LEVELS.map(l => {
                const done = measured.has(l.id);
                const fastest = l.id === 'high';
                return (
                  <div key={l.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    {done && <span className="text-[11px] font-black text-sky-700 mb-0.5">{l.mins}m</span>}
                    <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(l.mins / MAX_MIN) * 100}%` : 0 }} transition={{ type: 'spring', damping: 14 }} className={`w-full rounded-t-xl ${done ? (fastest ? 'bg-sky-600' : 'bg-sky-400') : 'bg-gray-100'}`} style={{ minHeight: done ? 6 : 0 }} />
                    <span className="text-[9px] font-black text-gray-400 uppercase mt-1">{l.name} heat</span>
                  </div>
                );
              })}
            </div>

            {!all ? (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {LEVELS.map(l => (
                  <button key={l.id} onClick={() => measure(l)} disabled={measured.has(l.id)} className={`py-3 rounded-2xl border-2 font-black text-xs active:scale-95 ${measured.has(l.id) ? 'bg-sky-100 border-sky-200 text-sky-400' : 'bg-white border-sky-200 text-sky-700'}`}>{measured.has(l.id) ? '✓' : `${l.name} heat`}</button>
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
                The sun makes water{' '}
                <span className={`inline-block min-w-[80px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-sky-100 border-sky-400 text-sky-700' : 'border-sky-200 text-sky-300'}`}>{blank1 ?? '______'}</span>{' '}
                into the air. It cools into clouds, then falls as{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-sky-100 border-sky-400 text-sky-700' : 'border-sky-200 text-sky-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">{['evaporate', 'freeze'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-sky-700 border-sky-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">{['rain', 'wind'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-sky-700 border-sky-200'}`}>{w}</button>))}</div>
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
        <div className="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">💧</div>
        <p className="font-display font-black text-sky-700 text-sm">Water Cycle Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-sky-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🥛☀️ vs 🥛🌳</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: put one glass of water in the sun and one in the shade. After a day, which lost more water? Where did it go?</p>
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
