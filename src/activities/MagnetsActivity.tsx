// Activity: Magnets Attract — Age 7 (Band B7)
// Foundation Phase Gr 2 — test which materials a magnet sticks to; record results.
// Pattern: Predict → Test & Record (table) → Explain → Badge + Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'predict' | 'test' | 'explain' | 'card';

interface Item { id: string; emoji: string; name: string; sticks: boolean; voice: string; }

const ITEMS: Item[] = [
  { id: 'clip',    emoji: '📎', name: 'Paper clip',  sticks: true,  voice: 'The paper clip STICKS! It is made of metal.' },
  { id: 'nail',    emoji: '🔩', name: 'Nail',        sticks: true,  voice: 'The nail STICKS! Magnets love iron metal.' },
  { id: 'spoon',   emoji: '🥄', name: 'Metal spoon', sticks: true,  voice: 'The metal spoon STICKS to the magnet!' },
  { id: 'toy',     emoji: '🧸', name: 'Toy',         sticks: false, voice: 'The toy does NOT stick. It is not metal.' },
  { id: 'pencil',  emoji: '✏️', name: 'Pencil',      sticks: false, voice: 'The pencil does NOT stick. Wood is not magnetic.' },
  { id: 'eraser',  emoji: '🧽', name: 'Eraser',      sticks: false, voice: 'The eraser does NOT stick. Rubber is not magnetic.' },
];

const OBJECTIVE_ID = 'ec.magnets';
const BADGE = 'Magnet Tester Badge 🧲';

const PREDICT_VOICE = "What does a magnet stick to? Tap your guess!";
const TEST_VOICE    = "Tap each thing with the magnet. Does it stick? Watch the table fill in!";
const EXPLAIN_VOICE = "Magnets stick to metal made of iron. They do not stick to wood, plastic, or rubber!";
const CARD_VOICE    = "You earned the Magnet Tester Badge! Take a fridge magnet and test 5 things at home. Which ones stick?";

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

export default function MagnetsActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]     = useState<Phase>('predict');
  const [predicted, setPredicted] = useState(false);
  const [tested, setTested]   = useState<Record<string, boolean>>({});
  const [pulling, setPulling] = useState<Item | null>(null);

  useEffect(() => { speak(PREDICT_VOICE); return () => stopAudio(); }, []);

  function predict() {
    setPredicted(true);
    speak("Let's test and see what really sticks!", 0.85, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); });
  }

  function testItem(item: Item) {
    if (item.id in tested || pulling) return;
    setPulling(item);
    const isLast = Object.keys(tested).length + 1 >= ITEMS.length;
    speak(item.voice, 0.9, undefined);
    setTimeout(() => {
      setTested(prev => ({ ...prev, [item.id]: item.sticks }));
      setPulling(null);
      if (isLast) setTimeout(() => { setPhase('explain'); speak(EXPLAIN_VOICE); }, 700);
    }, 1300);
  }

  const remaining = ITEMS.filter(i => !(i.id in tested));

  return (
    <div className="fixed inset-0 bg-slate-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── PREDICT ───────────────────────────────────────────────────── */}
        {phase === 'predict' && (
          <motion.div key="predict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-slate-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-md text-center w-full max-w-xs">
              <p className="text-6xl mb-3">🧲</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">What does a magnet stick to?</p>
              <button onClick={() => speak(PREDICT_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-slate-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            {!predicted ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-slate-100 border-2 border-slate-300 rounded-3xl active:scale-95">
                  <span className="text-5xl">🔩</span><span className="font-black text-slate-700 text-xs uppercase">Metal</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-amber-50 border-2 border-amber-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🪵</span><span className="font-black text-amber-700 text-xs uppercase">Wood</span>
                </motion.button>
              </div>
            ) : (
              <motion.div animate={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🧲</motion.div>
            )}
          </motion.div>
        )}

        {/* ── TEST & RECORD ─────────────────────────────────────────────── */}
        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-slate-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-slate-600 text-sm uppercase tracking-widest mb-1">Test with the magnet!</p>
            <p className="text-center text-xs text-gray-400 font-bold mb-2">Does it stick? 🧲</p>

            {/* Magnet stage */}
            <div className="relative h-16 flex items-center justify-center mb-2">
              <span className="text-4xl">🧲</span>
              <AnimatePresence>
                {pulling && (
                  <motion.span key={pulling.id} initial={{ x: 60, opacity: 0 }}
                    animate={{ x: pulling.sticks ? 20 : 60, opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-3xl absolute">{pulling.emoji}</motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Items to test */}
            {remaining.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {remaining.map(i => (
                  <motion.button key={i.id} whileTap={{ scale: 0.88 }} onClick={() => testItem(i)} disabled={!!pulling}
                    className="flex flex-col items-center gap-0.5 p-2 bg-white rounded-2xl shadow-md border-2 border-gray-100 active:scale-95">
                    <span className="text-2xl">{i.emoji}</span>
                    <span className="text-[8px] font-black text-gray-400 uppercase">{i.name}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Data table */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden flex-1">
              <div className="grid grid-cols-2 bg-slate-500 text-white text-xs font-black uppercase tracking-wide">
                <div className="p-2 text-center border-r border-slate-400">Object</div>
                <div className="p-2 text-center">Sticks?</div>
              </div>
              {ITEMS.map(i => {
                const done = i.id in tested;
                return (
                  <div key={i.id} className={`grid grid-cols-2 border-b border-gray-100 ${done ? '' : 'opacity-30'}`}>
                    <div className="p-1.5 flex items-center justify-center gap-2 border-r border-gray-100">
                      <span className="text-xl">{i.emoji}</span>
                      <span className="text-[11px] font-bold text-gray-600">{i.name}</span>
                    </div>
                    <div className="p-1.5 flex items-center justify-center">
                      {done ? (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className={`text-[11px] font-black px-2 py-0.5 rounded-full ${tested[i.id] ? 'bg-slate-200 text-slate-800' : 'bg-gray-100 text-gray-500'}`}>
                          {tested[i.id] ? '🧲 YES' : '✗ NO'}
                        </motion.span>
                      ) : <span className="text-gray-300">?</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── EXPLAIN ───────────────────────────────────────────────────── */}
        {phase === 'explain' && (
          <motion.div key="explain" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 gap-5">
            <button onClick={onExit} className="self-start text-slate-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-md text-center max-w-xs">
              <p className="text-5xl mb-3">🧲🔩</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug mb-2">Magnets stick to metal made of iron.</p>
              <p className="text-sm text-gray-500 leading-snug">They do not stick to wood, plastic, or rubber!</p>
              <button onClick={() => speak(EXPLAIN_VOICE)} className="mt-3 flex items-center gap-1 mx-auto text-slate-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            <button onClick={() => { awardBadge(OBJECTIVE_ID, BADGE); setPhase('card'); }}
              className="w-full max-w-xs py-4 bg-slate-500 shadow-[0_6px_0_#475569] text-white font-display font-black text-xl rounded-3xl btn-press">
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
      <button onClick={onExit} className="self-start text-slate-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-slate-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🧲</div>
        <p className="font-display font-black text-slate-700 text-sm">Magnet Tester Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-slate-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🧲🔑📎</p>
        <p className="font-black text-gray-700 text-base leading-snug">Take a fridge magnet. Test 5 things at home. Which ones stick? Only metal made of iron will!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E2E8F0" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#64748B" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-slate-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-slate-500 shadow-[0_6px_0_#475569] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
