// Activity: Solids, Liquids & Gases — Age 7 (Band B7)
// Foundation Phase Gr 2 — heat changes water between states.
// Pattern: Predict → Heat sim (ice→water→steam) → Why? → Badge + Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'predict' | 'heat' | 'why' | 'card';

const STATES = [
  { id: 'ice',   emoji: '🧊', label: 'ICE (solid)',   temp: 0,   voice: 'This is ICE. It is frozen solid and very cold!' },
  { id: 'water', emoji: '💧', label: 'WATER (liquid)', temp: 50,  voice: 'The ice melted into WATER! Heat made it a liquid.' },
  { id: 'steam', emoji: '♨️', label: 'STEAM (gas)',    temp: 100, voice: 'The water boiled into STEAM! Lots of heat turned it into a gas.' },
];

const OBJECTIVE_ID = 'mm.states_change';
const BADGE = 'State Changer Badge 🌡️';

const PREDICT_VOICE = "What happens to ice when it gets warm?";
const HEAT_VOICE    = "Tap to add heat. Watch the ice melt, then boil!";
const WHY_VOICE     = "What changed the ice into water?";
const CARD_VOICE    = "You earned the State Changer Badge! Put an ice cube in a cup. Watch it melt into water. How long did it take?";

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

export default function StatesChangeActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('predict');
  const [predicted, setPredicted] = useState(false);
  const [stage, setStage] = useState(0);
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(PREDICT_VOICE); return () => stopAudio(); }, []);

  function predict() {
    setPredicted(true);
    speak("Let's add heat and find out!", 0.85, () => { setPhase('heat'); setTimeout(() => speak(HEAT_VOICE), 300); });
  }

  function addHeat() {
    if (stage >= STATES.length - 1) return;
    const next = stage + 1;
    setStage(next);
    const isLast = next >= STATES.length - 1;
    speak(STATES[next].voice, 0.9, isLast ? () => setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 900) : undefined);
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! HEAT changed the ice into water, then into steam. You are a state changer!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  const cur = STATES[stage];

  return (
    <div className="fixed inset-0 bg-cyan-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'predict' && (
          <motion.div key="predict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-cyan-400 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-cyan-100 shadow-md text-center w-full max-w-xs">
              <p className="text-6xl mb-3">🧊🔥</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">What happens to ice when it gets warm?</p>
              <button onClick={() => speak(PREDICT_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-cyan-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 flex flex-col items-center gap-2 p-4 bg-cyan-50 border-2 border-cyan-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">💧</span><span className="font-black text-cyan-700 text-xs uppercase">It melts</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🧊</span><span className="font-black text-gray-500 text-xs uppercase">Stays ice</span>
                </motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">💧</motion.div>}
          </motion.div>
        )}

        {phase === 'heat' && (
          <motion.div key="heat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-cyan-400 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-cyan-600 text-sm uppercase tracking-widest mb-3">Add heat!</p>

            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <motion.div key={cur.id} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-8xl">{cur.emoji}</motion.div>
              <p className="font-display font-black text-2xl text-cyan-700">{cur.label}</p>

              {/* Thermometer */}
              <div className="flex items-center gap-2 w-full max-w-xs">
                <span className="text-xl">🌡️</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${cur.temp}%` }} className="h-full rounded-full"
                    style={{ background: 'linear-gradient(to right, #38BDF8, #F87171)' }} />
                </div>
                <span className="text-sm font-black text-gray-600 w-12 text-right">{cur.temp}°C</span>
              </div>
            </div>

            {stage < STATES.length - 1 ? (
              <button onClick={addHeat}
                className="mt-3 w-full py-4 bg-orange-400 shadow-[0_5px_0_#EA580C] text-white font-display font-black text-lg rounded-3xl active:scale-95 transition-transform">
                🔥 Add heat
              </button>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('why'); speak(WHY_VOICE); }}
                className="mt-3 w-full py-4 bg-cyan-500 shadow-[0_5px_0_#0891B2] text-white font-display font-black text-lg rounded-3xl btn-press">
                It became steam! Why? →
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-cyan-400 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-cyan-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🧊➡️💧</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">What changed the ice into water?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-cyan-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-orange-50 border-2 border-orange-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🔥</span><span className="font-black text-orange-700 text-xs uppercase">Heat</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">❄️</span><span className="font-black text-blue-700 text-xs uppercase">Cold</span>
                </motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🔥💧</motion.div>}
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
      <button onClick={onExit} className="self-start text-cyan-400 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌡️</div>
        <p className="font-display font-black text-cyan-700 text-sm">State Changer Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-cyan-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🧊🥤⏱️</p>
        <p className="font-black text-gray-700 text-base leading-snug">Put an ice cube in a cup. Watch it melt into water. Time it! How long did the ice take to melt?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#CFFAFE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#06B6D4" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-cyan-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-cyan-500 shadow-[0_6px_0_#0891B2] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
