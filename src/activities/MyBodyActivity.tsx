// Activity: My Body — Ages 3–4 (Band A3 + A4)
// 3S Pattern: See → Do → Caregiver Card
//
// See  (5s):  Animated body with intro voice
// Do   (30s): Tap 6 body parts — each bounces + voice names it
// Card (60s): Caregiver prompt to do it in the real world
//
// DESIGN RULES:
//   • No wrong answers — every tap = "Great noticing!"
//   • Buttons ≥ 80px tall
//   • No reading required for child — emoji + caregiver reads
//   • Positive voice on every interaction

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'see' | 'do' | 'card';

interface BodyPart {
  id: string;
  emoji: string;
  label: string;
  action: string;          // short action prompt shown in card
  voice: string;           // English voice line
}

const BODY_PARTS: BodyPart[] = [
  { id: 'head',  emoji: '🧠', label: 'HEAD',   action: 'Touch your HEAD',   voice: 'Head! That is where your brain lives! Touch your head!' },
  { id: 'eyes',  emoji: '👀', label: 'EYES',   action: 'Point to your EYES', voice: 'Eyes! We use our eyes to see beautiful things!' },
  { id: 'mouth', emoji: '👄', label: 'MOUTH',  action: 'Open your MOUTH',    voice: 'Mouth! We use our mouth to eat yummy food and talk!' },
  { id: 'hands', emoji: '🙌', label: 'HANDS',  action: 'Clap your HANDS',    voice: 'Hands! Clap your hands! Well done!' },
  { id: 'tummy', emoji: '🫃', label: 'TUMMY',  action: 'Rub your TUMMY',     voice: 'Tummy! Rub your tummy — that is where your food goes!' },
  { id: 'feet',  emoji: '🦶', label: 'FEET',   action: 'Stomp your FEET',    voice: 'Feet! Stomp your feet! We use our feet to walk and jump!' },
];

const SEE_VOICE = "Look at this body! Let us find the parts together. Tap each one!";
const CARD_VOICE = "Now try at home! Touch your nose. Touch mummy's nose. Touch daddy's nose!";

function useCountdown(seconds: number, onDone: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) { onDone(); return; }
    const id = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]); // eslint-disable-line react-hooks/exhaustive-deps
  return remaining;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function MyBodyActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]     = useState<Phase>('see');
  const [tapped, setTapped]   = useState<Set<string>>(new Set());
  const [glowing, setGlowing] = useState<string | null>(null);

  useEffect(() => {
    speak(SEE_VOICE);
    const t = setTimeout(() => setPhase('do'), 4000);
    return () => { clearTimeout(t); stopAudio(); };
  }, []);

  function tapPart(part: BodyPart) {
    const isLast = tapped.size + 1 >= BODY_PARTS.length;

    // For the last tap, wait until the voice finishes before advancing.
    // Using onEnd instead of a fixed setTimeout prevents the CaregiverCard
    // from mounting mid-sentence and cancelling the speech.
    speak(part.voice, 0.85, isLast ? () => setPhase('card') : undefined);

    setGlowing(part.id);
    setTapped(prev => new Set([...prev, part.id]));
    setTimeout(() => setGlowing(null), 900);
  }

  return (
    <div className="fixed inset-0 bg-rose-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── SEE phase ──────────────────────────────────────────────────── */}
        {phase === 'see' && (
          <motion.div key="see" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 text-center gap-6">
            <button onClick={onExit} className="self-start text-rose-300 text-sm font-bold">← Back</button>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-8xl">🧒</motion.div>
            <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-rose-100 max-w-xs">
              <p className="text-rose-700 text-lg font-black leading-snug">{SEE_VOICE}</p>
            </div>
          </motion.div>
        )}

        {/* ── DO phase ───────────────────────────────────────────────────── */}
        {phase === 'do' && (
          <motion.div key="do" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-rose-300 text-sm font-bold mb-3">← Back</button>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-4">
              {BODY_PARTS.map(p => (
                <div key={p.id} className={`w-3 h-3 rounded-full transition-all ${tapped.has(p.id) ? 'bg-rose-400' : 'bg-rose-100'}`} />
              ))}
            </div>

            <p className="text-center text-rose-500 font-black text-sm uppercase tracking-widest mb-4">
              Tap a body part!
            </p>

            {/* 2-column grid of big tap buttons */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              {BODY_PARTS.map(part => {
                const done = tapped.has(part.id);
                const glow = glowing === part.id;
                return (
                  <motion.button
                    key={part.id}
                    animate={glow ? { scale: [1, 1.15, 0.95, 1] } : {}}
                    transition={{ duration: 0.4 }}
                    onClick={() => tapPart(part)}
                    className={`
                      flex flex-col items-center justify-center gap-2 rounded-3xl
                      min-h-[88px] border-3 transition-all active:scale-95
                      ${done
                        ? 'bg-rose-400 border-rose-500 shadow-[0_4px_0_#FB7185]'
                        : 'bg-white border-rose-200 shadow-md hover:border-rose-300'}
                    `}
                    style={{ border: done ? '3px solid #FB7185' : '3px solid #FECDD3' }}
                  >
                    <span className="text-5xl">{part.emoji}</span>
                    <span className={`text-xs font-black uppercase tracking-wide ${done ? 'text-white' : 'text-rose-400'}`}>
                      {part.label}
                    </span>
                    {done && <span className="text-white text-xl">✓</span>}
                  </motion.button>
                );
              })}
            </div>

            {/* Voice replay */}
            <button onClick={() => speak(SEE_VOICE)} className="flex items-center gap-2 mx-auto mt-4 text-rose-400 text-sm font-bold">
              <Volume2 size={16} /> Hear it again
            </button>
          </motion.div>
        )}

        {/* ── CAREGIVER CARD ─────────────────────────────────────────────── */}
        {phase === 'card' && (
          <CaregiverCard onComplete={onComplete} onExit={onExit} />
        )}

      </AnimatePresence>
    </div>
  );
}

