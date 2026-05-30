// Activity: Soil Types — Age 7 (Band B7)
// Foundation Phase Gr 2 — a fair test: which soil holds the most water?
// Pattern: Predict → Fair Test (fills bar chart) → Explain → Badge + Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'predict' | 'test' | 'explain' | 'card';

interface Soil { id: string; emoji: string; name: string; held: number; }

// Same 100ml water poured on each (fair test). "held" = ml kept in the soil.
const SOILS: Soil[] = [
  { id: 'sandy', emoji: '🏖️', name: 'Sandy', held: 15 },
  { id: 'loam',  emoji: '🟤', name: 'Loam',  held: 45 },
  { id: 'clay',  emoji: '🧱', name: 'Clay',  held: 70 },
];

const MAX_ML = 100;
const OBJECTIVE_ID = 'eb.soil';
const BADGE = 'Soil Scientist Badge 🪴';

const PREDICT_VOICE = "Which soil will hold the most water — sandy, loam, or clay?";
const TEST_VOICE    = "Fair test: same water on each soil! Tap a soil to pour and measure.";
const EXPLAIN_VOICE = "Clay has tiny packed bits, so it holds water. Sandy soil has big gaps, so water drains away!";
const CARD_VOICE    = "You earned the Soil Scientist Badge! Collect 3 soils from outside. Drop the same water on each. Which holds water best?";

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

export default function SoilTypesActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('predict');
  const [predicted, setPredicted] = useState(false);
  const [tested, setTested] = useState<Set<string>>(new Set());
  const [pouring, setPouring] = useState<string | null>(null);

  useEffect(() => { speak(PREDICT_VOICE); return () => stopAudio(); }, []);

  function predict() {
    setPredicted(true);
    speak("Let's pour the same water on each — a fair test!", 0.85, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); });
  }

  function testSoil(s: Soil) {
    if (tested.has(s.id) || pouring) return;
    setPouring(s.id);
    const isLast = tested.size + 1 >= SOILS.length;
    speak(`${s.name} soil held ${s.held} millilitres of water.`, 0.9, undefined);
    setTimeout(() => {
      setTested(prev => new Set([...prev, s.id]));
      setPouring(null);
      if (isLast) setTimeout(() => { setPhase('explain'); speak(EXPLAIN_VOICE); }, 800);
    }, 1400);
  }

  const winner = SOILS.reduce((a, b) => (b.held > a.held ? b : a));
  const allTested = tested.size >= SOILS.length;

  return (
    <div className="fixed inset-0 bg-amber-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'predict' && (
          <motion.div key="predict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🪴💧</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Which soil holds the most water?</p>
              <button onClick={() => speak(PREDICT_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-amber-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-xs">
                {SOILS.map(s => (
                  <motion.button key={s.id} whileTap={{ scale: 0.92 }} onClick={predict}
                    className="flex-1 flex flex-col items-center gap-1 p-3 bg-white border-2 border-amber-200 rounded-3xl active:scale-95">
                    <span className="text-4xl">{s.emoji}</span>
                    <span className="font-black text-amber-700 text-[10px] uppercase">{s.name}</span>
                  </motion.button>
                ))}
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🪴</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-2">← Back</button>
            <div className="bg-amber-100 border-2 border-amber-200 rounded-2xl p-2 mb-3">
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-wide text-center">⚖️ Fair test: SAME water on each soil</p>
            </div>

            {/* Bar chart */}
            <div className="flex-1 bg-white rounded-2xl border-2 border-amber-100 p-3 flex flex-col">
              <p className="text-[10px] font-black text-gray-400 uppercase text-center mb-1">Water held (ml)</p>
              <div className="flex-1 flex items-end justify-around gap-3 pb-1">
                {SOILS.map(s => {
                  const done = tested.has(s.id);
                  const isWinner = allTested && s.id === winner.id;
                  return (
                    <div key={s.id} className="flex-1 flex flex-col items-center justify-end h-full">
                      {done && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-black text-amber-700 mb-0.5">{s.held}</motion.span>}
                      <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(s.held / MAX_ML) * 100}%` : '0%' }}
                        transition={{ type: 'spring', damping: 14 }}
                        className={`w-full rounded-t-xl ${isWinner ? 'bg-amber-600' : done ? 'bg-amber-400' : 'bg-gray-100'}`} style={{ minHeight: done ? 6 : 0 }} />
                      <span className="text-2xl mt-1">{s.emoji}</span>
                      <span className="text-[8px] font-black text-gray-400 uppercase">{s.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {!allTested ? (
              <>
                <p className="text-center text-xs text-amber-500 font-bold my-2">Tap a soil to pour water 💧</p>
                <div className="grid grid-cols-3 gap-2">
                  {SOILS.map(s => {
                    const done = tested.has(s.id);
                    return (
                      <motion.button key={s.id} whileTap={{ scale: 0.9 }} onClick={() => testSoil(s)} disabled={done || !!pouring}
                        className={`py-2 rounded-2xl flex flex-col items-center gap-0.5 active:scale-95 transition-all border-2
                          ${done ? 'bg-amber-100 border-amber-300 opacity-60' : pouring === s.id ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <span className="text-2xl">{s.emoji}</span>
                        <span className="text-[9px] font-black uppercase text-gray-500">{pouring === s.id ? '💧…' : done ? '✓' : s.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('explain'); speak(EXPLAIN_VOICE); }}
                className="mt-3 w-full py-4 bg-amber-500 shadow-[0_5px_0_#D97706] text-white font-display font-black text-lg rounded-3xl btn-press">
                {winner.name} held most! Why? →
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === 'explain' && (
          <motion.div key="explain" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-100 shadow-md text-center max-w-xs">
              <p className="text-5xl mb-3">🧱💧🏖️</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug mb-2">Clay has tiny packed bits, so it holds water.</p>
              <p className="text-sm text-gray-500 leading-snug">Sandy soil has big gaps — water drains straight through!</p>
              <button onClick={() => speak(EXPLAIN_VOICE)} className="mt-3 flex items-center gap-1 mx-auto text-amber-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            <button onClick={() => { awardBadge(OBJECTIVE_ID, BADGE); setPhase('card'); }}
              className="w-full max-w-xs py-4 bg-amber-500 shadow-[0_6px_0_#D97706] text-white font-display font-black text-xl rounded-3xl btn-press">
              Next →
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
      <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🪴</div>
        <p className="font-display font-black text-amber-700 text-sm">Soil Scientist Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🏖️🟤🧱</p>
        <p className="font-black text-gray-700 text-base leading-snug">Collect 3 kinds of soil from outside. Drop the SAME water on each. Which one holds water best?</p>
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
