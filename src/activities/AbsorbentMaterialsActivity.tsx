// Activity: Absorbent Materials — Age 7 (Band B7)
// Foundation Phase Gr 2 — the FIRST FAIR TEST + BAR CHART.
// Pattern: Predict → Fair Test (fills bar chart) → Explain → Badge + Card
//
// New Age-7 mechanics: explicit "fair test" rules (same size, same water,
// same time) and a real BAR CHART the child fills by testing each cloth.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'predict' | 'test' | 'explain' | 'card';

interface Cloth { id: string; emoji: string; name: string; ml: number; }

// All same size, same 100ml water, same 10s — only the MATERIAL changes (fair test)
const CLOTHS: Cloth[] = [
  { id: 'paper',   emoji: '🧻', name: 'Paper',   ml: 80 },
  { id: 'cotton',  emoji: '👕', name: 'Cotton',  ml: 60 },
  { id: 'wool',    emoji: '🧶', name: 'Wool',    ml: 70 },
  { id: 'plastic', emoji: '🧴', name: 'Plastic', ml: 5  },
];

const MAX_ML = 100;
const OBJECTIVE_ID = 'mm.absorbent';
const BADGE = 'Data Recorder Badge 📊';

const PREDICT_VOICE = "Which cloth will hold the most water? Make your guess!";
const TEST_VOICE    = "This is a FAIR test. Same size, same water, same time. Only the material is different. Tap each cloth to test it!";
const EXPLAIN_VOICE = "Materials with tiny holes soak up water. Plastic has no holes, so the water runs off!";
const CARD_VOICE    = "You earned the Data Recorder Badge! Try a fair test at home. Test two cloths with the same water. Which one dries faster?";

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