function CaregiverCard({ onComplete, onExit }: { onComplete: () => void; onExit: () => void }) {
  const remaining = useCountdown(90, onComplete);
  const pct = (remaining / 90) * 100;
  // Small delay so the AnimatePresence enter transition finishes
  // before starting the card voice — prevents any overlap.
  useEffect(() => {
    const t = setTimeout(() => speak(CARD_VOICE), 400);
    return () => clearTimeout(t);
  }, []);

  const PROMPTS = [
    { emoji: '👃', text: 'Touch your NOSE' },
    { emoji: '👂', text: 'Touch your EAR' },
    { emoji: '👆', text: 'Point to your FINGER' },
    { emoji: '🦵', text: 'Tap your KNEE' },
  ];

  return (
    <motion.div key="card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full p-6 items-center">
      <button onClick={onExit} className="self-start text-rose-300 text-sm font-bold mb-4">← Back</button>

      {/* Caregiver badge */}
      <div className="bg-rose-100 border-2 border-rose-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-4">
        <span className="text-lg">👨‍👩‍👧</span>
        <span className="text-xs font-black text-rose-600 uppercase tracking-widest">Now try at home!</span>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-rose-200 w-full max-w-xs mb-5 text-center">
        <p className="text-4xl mb-3">🧒🤝👨‍👩‍👧</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          Take turns pointing to body parts on each other! Say the name out loud.
        </p>
      </div>

      {/* Prompt cards */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-xs mb-5">
        {PROMPTS.map(p => (
          <div key={p.text} className="bg-rose-50 rounded-2xl p-3 text-center border-2 border-rose-100">
            <span className="text-3xl">{p.emoji}</span>
            <p className="text-[10px] font-black text-rose-600 uppercase mt-1 leading-tight">{p.text}</p>
          </div>
        ))}
      </div>

      {/* Timer */}
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FFE4E6" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FB7185" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-rose-500 text-sm">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</span>
        </div>
      </div>

      <button onClick={onComplete}
        className="px-10 py-4 bg-rose-400 shadow-[0_6px_0_#FB7185] text-white font-display font-black text-xl rounded-3xl btn-press">
        🌱 All done!
      </button>
    </motion.div>
  );
}
