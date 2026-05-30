// Activity: Materials Around Us — Age 6 (Band B6)
// Foundation Phase Gr 1 — everyday things are made of different materials.
// Pattern: Sort objects by material → Why? → Badge + Caregiver Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { cn, speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'sort' | 'why' | 'card';
type Material = 'wood' | 'metal' | 'plastic';

interface Obj { id: string; emoji: string; name: string; material: Material; voice: string; }

const OBJECTS: Obj[] = [
  { id: 'chair',  emoji: '🪑', name: 'Chair',  material: 'wood',    voice: 'A chair is made of WOOD! Wood comes from trees.' },
  { id: 'spoon',  emoji: '🥄', name: 'Spoon',  material: 'metal',   voice: 'A spoon is made of METAL! Metal is hard and shiny.' },
  { id: 'bottle', emoji: '🧴', name: 'Bottle', material: 'plastic', voice: 'A bottle is made of PLASTIC! Plastic is light and bendy.' },
  { id: 'pencil', emoji: '✏️', name: 'Pencil', material: 'wood',    voice: 'A pencil is made of WOOD!' },
  { id: 'key',    emoji: '🔑', name: 'Key',    material: 'metal',   voice: 'A key is made of METAL!' },
  { id: 'toy',    emoji: '🧸', name: 'Toy',    material: 'plastic', voice: 'Many toys are made of PLASTIC!' },
];

const MAT_META: Record<Material, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  wood:    { label: 'WOOD',    emoji: '🪵', color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200'  },
  metal:   { label: 'METAL',   emoji: '🔩', color: 'text-slate-700',  bg: 'bg-slate-100', border: 'border-slate-300'  },
  plastic: { label: 'PLASTIC', emoji: '🧴', color: 'text-cyan-700',   bg: 'bg-cyan-50',   border: 'border-cyan-200'   },
};

const OBJECTIVE_ID = 'mm.materials';
const BADGE = 'Material Detective Badge 🔍';

const SORT_VOICE = "Everything is made of something! Tap each thing to find its material.";
const WHY_VOICE  = "What is a chair made of?";
const CARD_VOICE = "You earned the Material Detective Badge! Find 3 things made of plastic at home. What else can you find?";

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

export default function MaterialsRecordActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]   = useState<Phase>('sort');
  const [sorted, setSorted] = useState<Record<string, Material>>({});
  const [feedback, setFeedback] = useState<Obj | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(SORT_VOICE); return () => stopAudio(); }, []);

  const remaining = OBJECTS.filter(o => !(o.id in sorted));

  function tapObj(o: Obj) {
    if (o.id in sorted) return;
    const isLast = Object.keys(sorted).length + 1 >= OBJECTS.length;
    setFeedback(o);
    speak(o.voice, 0.85, isLast ? () => setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 700) : undefined);
    setSorted(prev => ({ ...prev, [o.id]: o.material }));
    setTimeout(() => setFeedback(null), 1800);
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! A chair is made of wood. You are a material detective!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  const byMat = (m: Material) => OBJECTS.filter(o => sorted[o.id] === m);

  return (
    <div className="fixed inset-0 bg-slate-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'sort' && (
          <motion.div key="sort" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-slate-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-slate-600 text-sm uppercase tracking-widest mb-1">What is it made of?</p>
            <p className="text-center text-xs text-gray-400 font-bold mb-3">Tap each thing 🔍</p>

            {remaining.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {remaining.map(o => (
                  <motion.button key={o.id} whileTap={{ scale: 0.88 }} onClick={() => tapObj(o)}
                    className="flex flex-col items-center gap-0.5 p-2 bg-white rounded-2xl shadow-md border-2 border-gray-100 active:scale-95">
                    <span className="text-3xl">{o.emoji}</span>
                    <span className="text-[9px] font-black text-gray-400 uppercase">{o.name}</span>
                  </motion.button>
                ))}
              </div>
            )}

            <AnimatePresence>
              {feedback && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={cn('mb-3 p-2 rounded-2xl text-center text-sm font-bold', MAT_META[feedback.material].bg, MAT_META[feedback.material].color)}>
                  {feedback.emoji} {feedback.name} → {MAT_META[feedback.material].label}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Three material bins */}
            <div className="grid grid-cols-3 gap-2 flex-1">
              {(['wood', 'metal', 'plastic'] as Material[]).map(m => {
                const meta = MAT_META[m];
                return (
                  <div key={m} className={cn('rounded-2xl p-2 border-2', meta.bg, meta.border)}>
                    <p className={cn('text-[9px] font-black uppercase tracking-wide text-center mb-2', meta.color)}>{meta.emoji} {meta.label}</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {byMat(m).map(o => (
                        <motion.span key={o.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="text-2xl">{o.emoji}</motion.span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-slate-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🪑❓</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">What is a chair made of?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-slate-400 text-sm font-bold">
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
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-cyan-50 border-2 border-cyan-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🧴</span><span className="font-black text-cyan-700 text-xs uppercase">Plastic</span>
                </motion.button>
              </div>
            ) : (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🪑🪵</motion.div>
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
      <button onClick={onExit} className="self-start text-slate-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-slate-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🔍</div>
        <p className="font-display font-black text-slate-700 text-sm">Material Detective Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-slate-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🧴🪑🔑</p>
        <p className="font-black text-gray-700 text-base leading-snug">Find 3 things made of plastic at home. Then find something made of wood and something made of metal!</p>
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
