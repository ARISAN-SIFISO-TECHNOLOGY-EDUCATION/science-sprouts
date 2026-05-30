// Activity: Wind Moves Things — Age 7 (Band B7)
// Foundation Phase Gr 2 — wind is a force; it moves light things more than heavy.
// Pattern: Predict → Fair test (same wind, light vs heavy) → Why? → Badge + Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'predict' | 'test' | 'why' | 'card';

interface Item { id: string; emoji: string; name: string; light: boolean; voice: string; }

const ITEMS: Item[] = [
  { id: 'paper', emoji: '📄', name: 'Paper', light: true,  voice: 'The light paper flies away in the wind!' },
  { id: 'block', emoji: '🧱', name: 'Brick', light: false, voice: 'The heavy brick does not move. Wind is too weak to push it!' },
];

const OBJECTIVE_ID = 'ec.wind';
const BADGE = 'Wind Tester Badge 🌬️';

const PREDICT_VOICE = "We blow the same wind on paper and a brick. Which one moves?";
const TEST_VOICE    = "Same wind for both — that is a fair test! Tap the fan to blow.";
const WHY_VOICE     = "Why did the paper move but not the brick?";
const CARD_VOICE    = "You earned the Wind Tester Badge! Make a paper windmill or blow on different things. Which ones move in the wind?";

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

export default function WindActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('predict');
  const [predicted, setPredicted] = useState(false);
  const [blowing, setBlowing] = useState(false);
  const [tested, setTested] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(PREDICT_VOICE); return () => stopAudio(); }, []);

  function predict() {
    setPredicted(true);
    speak("Let's run a fair test with the same wind!", 0.85, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); });
  }

  function blow() {
    if (blowing || tested) return;
    setBlowing(true);
    speak("Same wind for both! The light paper flies, the heavy brick stays still.", 0.9, () => {
      setTested(true);
      setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 900);
    });
    setTimeout(() => setBlowing(false), 2000);
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! The paper is light, so wind moves it easily. The brick is too heavy. You are a wind tester!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  return (
    <div className="fixed inset-0 bg-sky-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'predict' && (
          <motion.div key="predict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-sky-100 shadow-md text-center w-full max-w-xs">
              <p className="text-6xl mb-3">🌬️📄🧱</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Same wind on paper and a brick — which moves?</p>
              <button onClick={() => speak(PREDICT_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-sky-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 flex flex-col items-center gap-2 p-4 bg-sky-50 border-2 border-sky-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">📄</span><span className="font-black text-sky-700 text-xs uppercase">The paper</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🧱</span><span className="font-black text-gray-500 text-xs uppercase">The brick</span>
                </motion.button>
              </div>
            ) : <motion.div animate={{ x: [0, 20, 0] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🌬️</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold mb-2">← Back</button>
            <div className="bg-sky-100 border-2 border-sky-200 rounded-2xl p-2 mb-3">
              <p className="text-[10px] font-black text-sky-700 uppercase tracking-wide text-center">⚖️ Fair test: SAME wind for both</p>
            </div>

            {/* Stage: fan on left, items on right */}
            <div className="flex-1 flex items-center">
              <motion.span animate={blowing ? { rotate: [0, 360] } : {}} transition={{ duration: 0.5, repeat: blowing ? 4 : 0 }} className="text-5xl">🌀</motion.span>
              <div className="flex-1 flex flex-col gap-6 pl-2">
                {ITEMS.map(item => (
                  <div key={item.id} className="relative h-14 flex items-center">
                    <motion.span
                      animate={blowing && item.light ? { x: [0, 160], rotate: [0, 40] } : blowing ? { x: [0, 6, 0] } : { x: 0 }}
                      transition={{ duration: 1.6 }}
                      className="text-4xl">{item.emoji}</motion.span>
                    {tested && (
                      <span className={`absolute right-2 text-xs font-black px-2 py-0.5 rounded-full ${item.light ? 'bg-sky-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                        {item.light ? 'Moved! →' : 'Stayed'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {!tested ? (
              <button onClick={blow} disabled={blowing}
                className="mt-3 w-full py-4 bg-sky-500 shadow-[0_5px_0_#0284C7] text-white font-display font-black text-lg rounded-3xl active:scale-95 transition-transform">
                {blowing ? '🌬️ Blowing…' : '🌬️ Blow the fan!'}
              </button>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('why'); speak(WHY_VOICE); }}
                className="mt-3 w-full py-4 bg-sky-500 shadow-[0_5px_0_#0284C7] text-white font-display font-black text-lg rounded-3xl btn-press">
                Only the paper moved! Why? →
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-sky-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">📄🌬️🧱</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Why did the paper move but not the brick?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-sky-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-sky-50 border-2 border-sky-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">📄🪶</span><span className="font-black text-sky-700 text-[11px] uppercase">Paper is light</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">🧱✨</span><span className="font-black text-gray-500 text-[11px] uppercase">Brick is magic</span>
                </motion.button>
              </div>
            ) : <motion.div animate={{ x: [0, 30, 0] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">📄</motion.div>}
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
        <div className="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌬️</div>
        <p className="font-display font-black text-sky-700 text-sm">Wind Tester Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-sky-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌬️📄🍃</p>
        <p className="font-black text-gray-700 text-base leading-snug">Make a paper windmill or blow on different things. Which ones move in the wind? Light things move most!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E0F2FE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0EA5E9" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-sky-500 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-sky-500 shadow-[0_6px_0_#0284C7] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
