// Activity: 5 Senses — Age 5 (Band A5)
// Pattern: See → Predict → Do → Caregiver Card
//
// See    (8s):   All 5 senses shown with voice intro + big word labels
// Predict (30s): 2-choice questions — "Which sense do we use to SMELL?"
// Do     (60s):  Tap each sense organ — voice names it + big word label appears
// Card  (120s):  "Close your eyes. Can you hear 3 sounds?"
//
// Age 5 rules: big word labels + voice, 2 choices max, always positive

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'see' | 'predict' | 'do' | 'card';

// ── Data ─────────────────────────────────────────────────────────────────────

interface Sense {
  id: string;
  organ: string;   // emoji for the sense organ
  label: string;   // e.g. "EYES"
  action: string;  // e.g. "SEE"
  example: string; // emoji of something perceived by this sense
  voice: string;
  color: string;
  bg: string;
  border: string;
}

const SENSES: Sense[] = [
  { id: 'sight',   organ: '👀', label: 'EYES',  action: 'SEE',   example: '🌈', voice: 'We use our EYES to SEE! Look around — what beautiful things can you see?', color: 'text-sky-700',    bg: 'bg-sky-50',    border: 'border-sky-200'    },
  { id: 'hearing', organ: '👂', label: 'EARS',  action: 'HEAR',  example: '🎵', voice: 'We use our EARS to HEAR! Listen carefully — what sounds can you hear right now?', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
  { id: 'smell',   organ: '👃', label: 'NOSE',  action: 'SMELL', example: '🌸', voice: 'We use our NOSE to SMELL! Can you smell something nice near you?', color: 'text-pink-700',   bg: 'bg-pink-50',   border: 'border-pink-200'   },
  { id: 'taste',   organ: '👄', label: 'MOUTH', action: 'TASTE', example: '🍎', voice: 'We use our MOUTH to TASTE! Is your food sweet, salty, or sour?', color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200'    },
  { id: 'touch',   organ: '🤲', label: 'HANDS', action: 'TOUCH', example: '🪨', voice: 'We use our HANDS to TOUCH! Touch something near you — is it smooth or rough?', color: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-200'  },
];

interface PredictQ {
  question: string;
  voice: string;
  target: string;      // sense ID of the correct answer
  options: string[];   // 2 sense IDs to show as choices
}

const PREDICT_QS: PredictQ[] = [
  { question: 'Which sense do we use to\nSMELL a flower? 🌸',    voice: 'Which sense do we use to smell a flower?', target: 'smell',   options: ['sight', 'smell'] },
  { question: 'Which sense do we use to\nHEAR music? 🎵',        voice: 'Which sense do we use to hear music?',     target: 'hearing', options: ['hearing', 'touch'] },
  { question: 'Which sense do we use to\nTASTE food? 🍎',        voice: 'Which sense do we use to taste food?',     target: 'taste',   options: ['taste', 'sight'] },
];

const SEE_VOICE  = "We have FIVE senses that help us learn about the world! Eyes, ears, nose, mouth, and hands. Tap each one to find out more!";
const CARD_VOICE = "Now try at home! Close your eyes. Can you hear three different sounds? Listen carefully!";

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

export default function FiveSensesActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]       = useState<Phase>('see');
  const [qIdx, setQIdx]         = useState(0);
  const [tapped, setTapped]     = useState<Set<string>>(new Set());
  const [glowing, setGlowing]   = useState<string | null>(null);
  const [wordLabel, setWordLabel] = useState<{ organ: string; action: string } | null>(null);

  useEffect(() => {
    speak(SEE_VOICE);
    const t = setTimeout(() => setPhase('predict'), 7000);
    return () => { clearTimeout(t); stopAudio(); };
  }, []);

  // ── PREDICT phase ─────────────────────────────────────────────────────────

  function answerQ(senseId: string) {
    const q = PREDICT_QS[qIdx];
    const correct = senseId === q.target;
    const sense = SENSES.find(s => s.id === senseId)!;
    const msg = correct
      ? `Yes! We use our ${sense.label} to ${sense.action}! Great thinking!`
      : `Let's find out! We use our ${SENSES.find(s => s.id === q.target)!.label} to ${SENSES.find(s => s.id === q.target)!.action}!`;
    speak(msg);

    setTimeout(() => {
      if (qIdx + 1 >= PREDICT_QS.length) {
        setPhase('do');
      } else {
        setQIdx(i => i + 1);
      }
    }, 2200);
  }

  // ── DO phase ──────────────────────────────────────────────────────────────

  function tapSense(sense: Sense) {
    const isLast = tapped.size + 1 >= SENSES.length;
    speak(sense.voice, 0.85, isLast ? () => setPhase('card') : undefined);
    setGlowing(sense.id);
    setWordLabel({ organ: sense.label, action: sense.action });
    setTapped(prev => new Set([...prev, sense.id]));
    setTimeout(() => { setGlowing(null); setWordLabel(null); }, 1800);
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-emerald-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── SEE ───────────────────────────────────────────────────────── */}
        {phase === 'see' && (
          <motion.div key="see" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 gap-5">
            <button onClick={onExit} className="self-start text-emerald-300 text-sm font-bold">← Back</button>
            <p className="font-display font-black text-3xl text-emerald-700 text-center">5 SENSES 🌟</p>
            <div className="flex gap-3 flex-wrap justify-center">
              {SENSES.map((s, i) => (
                <motion.div key={s.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.15, type: 'spring' }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 ${s.bg} ${s.border}`}>
                  <span className="text-4xl">{s.organ}</span>
                  <span className={`text-xs font-black uppercase ${s.color}`}>{s.label}</span>
                </motion.div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-emerald-100 text-center max-w-xs">
              <p className="font-bold text-gray-700 text-base leading-snug">{SEE_VOICE}</p>
              <button onClick={() => speak(SEE_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-emerald-400 text-sm font-bold">
                <Volume2 size={14} /> Again
              </button>
            </div>
          </motion.div>
        )}

        {/* ── PREDICT ───────────────────────────────────────────────────── */}
        {phase === 'predict' && (
          <motion.div key={`predict-${qIdx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="flex flex-col h-full p-6">
            <button onClick={onExit} className="self-start text-emerald-300 text-sm font-bold mb-4">← Back</button>

            {/* Progress */}
            <div className="flex justify-center gap-2 mb-6">
              {PREDICT_QS.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full transition-all ${i <= qIdx ? 'bg-emerald-400' : 'bg-emerald-100'}`} />
              ))}
            </div>

            <div className="bg-white rounded-3xl p-5 border-2 border-emerald-100 shadow-md mb-6 text-center flex-shrink-0">
              <p className="font-display font-black text-xl text-gray-800 leading-snug whitespace-pre-line">
                {PREDICT_QS[qIdx].question}
              </p>
              <button onClick={() => speak(PREDICT_QS[qIdx].voice)} className="mt-2 flex items-center gap-1 mx-auto text-emerald-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>

            {/* 2 choices */}
            <div className="flex gap-4 justify-center flex-1 items-center">
              {PREDICT_QS[qIdx].options.map(sId => {
                const s = SENSES.find(x => x.id === sId)!;
                return (
                  <motion.button key={sId} whileTap={{ scale: 0.92 }} onClick={() => answerQ(sId)}
                    className={`flex flex-col items-center gap-3 p-5 rounded-3xl border-3 shadow-md
                                min-w-[120px] min-h-[140px] justify-center active:scale-95 ${s.bg} ${s.border}`}
                    style={{ border: `3px solid` }}>
                    <span className="text-6xl">{s.organ}</span>
                    <span className={`font-display font-black text-lg uppercase ${s.color}`}>{s.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── DO ────────────────────────────────────────────────────────── */}
        {phase === 'do' && (
          <motion.div key="do" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-emerald-300 text-sm font-bold mb-3">← Back</button>

            <p className="text-center font-display font-black text-emerald-600 text-sm uppercase tracking-widest mb-4">
              Tap each sense!
            </p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-4">
              {SENSES.map(s => (
                <div key={s.id} className={`w-3 h-3 rounded-full ${tapped.has(s.id) ? 'bg-emerald-400' : 'bg-emerald-100'}`} />
              ))}
            </div>

            {/* Big word label overlay */}
            <AnimatePresence>
              {wordLabel && (
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }}
                  className="absolute inset-x-6 top-28 z-10 bg-emerald-500 rounded-3xl p-4 text-center shadow-xl">
                  <p className="font-display font-black text-5xl text-white">{wordLabel.organ}</p>
                  <p className="font-display font-black text-3xl text-emerald-100 mt-1">we {wordLabel.action}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sense organ grid */}
            <div className="grid grid-cols-3 gap-3 flex-1 content-center">
              {SENSES.map(sense => {
                const done = tapped.has(sense.id);
                const glow = glowing === sense.id;
                return (
                  <motion.button
                    key={sense.id}
                    animate={glow ? { scale: [1, 1.18, 0.95, 1] } : {}}
                    transition={{ duration: 0.4 }}
                    onClick={() => tapSense(sense)}
                    className={`flex flex-col items-center justify-center gap-2 rounded-3xl min-h-[90px]
                                border-2 transition-all active:scale-95
                                ${done ? `${sense.bg} ${sense.border}` : 'bg-white border-gray-100 shadow-sm'}`}
                  >
                    <span className="text-5xl">{sense.organ}</span>
                    <span className={`text-xs font-black uppercase ${done ? sense.color : 'text-gray-300'}`}>
                      {sense.label}
                    </span>
                    {done && <span className="text-emerald-500 text-sm font-black">✓</span>}
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
      <button onClick={onExit} className="self-start text-emerald-300 text-sm font-bold mb-4">← Back</button>
      <div className="bg-emerald-100 border-2 border-emerald-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-4">
        <span>👨‍👩‍👧</span><span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Caregiver Mission!</span>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-emerald-200 w-full max-w-xs mb-5 text-center">
        <p className="text-4xl mb-3">👂🤫✨</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          Close your eyes together. Stay very still. Can you hear THREE different sounds? Count them on your fingers!
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2 mb-5 w-full max-w-xs">
        {SENSES.map(s => (
          <div key={s.id} className={`flex flex-col items-center gap-1 p-2 rounded-2xl ${s.bg} border ${s.border}`}>
            <span className="text-2xl">{s.organ}</span>
            <span className={`text-[8px] font-black uppercase ${s.color}`}>{s.action}</span>
          </div>
        ))}
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D1FAE5" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10B981" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-emerald-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span>
        </div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-emerald-500 shadow-[0_6px_0_#059669] text-white font-display font-black text-xl rounded-3xl btn-press">
        🌱 All done!
      </button>
    </motion.div>
  );
}