export default function AbsorbentMaterialsActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]     = useState<Phase>('predict');
  const [predicted, setPredicted] = useState(false);
  const [tested, setTested]   = useState<Set<string>>(new Set());
  const [testing, setTesting] = useState<string | null>(null);

  useEffect(() => { speak(PREDICT_VOICE); return () => stopAudio(); }, []);

  function predict() {
    setPredicted(true);
    speak("Good guess! Now run a fair test to find out!", 0.85, () => {
      setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300);
    });
  }

  function testCloth(c: Cloth) {
    if (tested.has(c.id) || testing) return;
    setTesting(c.id);
    const isLast = tested.size + 1 >= CLOTHS.length;
    speak(`${c.name} held ${c.ml} millilitres of water!`, 0.9, undefined);
    setTimeout(() => {
      setTested(prev => new Set([...prev, c.id]));
      setTesting(null);
      if (isLast) setTimeout(() => { setPhase('explain'); speak(EXPLAIN_VOICE); }, 800);
    }, 1400);
  }

  const winner = CLOTHS.reduce((a, b) => (b.ml > a.ml ? b : a));
  const allTested = tested.size >= CLOTHS.length;

  return (
    <div className="fixed inset-0 bg-emerald-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── PREDICT ───────────────────────────────────────────────────── */}
        {phase === 'predict' && (
          <motion.div key="predict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-emerald-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-emerald-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">💧🧻</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Which cloth will hold the most water?</p>
              <button onClick={() => speak(PREDICT_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-emerald-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            {!predicted ? (
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {CLOTHS.map(c => (
                  <motion.button key={c.id} whileTap={{ scale: 0.92 }} onClick={predict}
                    className="flex flex-col items-center gap-1 p-4 bg-white border-2 border-emerald-200 rounded-3xl active:scale-95">
                    <span className="text-4xl">{c.emoji}</span>
                    <span className="font-black text-emerald-700 text-xs uppercase">{c.name}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">💧</motion.div>
            )}
          </motion.div>
        )}

        {/* ── FAIR TEST + BAR CHART ─────────────────────────────────────── */}
        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-emerald-300 text-sm font-bold mb-2">← Back</button>

            {/* Fair test rules */}
            <div className="bg-emerald-100 border-2 border-emerald-200 rounded-2xl p-2 mb-3">
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wide text-center mb-1">⚖️ Fair Test Rules</p>
              <div className="flex justify-center gap-2 text-[9px] font-bold text-emerald-600">
                <span className="bg-white px-2 py-0.5 rounded-full">Same size</span>
                <span className="bg-white px-2 py-0.5 rounded-full">Same water</span>
                <span className="bg-white px-2 py-0.5 rounded-full">Same time</span>
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex-1 bg-white rounded-2xl border-2 border-emerald-100 p-3 flex flex-col">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide text-center mb-1">Water absorbed (ml)</p>
              <div className="flex-1 flex items-end justify-around gap-2 pb-1">
                {CLOTHS.map(c => {
                  const done = tested.has(c.id);
                  const isWinner = allTested && c.id === winner.id;
                  return (
                    <div key={c.id} className="flex-1 flex flex-col items-center justify-end h-full">
                      {done && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-black text-emerald-700 mb-0.5">{c.ml}</motion.span>}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: done ? `${(c.ml / MAX_ML) * 100}%` : '0%' }}
                        transition={{ type: 'spring', damping: 14 }}
                        className={`w-full rounded-t-xl ${isWinner ? 'bg-emerald-500' : done ? 'bg-emerald-300' : 'bg-gray-100'}`}
                        style={{ minHeight: done ? 6 : 0 }}
                      />
                      <span className="text-2xl mt-1">{c.emoji}</span>
                      <span className="text-[8px] font-black text-gray-400 uppercase">{c.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cloth test buttons */}
            {!allTested ? (
              <>
                <p className="text-center text-xs text-emerald-500 font-bold my-2">Tap a cloth to test it 💧</p>
                <div className="grid grid-cols-4 gap-2">
                  {CLOTHS.map(c => {
                    const done = tested.has(c.id);
                    return (
                      <motion.button key={c.id} whileTap={{ scale: 0.9 }} onClick={() => testCloth(c)} disabled={done || !!testing}
                        className={`py-2 rounded-2xl flex flex-col items-center gap-0.5 active:scale-95 transition-all border-2
                          ${done ? 'bg-emerald-100 border-emerald-300 opacity-60' : testing === c.id ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <span className="text-2xl">{c.emoji}</span>
                        <span className="text-[8px] font-black uppercase text-gray-500">{testing === c.id ? '💧…' : done ? '✓' : c.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('explain'); speak(EXPLAIN_VOICE); }}
                className="mt-3 w-full py-4 bg-emerald-500 shadow-[0_5px_0_#059669] text-white font-display font-black text-lg rounded-3xl btn-press">
                {winner.name} won! Why? →
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ── EXPLAIN ───────────────────────────────────────────────────── */}
        {phase === 'explain' && (
          <motion.div key="explain" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 gap-5">
            <button onClick={onExit} className="self-start text-emerald-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-md text-center max-w-xs">
              <p className="text-5xl mb-3">🔬🕳️</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug mb-2">
                Materials with tiny holes soak up water.
              </p>
              <p className="text-sm text-gray-500 leading-snug">Plastic has no holes — so the water just runs off!</p>
              <button onClick={() => speak(EXPLAIN_VOICE)} className="mt-3 flex items-center gap-1 mx-auto text-emerald-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            <button onClick={() => { awardBadge(OBJECTIVE_ID, BADGE); setPhase('card'); }}
              className="w-full max-w-xs py-4 bg-emerald-500 shadow-[0_6px_0_#059669] text-white font-display font-black text-xl rounded-3xl btn-press">
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
      <button onClick={onExit} className="self-start text-emerald-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">📊</div>
        <p className="font-display font-black text-emerald-700 text-sm">Data Recorder Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-emerald-200 w-full max-w-xs mb-4 text-center">
        <p className="text-5xl mb-3">🧻💧👕</p>
        <p className="font-black text-gray-700 text-base leading-snug">Try a FAIR test at home! Wet two cloths with the same water. Which one dries faster? That one held less water.</p>
      </div>
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-2 w-full max-w-xs mb-4 text-center">
        <p className="text-[10px] font-black text-emerald-600">⚖️ Fair test = change only ONE thing!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D1FAE5" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-emerald-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-emerald-500 shadow-[0_6px_0_#059669] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
