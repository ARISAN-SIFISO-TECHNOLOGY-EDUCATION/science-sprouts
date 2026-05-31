// Activity: Rocks & Soil Formation — Weathering — Age 9 (Band B · CAPS Gr 4)
// Water and wind break rocks into soil over a long time.
//   Plan (predict) → Weather 3 rock types, measure years to break → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Rock { id: string; emoji: string; name: string; years: number; }
const ROCKS: Rock[] = [
  { id: 'sandstone', emoji: '🟫', name: 'Sandstone', years: 100 },
  { id: 'limestone', emoji: '🪨', name: 'Limestone', years: 500 },
  { id: 'granite',   emoji: '⬜', name: 'Granite',   years: 2000 },
];
const MAX_Y = 2000;

const OBJECTIVE_ID = 'eb.weathering';
const BADGE = 'Earth Shaper Badge ⛰️';

const PLAN_VOICE = "Over a very long time, water and wind can break even hard rocks. Which rock do you think breaks down fastest — soft sandstone or hard granite? Predict!";
const TEST_VOICE = "Tap each rock to weather it with water and wind. Measure how many years it takes to break into soil.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Earth Shaper Badge! Outside: look for cracked rocks, or sand. Sand is just tiny pieces of rock that weathering broke down over a long time.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function WeatheringActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [tested, setTested] = useState<Set<string>>(new Set());
  const [weathering, setWeathering] = useState<string | null>(null);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const all = tested.size >= ROCKS.length;

  function predict() { setPredicted(true); speak("Let's weather each rock and measure the time!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }
  function test(rk: Rock) {
    if (tested.has(rk.id) || weathering) return;
    setWeathering(rk.id);
    speak(`${rk.name}: about ${rk.years} years to break into soil.`, 0.92);
    setTimeout(() => { setTested(prev => new Set([...prev, rk.id])); setWeathering(null); }, 1100);
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'break' && blank2 === 'soil') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! Over a long time, water and wind break rocks into tiny pieces that become soil. Soft rocks break fastest. You are an Earth Shaper!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Weathering breaks rocks down into the tiny pieces that make soil. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-amber-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🪨💨💧</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Which rock breaks down into soil fastest?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-amber-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-amber-200 rounded-3xl active:scale-95"><span className="text-3xl">🟫</span><p className="font-black text-amber-700 text-[11px] uppercase mt-1">Soft sandstone</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-amber-200 rounded-3xl active:scale-95"><span className="text-3xl">⬜</span><p className="font-black text-amber-700 text-[11px] uppercase mt-1">Hard granite</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">⛰️</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-amber-700 text-base mb-1">Weathering Lab ⛰️</p>
            <p className="text-center text-xs text-amber-500 font-bold mb-3">Tap each rock · measure years to break</p>

            <p className="text-center text-[10px] font-black text-gray-400 uppercase mb-1">Years to break into soil</p>
            <div className="flex-1 flex items-end justify-around gap-4 bg-white rounded-2xl border-2 border-amber-100 p-3 min-h-[150px]">
              {ROCKS.map(rk => {
                const done = tested.has(rk.id);
                const slow = rk.id === 'granite';
                return (
                  <div key={rk.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    {done && <span className="text-[10px] font-black text-amber-700 mb-0.5">{rk.years}y</span>}
                    <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(rk.years / MAX_Y) * 100}%` : 0 }} transition={{ type: 'spring', damping: 14 }} className={`w-full rounded-t-xl ${done ? (slow ? 'bg-amber-700' : 'bg-amber-400') : 'bg-gray-100'}`} style={{ minHeight: done ? 6 : 0 }} />
                    <span className="text-xl mt-1">{rk.emoji}</span>
                    <span className="text-[8px] font-black text-gray-400 uppercase">{rk.name}</span>
                  </div>
                );
              })}
            </div>

            {!all ? (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {ROCKS.map(rk => (
                  <button key={rk.id} onClick={() => test(rk)} disabled={tested.has(rk.id) || !!weathering} className={`py-3 rounded-2xl border-2 font-black text-[10px] active:scale-95 flex flex-col items-center gap-0.5 ${tested.has(rk.id) ? 'bg-amber-100 border-amber-200 text-amber-400' : 'bg-white border-amber-200 text-amber-700'}`}>
                    <span className="text-base">{rk.emoji}</span>{weathering === rk.id ? '💨…' : tested.has(rk.id) ? '✓' : rk.name}
                  </button>
                ))}
              </div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }} className="mt-3 w-full py-4 bg-amber-500 shadow-[0_5px_0_#D97706] text-white font-display font-black text-lg rounded-3xl btn-press">Write my conclusion →</motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-amber-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                Over a long time, water and wind{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-amber-200 text-amber-300'}`}>{blank1 ?? '____'}</span>{' '}
                rocks into tiny pieces that become{' '}
                <span className={`inline-block min-w-[48px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-amber-200 text-amber-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">{['break', 'build'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-700 border-amber-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">{['soil', 'metal'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-700 border-amber-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-amber-500 shadow-[0_5px_0_#D97706]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
        <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">⛰️</div>
        <p className="font-display font-black text-amber-700 text-sm">Earth Shaper Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🪨→🏜️</p>
        <p className="font-black text-gray-700 text-base leading-snug">Outside: look for cracked rocks or sand. Sand is just tiny pieces of rock that water and wind broke down over a very long time!</p>
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
