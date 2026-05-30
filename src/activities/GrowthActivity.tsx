// Activity: Growth — People & Plants — Age 7 (Band B7)
// Foundation Phase Gr 2 — measure how a plant changes over time; plot a graph.
// Pattern: Predict → Measure & Plot (bar graph) → Explain → Badge + Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'predict' | 'measure' | 'explain' | 'card';

interface Day { label: string; emoji: string; cm: number; }

const DAYS: Day[] = [
  { label: 'Day 1', emoji: '🌱', cm: 3  },
  { label: 'Day 4', emoji: '🌿', cm: 9  },
  { label: 'Day 7', emoji: '🌻', cm: 16 },
];

const MAX_CM = 18;
const OBJECTIVE_ID = 'll.growth';
const BADGE = 'Growth Tracker Badge 📈';

const PREDICT_VOICE = "What helps a plant grow tall — sun and water, or nothing at all?";
const MEASURE_VOICE = "Measure the plant each day. Tap to measure, then water it and wait. Watch your graph grow!";
const EXPLAIN_VOICE = "Plants grow taller over time when they get sun and water. People grow taller too — but much slower!";
const CARD_VOICE    = "You earned the Growth Tracker Badge! Measure how tall you are. Ask a grown-up to measure you again next month. Did you grow?";

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

export default function GrowthActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]   = useState<Phase>('predict');
  const [predicted, setPredicted] = useState(false);
  const [measured, setMeasured]   = useState(0);   // how many days plotted

  useEffect(() => { speak(PREDICT_VOICE); return () => stopAudio(); }, []);

  function predict() {
    setPredicted(true);
    speak("Yes! Sun and water help plants grow. Let's measure and see!", 0.85, () => { setPhase('measure'); setTimeout(() => speak(MEASURE_VOICE), 300); });
  }

  function measure() {
    const day = DAYS[measured];
    const next = measured + 1;
    setMeasured(next);
    const isLast = next >= DAYS.length;
    speak(`${day.label}: the plant is ${day.cm} centimetres tall!`, 0.9, isLast ? () => setTimeout(() => { setPhase('explain'); speak(EXPLAIN_VOICE); }, 900) : undefined);
  }

  // Current plant shown = the latest measured stage (or first)
  const shownDay = DAYS[Math.min(measured, DAYS.length - 1)];
  const done = measured >= DAYS.length;

  return (
    <div className="fixed inset-0 bg-lime-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── PREDICT ───────────────────────────────────────────────────── */}
        {phase === 'predict' && (
          <motion.div key="predict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-lime-400 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-lime-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🌱📏</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">What helps a plant grow tall?</p>
              <button onClick={() => speak(PREDICT_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-lime-500 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            {!predicted ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-lime-50 border-2 border-lime-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">☀️💧</span><span className="font-black text-lime-700 text-xs uppercase">Sun &amp; water</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">🚫</span><span className="font-black text-gray-500 text-xs uppercase">Nothing</span>
                </motion.button>
              </div>
            ) : (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🌻</motion.div>
            )}
          </motion.div>
        )}

        {/* ── MEASURE & PLOT ────────────────────────────────────────────── */}
        {phase === 'measure' && (
          <motion.div key="measure" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-lime-400 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-lime-600 text-sm uppercase tracking-widest mb-3">Measure the plant!</p>

            <div className="flex-1 flex gap-3">
              {/* Plant + ruler */}
              <div className="flex flex-col items-center justify-end bg-white rounded-2xl border-2 border-lime-100 p-3 w-28">
                <motion.span key={shownDay.label} initial={{ scale: 0.7 }} animate={{ scale: 1 }}
                  style={{ fontSize: `${2 + (shownDay.cm / MAX_CM) * 2.5}rem` }}>{shownDay.emoji}</motion.span>
                <div className="w-full h-1 bg-amber-300 rounded my-1" />
                <span className="text-[10px] font-black text-lime-700">{done ? 'Day 7' : shownDay.label}</span>
                <span className="text-[9px] font-bold text-gray-400">{shownDay.cm} cm</span>
              </div>

              {/* Bar graph */}
              <div className="flex-1 bg-white rounded-2xl border-2 border-lime-100 p-3 flex flex-col">
                <p className="text-[10px] font-black text-gray-400 uppercase text-center mb-1">Height (cm)</p>
                <div className="flex-1 flex items-end justify-around gap-2 pb-1">
                  {DAYS.map((d, i) => {
                    const plotted = i < measured;
                    return (
                      <div key={d.label} className="flex-1 flex flex-col items-center justify-end h-full">
                        {plotted && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-black text-lime-700 mb-0.5">{d.cm}</motion.span>}
                        <motion.div initial={{ height: 0 }} animate={{ height: plotted ? `${(d.cm / MAX_CM) * 100}%` : '0%' }}
                          transition={{ type: 'spring', damping: 14 }} className="w-full rounded-t-lg bg-lime-400" style={{ minHeight: plotted ? 6 : 0 }} />
                        <span className="text-[8px] font-black text-gray-400 uppercase mt-1">{d.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {!done ? (
              <button onClick={measure}
                className="mt-3 w-full py-4 bg-lime-500 shadow-[0_5px_0_#65A30D] text-white font-display font-black text-lg rounded-3xl active:scale-95 transition-transform">
                💧 Measure {DAYS[measured].label} &amp; grow
              </button>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('explain'); speak(EXPLAIN_VOICE); }}
                className="mt-3 w-full py-4 bg-lime-500 shadow-[0_5px_0_#65A30D] text-white font-display font-black text-lg rounded-3xl btn-press">
                My graph is done! →
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ── EXPLAIN ───────────────────────────────────────────────────── */}
        {phase === 'explain' && (
          <motion.div key="explain" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 gap-5">
            <button onClick={onExit} className="self-start text-lime-400 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-6 border-2 border-lime-100 shadow-md text-center max-w-xs">
              <p className="text-5xl mb-3">📈🌻</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug mb-2">Plants grow taller over time with sun and water.</p>
              <p className="text-sm text-gray-500 leading-snug">People grow taller too — but much more slowly!</p>
              <button onClick={() => speak(EXPLAIN_VOICE)} className="mt-3 flex items-center gap-1 mx-auto text-lime-500 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            <button onClick={() => { awardBadge(OBJECTIVE_ID, BADGE); setPhase('card'); }}
              className="w-full max-w-xs py-4 bg-lime-500 shadow-[0_6px_0_#65A30D] text-white font-display font-black text-xl rounded-3xl btn-press">
              Next →
            </button>
          </motion.div>
        )}

        {/* ── CARD ──────────────────────────────────────────────────────── */}
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
      <button onClick={onExit} className="self-start text-lime-400 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-lime-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">📈</div>
        <p className="font-display font-black text-lime-700 text-sm">Growth Tracker Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-lime-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">📏🧒</p>
        <p className="font-black text-gray-700 text-base leading-snug">Measure how tall you are today. Ask a grown-up to mark it on a wall. Measure again next month — did you grow?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ECFCCB" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#84CC16" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-lime-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-lime-500 shadow-[0_6px_0_#65A30D] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
