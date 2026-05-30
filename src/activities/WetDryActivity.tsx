// Activity: Wet vs Dry — Age 5 (Band A5)
// Pattern: See → Predict → Do → Caregiver Card
//
// See     (8s):  DRY cloth → water → WET. Big word labels DRY / WET + voice
// Predict (30s): "If we put paper in water, what happens?" — 2 choices
// Do      (60s): Tap 4 items with water drop → each goes WET + big label
// Card   (120s): "Wash a face cloth. Where does it dry?"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'see' | 'predict' | 'do' | 'card';

interface Item { id: string; emoji: string; label: string; }

const ITEMS: Item[] = [
  { id: 'sponge', emoji: '🧽', label: 'Sponge'  },
  { id: 'paper',  emoji: '📄', label: 'Paper'   },
  { id: 'cloth',  emoji: '🧣', label: 'Cloth'   },
  { id: 'bread',  emoji: '🍞', label: 'Bread'   },
];

const SEE_VOICE    = "This cloth is DRY! Now we add water. Now it is WET! DRY means no water. WET means it has water on it!";
const CARD_VOICE   = "Time for a washing mission! Help your child wash a small cloth. Ask: Is it dry or wet now? Find the sunny spot where it can dry!";

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

export default function WetDryActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]       = useState<Phase>('see');
  const [seeTick, setSeeTick]   = useState(0);    // 0=dry, 1=water falls, 2=wet
  const [predicted, setPredicted] = useState(false);
  const [wetItems, setWetItems] = useState<Set<string>>(new Set());
  const [splashing, setSplashing] = useState<string | null>(null);
  const [wordFlash, setWordFlash] = useState<'WET' | 'DRY' | null>(null);

  useEffect(() => {
    speak(SEE_VOICE);
    const t1 = setTimeout(() => setSeeTick(1), 2000);
    const t2 = setTimeout(() => setSeeTick(2), 4000);
    const t3 = setTimeout(() => setPhase('predict'), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); stopAudio(); };
  }, []);

  // ── PREDICT ───────────────────────────────────────────────────────────────

  function predict(choice: 'same' | 'wet') {
    setPredicted(true);
    const msg = choice === 'wet'
      ? "Yes! Water makes it WET! Great thinking!"
      : "Let's find out! Water makes things WET!";
    speak(msg, 0.85, () => setPhase('do'));
  }

  // ── DO ─────────────────────────────────────────────────────────────────────

  function wetItem(item: Item) {
    if (wetItems.has(item.id)) return;
    const isLast = wetItems.size + 1 >= ITEMS.length;
    speak(`${item.label}! WET! 💧`, 0.85, isLast ? () => setPhase('card') : undefined);
    setSplashing(item.id);
    setWordFlash('WET');
    setWetItems(prev => new Set([...prev, item.id]));
    setTimeout(() => { setSplashing(null); setWordFlash(null); }, 1200);
  }

  return (
    <div className="fixed inset-0 bg-blue-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── SEE ───────────────────────────────────────────────────────── */}
        {phase === 'see' && (
          <motion.div key="see" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 gap-5">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold">← Back</button>

            {/* DRY → WET animation */}
            <div className="flex items-center gap-6">
              {/* Cloth */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  animate={{ backgroundColor: seeTick >= 2 ? '#BFDBFE' : '#FEF3C7' }}
                  transition={{ duration: 0.8 }}
                  className="w-28 h-20 rounded-2xl flex items-center justify-center text-5xl border-4 border-white shadow-lg"
                >
                  🧣
                </motion.div>

                {/* Water drops falling */}
                <AnimatePresence>
                  {seeTick === 1 && (
                    <motion.div key="drops" className="absolute -top-8 flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.span key={i} initial={{ y: 0, opacity: 1 }} animate={{ y: 32, opacity: 0 }}
                          transition={{ duration: 0.6, delay: i * 0.1 }} className="text-2xl">💧</motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Big word label */}
              <AnimatePresence mode="wait">
                <motion.div key={seeTick}
                  initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                  className={`px-5 py-3 rounded-2xl font-display font-black text-4xl ${seeTick >= 2 ? 'bg-blue-400 text-white' : 'bg-yellow-100 text-yellow-700'}`}>
                  {seeTick >= 2 ? 'WET 💧' : 'DRY ☀️'}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-blue-100 text-center max-w-xs">
              <p className="font-bold text-gray-700 text-base leading-snug">{SEE_VOICE}</p>
              <button onClick={() => speak(SEE_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-blue-400 text-sm font-bold">
                <Volume2 size={14} /> Again
              </button>
            </div>
          </motion.div>
        )}

        {/* ── PREDICT ───────────────────────────────────────────────────── */}
        {phase === 'predict' && !predicted && (
          <motion.div key="predict" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold">← Back</button>

            <div className="bg-white rounded-3xl p-5 border-2 border-blue-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">📄💧</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">
                What happens if we put paper in water?
              </p>
              <button onClick={() => speak("What happens if we put this paper in water?")}
                className="mt-2 flex items-center gap-1 mx-auto text-blue-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>

            <div className="flex gap-4 w-full max-w-xs">
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict('same')}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-yellow-50 border-3 border-yellow-200 rounded-3xl active:scale-95"
                style={{ border: '3px solid #FDE68A' }}>
                <span className="text-5xl">📄</span>
                <span className="font-black text-yellow-700 text-sm uppercase">Stays same</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict('wet')}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-blue-50 border-3 border-blue-200 rounded-3xl active:scale-95"
                style={{ border: '3px solid #BFDBFE' }}>
                <span className="text-5xl">💧📄</span>
                <span className="font-black text-blue-700 text-sm uppercase">Gets WET</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Transition after predict */}
        {phase === 'predict' && predicted && (
          <motion.div key="predDone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full items-center justify-center">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 2 }} className="text-7xl">💧</motion.div>
          </motion.div>
        )}

        {/* ── DO ────────────────────────────────────────────────────────── */}
        {phase === 'do' && (
          <motion.div key="do" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold mb-3">← Back</button>
            <p className="text-center font-display font-black text-blue-600 text-sm uppercase tracking-widest mb-3">
              Tap each thing — make it WET! 💧
            </p>

            {/* Progress */}
            <div className="flex justify-center gap-2 mb-4">
              {ITEMS.map(i => (
                <div key={i.id} className={`w-3 h-3 rounded-full ${wetItems.has(i.id) ? 'bg-blue-400' : 'bg-blue-100'}`} />
              ))}
            </div>

            {/* WET word flash */}
            <AnimatePresence>
              {wordFlash && (
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.3, opacity: 0 }}
                  className="absolute inset-x-8 top-24 z-20 bg-blue-500 rounded-3xl p-4 text-center shadow-xl">
                  <p className="font-display font-black text-6xl text-white">WET! 💧</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Item grid */}
            <div className="grid grid-cols-2 gap-4 flex-1 content-center">
              {ITEMS.map(item => {
                const wet  = wetItems.has(item.id);
                const splash = splashing === item.id;
                return (
                  <motion.button key={item.id}
                    animate={splash ? { scale: [1, 1.15, 0.9, 1] } : {}}
                    transition={{ duration: 0.4 }}
                    onClick={() => wetItem(item)}
                    className={`flex flex-col items-center gap-2 p-5 rounded-3xl border-2 min-h-[100px] justify-center active:scale-95 transition-all
                                ${wet ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-100 shadow-md'}`}
                  >
                    <span className="text-5xl">{item.emoji}{wet ? '💧' : ''}</span>
                    <span className={`font-black text-sm uppercase ${wet ? 'text-blue-600' : 'text-gray-400'}`}>
                      {wet ? 'WET ✓' : item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── CARD ──────────────────────────────────────────────────────── */}
        {phase === 'card' && (
          <CaregiverCard onComplete={onComplete} onExit={onExit} />
        )}

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
      <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold mb-4">← Back</button>
      <div className="bg-blue-100 border-2 border-blue-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-4">
        <span>👨‍👩‍👧</span><span className="text-xs font-black text-blue-600 uppercase tracking-widest">Washing Mission!</span>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-blue-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🧣💧☀️</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          Help wash a small cloth together. Ask: "Is it DRY or WET?" Then find the sunny spot to hang it. Watch it dry!
        </p>
      </div>
      <div className="flex gap-4 w-full max-w-xs mb-5">
        <div className="flex-1 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 text-center">
          <span className="text-3xl">☀️</span><p className="text-[10px] font-black text-yellow-700 uppercase mt-1">DRY = no water</p>
        </div>
        <div className="flex-1 bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 text-center">
          <span className="text-3xl">💧</span><p className="text-[10px] font-black text-blue-700 uppercase mt-1">WET = has water</p>
        </div>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#DBEAFE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3B82F6" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-blue-500 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span>
        </div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-blue-500 shadow-[0_6px_0_#2563EB] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
