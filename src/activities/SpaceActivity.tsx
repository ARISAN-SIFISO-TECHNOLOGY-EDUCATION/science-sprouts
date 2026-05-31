// Activity: Planets, Sun & Moon — Day & Night — Age 8 (Band B8)
// Intermediate Phase Gr 3 — model the Earth's spin to explain day & night.
//   Plan (predict) → Spin the Earth & observe → Conclude (fill blanks) → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

const SPINS_FOR_DAY = 4; // four half-turns to "watch a full day go by"

const OBJECTIVE_ID = 'eb.space_b8';
const BADGE = 'Space Explorer 🌍';

const PLAN_VOICE = "Why do we have day and night? Does the Sun move around us, or does the Earth spin? Predict!";
const TEST_VOICE = "Tap to spin the Earth. Watch your city turn towards the Sun for day, and away for night.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Space Explorer Badge! At home: watch the Moon for four nights in a row. Draw its shape each night. Does it change?";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function SpaceActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [spins, setSpins] = useState(0);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const isDay = spins % 2 === 0;          // city faces the Sun on even half-turns
  const enough = spins >= SPINS_FOR_DAY;

  function predict() { setPredicted(true); speak("Let's spin the Earth and watch!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }
  function spin() {
    const next = spins + 1;
    setSpins(next);
    const nowDay = next % 2 === 0;
    speak(nowDay ? "Daytime — your city faces the Sun." : "Night — your city faces away from the Sun.", 1.0, next >= SPINS_FOR_DAY ? () => speak("One full spin takes 24 hours — that is one whole day and night!", 0.9) : undefined);
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'Earth' && blank2 === '24') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! Day and night happen because the Earth spins, not the Sun. One full spin takes 24 hours. You are a Space Explorer!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Remember — you spun the Earth to make day and night. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-indigo-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-indigo-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-indigo-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🌍☀️🌙</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Why do we have day and night?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-indigo-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-indigo-200 rounded-3xl active:scale-95"><span className="text-3xl">🌍</span><p className="font-black text-indigo-700 text-[11px] uppercase mt-1">Earth spins</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-indigo-200 rounded-3xl active:scale-95"><span className="text-3xl">☀️</span><p className="font-black text-indigo-700 text-[11px] uppercase mt-1">Sun moves</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🌍</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-indigo-300 text-sm font-bold">← Back</button>
            <p className={`font-display font-black text-lg ${isDay ? 'text-amber-500' : 'text-indigo-700'}`}>{isDay ? '☀️ Daytime' : '🌙 Night'}</p>

            <div className={`relative w-full max-w-xs h-52 rounded-3xl border-2 flex items-center justify-between px-4 transition-colors ${isDay ? 'bg-sky-100 border-sky-200' : 'bg-indigo-900 border-indigo-700'}`}>
              <span className="text-5xl">☀️</span>
              <motion.div animate={{ rotate: spins * 180 }} transition={{ type: 'spring', damping: 12 }} className="relative text-6xl">
                🌍
                <span className="absolute top-1 right-1 text-base">📍</span>
              </motion.div>
              <span className="text-4xl opacity-70">⭐</span>
            </div>

            <div className="bg-white rounded-2xl border-2 border-indigo-100 px-4 py-2 text-center">
              <span className="text-[10px] font-black text-gray-400 uppercase">Half-spins watched: </span>
              <span className="font-display font-black text-indigo-600">{spins}</span>
            </div>

            {!enough ? (
              <motion.button whileTap={{ scale: 0.94 }} onClick={spin} className="w-full max-w-xs py-4 bg-indigo-500 shadow-[0_5px_0_#4338CA] text-white font-display font-black text-lg rounded-3xl btn-press">🔄 Spin the Earth</motion.button>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-xs flex flex-col gap-3">
                <p className="text-center text-xs font-black text-indigo-600 bg-indigo-100 rounded-2xl py-2 px-3 leading-snug">🕛 One full spin = 24 hours = 1 day &amp; 1 night!</p>
                <button onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }} className="w-full py-4 bg-indigo-500 shadow-[0_5px_0_#4338CA] text-white font-display font-black text-lg rounded-3xl btn-press">Write my conclusion →</button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-indigo-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-indigo-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-indigo-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                Day and night happen because the{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-indigo-200 text-indigo-300'}`}>{blank1 ?? '____'}</span>{' '}
                spins. One full spin takes{' '}
                <span className={`inline-block min-w-[44px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-indigo-200 text-indigo-300'}`}>{blank2 ?? '__'}</span>{' '}
                hours.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — what spins?</p>
              <div className="flex gap-2">{['Earth', 'Sun'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 ${blank1 === w ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-indigo-700 border-indigo-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — how many hours?</p>
              <div className="flex gap-2">{['12', '24', '60'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 ${blank2 === w ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-indigo-700 border-indigo-200'}`}>{w}</button>))}</div>
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
        <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌍</div>
        <p className="font-display font-black text-indigo-700 text-sm">Space Explorer!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-indigo-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌙🌒🌓🌔</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: watch the Moon for 4 nights in a row. Draw its shape each night. Does the Moon change?</p>
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
