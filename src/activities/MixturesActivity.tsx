// Activity: Mixtures — Sand & Water — Age 7 (Band B7)
// Foundation Phase Gr 2 — some mixtures can be separated again.
// Pattern: Predict → Investigate (shake→settle→pour) → Why? → Badge + Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'predict' | 'investigate' | 'why' | 'card';
type Step = 'mixed' | 'shaken' | 'settled' | 'poured';

const OBJECTIVE_ID = 'mm.mixtures';
const BADGE = 'Mixture Master Badge 🪣';

const PREDICT_VOICE = "We mix sand and water. Can we get the clean water back?";
const STEP_VOICE: Record<Step, string> = {
  mixed:   'Here is sand and water together in a jar.',
  shaken:  'Shake it! The water goes cloudy and brown.',
  settled: 'Wait... the heavy sand sinks to the bottom. The water clears!',
  poured:  'Pour gently. The clean water comes out. The sand stays behind!',
};
const WHY_VOICE  = "Why did the sand sink to the bottom?";
const CARD_VOICE = "You earned the Mixture Master Badge! Mix soil and water in a clear jar. Let it settle. Can you pour the water off?";

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

export default function MixturesActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('predict');
  const [predicted, setPredicted] = useState(false);
  const [step, setStep] = useState<Step>('mixed');
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(PREDICT_VOICE); return () => stopAudio(); }, []);

  function predict() {
    setPredicted(true);
    speak("Let's investigate and see!", 0.85, () => { setPhase('investigate'); setTimeout(() => speak(STEP_VOICE.mixed), 300); });
  }

  const STEP_ORDER: Step[] = ['mixed', 'shaken', 'settled', 'poured'];

  function nextStep() {
    const idx = STEP_ORDER.indexOf(step);
    if (idx >= STEP_ORDER.length - 1) return;
    const ns = STEP_ORDER[idx + 1];
    setStep(ns);
    const isLast = ns === 'poured';
    speak(STEP_VOICE[ns], 0.9, isLast ? () => setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 1000) : undefined);
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! Sand is heavier than water, so it sinks. Then we can pour the water off. You are a mixture master!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  // Jar visuals per step
  const waterColor = step === 'shaken' ? '#A16207' : step === 'mixed' ? '#92857a' : '#7DD3FC';
  const showSandLayer = step === 'settled' || step === 'poured';
  const waterHeight = step === 'poured' ? 10 : 55;

  const stepLabel: Record<Step, string> = { mixed: 'Mixed', shaken: 'Shaking!', settled: 'Settling...', poured: 'Poured!' };
  const nextLabel: Record<Step, string> = { mixed: '🤳 Shake it!', shaken: '⏳ Let it settle', settled: '🫗 Pour the water', poured: '' };

  return (
    <div className="fixed inset-0 bg-amber-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'predict' && (
          <motion.div key="predict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md text-center w-full max-w-xs">
              <p className="text-6xl mb-3">🏖️💧</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Can we get the clean water back from sandy water?</p>
              <button onClick={() => speak(PREDICT_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-amber-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 flex flex-col items-center gap-2 p-4 bg-sky-50 border-2 border-sky-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">✅</span><span className="font-black text-sky-700 text-xs uppercase">Yes, we can</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">❌</span><span className="font-black text-gray-500 text-xs uppercase">No way</span>
                </motion.button>
              </div>
            ) : <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🪣</motion.div>}
          </motion.div>
        )}

        {phase === 'investigate' && (
          <motion.div key="inv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-amber-600 text-sm uppercase tracking-widest mb-3">{stepLabel[step]}</p>

            {/* Jar */}
            <div className="flex-1 flex items-center justify-center">
              <motion.div animate={step === 'shaken' ? { rotate: [0, -8, 8, -8, 0] } : { rotate: 0 }} transition={{ duration: 0.6, repeat: step === 'shaken' ? 2 : 0 }}
                className="relative w-32 h-44 bg-white rounded-b-3xl rounded-t-xl border-4 border-gray-200 overflow-hidden flex flex-col justify-end">
                {/* clean water layer (on top after settle) */}
                <motion.div animate={{ height: waterHeight, backgroundColor: waterColor }} className="w-full" />
                {/* sand layer */}
                {showSandLayer && <div className="w-full h-10 bg-amber-600" />}
                {!showSandLayer && (
                  <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-60">🏖️</div>
                )}
                {step === 'poured' && <div className="absolute top-2 left-0 right-0 text-center text-xs font-black text-sky-600">clean! 💧→</div>}
              </motion.div>
            </div>

            {step !== 'poured' ? (
              <button onClick={nextStep}
                className="mt-3 w-full py-4 bg-amber-500 shadow-[0_5px_0_#D97706] text-white font-display font-black text-lg rounded-3xl active:scale-95 transition-transform">
                {nextLabel[step]}
              </button>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('why'); speak(WHY_VOICE); }}
                className="mt-3 w-full py-4 bg-amber-500 shadow-[0_5px_0_#D97706] text-white font-display font-black text-lg rounded-3xl btn-press">
                We separated them! Why? →
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🏖️⬇️</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Why did the sand sink to the bottom?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-amber-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-amber-50 border-2 border-amber-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">🏖️⬇️</span><span className="font-black text-amber-700 text-[11px] uppercase">Sand is heavier</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-sky-50 border-2 border-sky-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">💧⬇️</span><span className="font-black text-sky-700 text-[11px] uppercase">Water is heavier</span>
                </motion.button>
              </div>
            ) : <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🏖️</motion.div>}
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
        <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🪣</div>
        <p className="font-display font-black text-amber-600 text-sm">Mixture Master Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🫙🏖️💧</p>
        <p className="font-black text-gray-700 text-base leading-snug">Mix soil and water in a clear jar. Let it settle for a few minutes. Can you carefully pour the water off the top?</p>
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
