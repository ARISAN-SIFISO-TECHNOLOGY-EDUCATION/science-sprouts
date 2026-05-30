// Activity: Strong Materials — Age 6 (Band B6)
// Foundation Phase Gr 1 — strong materials hold weight; weak ones break.
// Pattern: Predict → Test bridges → Why? → Badge + Caregiver Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'predict' | 'test' | 'why' | 'card';

interface Bridge { id: string; emoji: string; name: string; strong: boolean; voice: string; }

const BRIDGES: Bridge[] = [
  { id: 'paper', emoji: '📄', name: 'Paper',     strong: false, voice: 'The paper bridge BREAKS! Paper is too weak.' },
  { id: 'card',  emoji: '📦', name: 'Cardboard', strong: false, voice: 'The cardboard bends and BREAKS! It is not strong enough.' },
  { id: 'wood',  emoji: '🪵', name: 'Wood',      strong: true,  voice: 'The wood bridge HOLDS! Wood is strong and stiff.' },
];

const OBJECTIVE_ID = 'mm.strong_materials';
const BADGE = 'Builder Badge 🏗️';

const PREDICT_VOICE = "We need a strong bridge for the car! Which one will hold?";
const TEST_VOICE    = "Tap each bridge. Put the car on top. Does it hold or break?";
const WHY_VOICE     = "Which bridge is STRONG?";
const CARD_VOICE    = "You earned the Builder Badge! Build a little bridge from card or sticks. Test it with a coin. Does it hold?";

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

export default function StrongMaterialsRecordActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]     = useState<Phase>('predict');
  const [predicted, setPredicted] = useState(false);
  const [tested, setTested]   = useState<Record<string, boolean>>({}); // id → strong
  const [active, setActive]   = useState<Bridge | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(PREDICT_VOICE); return () => stopAudio(); }, []);

  function predict() {
    setPredicted(true);
    speak("Good guess! Now test each bridge and see!", 0.85, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); });
  }

  function testBridge(b: Bridge) {
    if (b.id in tested) return;
    const isLast = Object.keys(tested).length + 1 >= BRIDGES.length;
    setActive(b);
    speak(b.voice, 0.85, isLast ? () => setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 700) : undefined);
    setTested(prev => ({ ...prev, [b.id]: b.strong }));
    setTimeout(() => setActive(null), 2000);
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! The wood bridge is strong! Strong materials hold weight. You are a builder!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  const remaining = BRIDGES.filter(b => !(b.id in tested));

  return (
    <div className="fixed inset-0 bg-amber-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'predict' && (
          <motion.div key="predict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md text-center w-full max-w-xs">
              <p className="text-6xl mb-3">🚗🌉</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Which bridge will hold the car?</p>
              <button onClick={() => speak(PREDICT_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-amber-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-xs">
                {BRIDGES.map(b => (
                  <motion.button key={b.id} whileTap={{ scale: 0.92 }} onClick={predict}
                    className="flex-1 flex flex-col items-center gap-1 p-3 bg-white border-2 border-amber-200 rounded-3xl active:scale-95">
                    <span className="text-4xl">{b.emoji}</span>
                    <span className="font-black text-amber-700 text-[10px] uppercase">{b.name}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🌉</motion.div>
            )}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-amber-600 text-sm uppercase tracking-widest mb-1">Test each bridge!</p>
            <p className="text-center text-xs text-gray-400 font-bold mb-3">Put the car on top 🚗</p>

            {/* Test stage */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-56 h-40 bg-sky-50 rounded-3xl border-2 border-amber-200 flex flex-col items-center justify-center overflow-hidden">
                {active ? (
                  <>
                    <motion.span initial={{ y: -30 }} animate={{ y: active.strong ? -6 : 20 }} transition={{ duration: 0.8 }} className="text-4xl z-10">🚗</motion.span>
                    <div className="flex items-center gap-0.5 mt-1">
                      <span className="text-2xl">🧱</span>
                      <motion.span animate={active.strong ? {} : { rotate: [0, -15, 15, -30], y: [0, 4, 8, 16] }} transition={{ duration: 0.8 }} className="text-3xl">{active.emoji}</motion.span>
                      <span className="text-2xl">🧱</span>
                    </div>
                    <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className={`absolute bottom-3 px-3 py-1 rounded-full text-xs font-black ${active.strong ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {active.strong ? 'HOLDS! ✓' : 'BREAKS! 💥'}
                    </motion.p>
                  </>
                ) : (
                  <span className="text-amber-300 text-sm font-bold">Tap a bridge below ↓</span>
                )}
              </div>
            </div>

            {/* Bridge buttons */}
            <div className="grid grid-cols-3 gap-2">
              {BRIDGES.map(b => {
                const done = b.id in tested;
                return (
                  <motion.button key={b.id} whileTap={{ scale: 0.92 }} onClick={() => testBridge(b)} disabled={done && !remaining.length}
                    className={`py-3 rounded-2xl flex flex-col items-center gap-1 active:scale-95 transition-all border-2
                      ${done ? (b.strong ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700') : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>
                    <span className="text-3xl">{b.emoji}</span>
                    <span className="font-black text-[10px] uppercase">{b.name}{done ? (b.strong ? ' ✓' : ' 💥') : ''}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🌉💪</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Which bridge is STRONG?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-amber-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-amber-50 border-2 border-amber-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🪵</span><span className="font-black text-amber-700 text-xs uppercase">Wood</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">📄</span><span className="font-black text-gray-500 text-xs uppercase">Paper</span>
                </motion.button>
              </div>
            ) : (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🪵💪</motion.div>
            )}
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
        <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🏗️</div>
        <p className="font-display font-black text-amber-600 text-sm">Builder Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌉🪙</p>
        <p className="font-black text-gray-700 text-base leading-snug">Build a little bridge from cardboard or sticks across two cups. Put a coin on top. Does it hold or break?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FEF3C7" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-amber-500 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-amber-500 shadow-[0_6px_0_#D97706] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
