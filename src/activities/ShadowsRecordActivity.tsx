// Activity: Shadows — Age 6 (Band B6)
// Foundation Phase Gr 1 — observe how a shadow changes, then reason WHY.
// Pattern: Explore (move torch → shadow grows/shrinks) → Why? → Badge + Card
//
// The torch slider is the Age-5 sim, but Age 6 adds the reasoning question
// "Why is the shadow bigger?". Earns the "Shadow Scientist Badge".

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'explore' | 'why' | 'card';

const OBJECTIVE_ID = 'ec.shadows_record';
const BADGE = 'Shadow Scientist Badge 🔦';

const EXPLORE_VOICE = "Move the torch! When the torch is CLOSE, the shadow is BIG. When it is FAR, the shadow is small.";
const WHY_VOICE     = "Why is the shadow BIG?";
const CARD_VOICE    = "You earned the Shadow Scientist Badge! Now use a torch at home. Make a big shadow. Make a small shadow!";

// torch distance 0 (close) .. 4 (far) → shadow scale
const STEPS = 5;

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

export default function ShadowsRecordActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]   = useState<Phase>('explore');
  const [dist, setDist]     = useState(2);       // 0 close … 4 far
  const [sawBig, setSawBig] = useState(false);
  const [sawSmall, setSawSmall] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    speak(EXPLORE_VOICE);
    return () => stopAudio();
  }, []);

  function move(newDist: number) {
    const d = Math.max(0, Math.min(STEPS - 1, newDist));
    setDist(d);
    if (d <= 1) setSawBig(true);
    if (d >= 3) setSawSmall(true);
    if (d <= 1) speak("Torch is CLOSE. Big shadow!");
    else if (d >= 3) speak("Torch is FAR. Small shadow!");
  }

  // shadow scale: close = big (1.8), far = small (0.5)
  const shadowScale = 1.8 - (dist / (STEPS - 1)) * 1.3;
  const bothSeen = sawBig && sawSmall;

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! The shadow is big because the light is close! You are a shadow scientist!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  return (
    <div className="fixed inset-0 bg-amber-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── EXPLORE ───────────────────────────────────────────────────── */}
        {phase === 'explore' && (
          <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-amber-600 text-sm uppercase tracking-widest mb-1">
              Move the torch!
            </p>
            <p className="text-center text-xs text-gray-400 font-bold mb-3">Watch the shadow change 🔦</p>

            {/* Stage */}
            <div className="flex-1 relative bg-gradient-to-b from-amber-100 to-amber-50 rounded-3xl border-2 border-amber-200 overflow-hidden flex items-center justify-center mb-3">
              {/* Torch (moves with dist) */}
              <motion.div animate={{ left: `${8 + dist * 8}%` }} className="absolute top-1/2 -translate-y-1/2 text-4xl z-10">🔦</motion.div>
              {/* Object */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl z-10">🧸</div>
              {/* Shadow (scales) */}
              <motion.div
                animate={{ scaleX: shadowScale, scaleY: shadowScale * 0.4 }}
                className="absolute left-[62%] top-1/2 -translate-y-1/2 w-16 h-16 bg-amber-900/25 rounded-full origin-left"
              />
              {/* Big/small label */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <span className={`px-3 py-1 rounded-full text-xs font-black ${dist <= 1 ? 'bg-amber-500 text-white' : dist >= 3 ? 'bg-amber-200 text-amber-700' : 'bg-white text-amber-600'}`}>
                  {dist <= 1 ? 'BIG shadow!' : dist >= 3 ? 'small shadow' : 'medium'}
                </span>
              </div>
            </div>

            {/* Closer / Farther controls */}
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => move(dist - 1)}
                className="flex-1 py-4 bg-amber-400 shadow-[0_4px_0_#D97706] text-white rounded-2xl font-display font-black active:scale-95 transition-transform">
                🔦 Closer
              </button>
              <button onClick={() => speak(EXPLORE_VOICE)} className="p-4 bg-white rounded-2xl text-amber-500 active:scale-95 transition-transform border-2 border-amber-200">
                <Volume2 size={22} />
              </button>
              <button onClick={() => move(dist + 1)}
                className="flex-1 py-4 bg-amber-300 shadow-[0_4px_0_#F59E0B] text-amber-800 rounded-2xl font-display font-black active:scale-95 transition-transform">
                Farther →
              </button>
            </div>

            {bothSeen && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => { setPhase('why'); speak(WHY_VOICE); }}
                className="w-full py-4 bg-amber-500 shadow-[0_5px_0_#D97706] text-white font-display font-black text-lg rounded-3xl btn-press">
                I saw big AND small! →
              </motion.button>
            )}
            {!bothSeen && (
              <p className="text-center text-xs text-amber-500 font-bold">Try moving the torch close AND far!</p>
            )}
          </motion.div>
        )}

        {/* ── WHY ───────────────────────────────────────────────────────── */}
        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🔦🧸</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Why is the shadow BIG?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-amber-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-amber-50 border-2 border-amber-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">🔦➡️</span>
                  <span className="font-black text-amber-700 text-xs uppercase">Light is close</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-sky-50 border-2 border-sky-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">🔦………</span>
                  <span className="font-black text-sky-700 text-xs uppercase">Light is far</span>
                </motion.button>
              </div>
            ) : (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🔦</motion.div>
            )}
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
  useEffect(() => {
    const t = setTimeout(() => speak(CARD_VOICE), 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div key="card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full p-6 items-center">
      <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }}
        className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🔦</div>
        <p className="font-display font-black text-amber-600 text-sm">Shadow Scientist Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🔦🙌</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          Use a torch at home together! Shine it on a toy. Make the shadow BIG. Now make it small. What did you move?
        </p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FEF3C7" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F59E0B" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-amber-500 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span>
        </div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-amber-500 shadow-[0_6px_0_#D97706] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
