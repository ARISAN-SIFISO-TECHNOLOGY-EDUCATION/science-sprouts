// Reusable Age-4 (Band A4) activity engine — "Tap & Hear"
// 3-phase pattern (See → Do → Caregiver Card), shared by the three
// distinct Age-4 topics: Animal Babies, Float or Sink?, In the Sky.
//
// Age 4 = "Hands-on explore" — a step up from Age-3 sensory tapping,
// a step below Age-5 predict-test. No wrong answers; every tap names
// the thing aloud and reveals one tiny fact.
//
// DESIGN RULES (also the fix for the "too much text" review note):
//   • Child reads NOTHING — emoji + ONE-word label only; the voice carries meaning.
//   • Buttons ≥ 88px; positive voice on every tap.
//   • Orange theme = the A4 accent (see BandSelector).

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'see' | 'do' | 'card';

export interface TapItem {
  id: string;
  emoji: string;
  label: string;   // ONE word, shown small under the emoji
  voice: string;   // English voice line (the real content)
}

export interface CardPrompt { emoji: string; text: string; }

interface Props {
  onComplete: () => void;
  onExit: () => void;
  hero: string;          // big intro emoji
  introVoice: string;
  doPrompt: string;      // e.g. "Tap a baby animal!"
  items: TapItem[];
  cardVoice: string;
  cardText: string;      // one short caregiver sentence
  cardPrompts: CardPrompt[];
}

function useCountdown(seconds: number, onDone: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) { onDone(); return; }
    const id = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]); // eslint-disable-line react-hooks/exhaustive-deps
  return remaining;
}

export default function TapAndHear({
  onComplete, onExit, hero, introVoice, doPrompt, items, cardVoice, cardText, cardPrompts,
}: Props) {
  const [phase, setPhase]     = useState<Phase>('see');
  const [tapped, setTapped]   = useState<Set<string>>(new Set());
  const [glowing, setGlowing] = useState<string | null>(null);

  useEffect(() => {
    speak(introVoice);
    const t = setTimeout(() => setPhase('do'), 4000);
    return () => { clearTimeout(t); stopAudio(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function tapItem(item: TapItem) {
    const isLast = tapped.size + 1 >= items.length;
    // On the last tap, wait for the voice to finish before mounting the card,
    // so the card voice doesn't cancel it mid-sentence.
    speak(item.voice, 0.85, isLast ? () => setPhase('card') : undefined);
    setGlowing(item.id);
    setTapped(prev => new Set([...prev, item.id]));
    setTimeout(() => setGlowing(null), 900);
  }

  return (
    <div className="fixed inset-0 bg-orange-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── SEE ──────────────────────────────────────────────────────────── */}
        {phase === 'see' && (
          <motion.div key="see" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 text-center gap-6">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold">← Back</button>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-8xl">{hero}</motion.div>
            <button onClick={() => speak(introVoice)}
              className="flex items-center gap-2 bg-white rounded-full px-5 py-3 shadow-md border-2 border-orange-100 text-orange-500 font-black">
              <Volume2 size={20} /> Listen
            </button>
          </motion.div>
        )}

        {/* ── DO ───────────────────────────────────────────────────────────── */}
        {phase === 'do' && (
          <motion.div key="do" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold mb-3">← Back</button>

            <div className="flex justify-center gap-2 mb-4">
              {items.map(it => (
                <div key={it.id} className={`w-3 h-3 rounded-full transition-all ${tapped.has(it.id) ? 'bg-orange-400' : 'bg-orange-100'}`} />
              ))}
            </div>

            <p className="text-center text-orange-500 font-black text-sm uppercase tracking-widest mb-4">{doPrompt}</p>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {items.map(item => {
                const done = tapped.has(item.id);
                const glow = glowing === item.id;
                return (
                  <motion.button
                    key={item.id}
                    animate={glow ? { scale: [1, 1.15, 0.95, 1] } : {}}
                    transition={{ duration: 0.4 }}
                    onClick={() => tapItem(item)}
                    className="flex flex-col items-center justify-center gap-2 rounded-3xl min-h-[88px] transition-all active:scale-95 shadow-md"
                    style={{
                      background: done ? '#FB923C' : '#FFFFFF',
                      border: done ? '3px solid #F97316' : '3px solid #FED7AA',
                    }}
                  >
                    <span className="text-5xl">{item.emoji}</span>
                    <span className={`text-xs font-black uppercase tracking-wide ${done ? 'text-white' : 'text-orange-400'}`}>{item.label}</span>
                    {done && <span className="text-white text-xl">✓</span>}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── CAREGIVER CARD ───────────────────────────────────────────────── */}
        {phase === 'card' && (
          <CaregiverCard onComplete={onComplete} onExit={onExit}
            voice={cardVoice} text={cardText} prompts={cardPrompts} />
        )}

      </AnimatePresence>
    </div>
  );
}

function CaregiverCard({
  onComplete, onExit, voice, text, prompts,
}: { onComplete: () => void; onExit: () => void; voice: string; text: string; prompts: CardPrompt[]; }) {
  const remaining = useCountdown(90, onComplete);
  const pct = (remaining / 90) * 100;
  useEffect(() => {
    const t = setTimeout(() => speak(voice), 400);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div key="card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full p-6 items-center">
      <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold mb-4">← Back</button>

      <div className="bg-orange-100 border-2 border-orange-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-4">
        <span className="text-lg">👨‍👩‍👧</span>
        <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Now try at home!</span>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-orange-200 w-full max-w-xs mb-5 text-center">
        <p className="text-4xl mb-3">{prompts.map(p => p.emoji).join('')}</p>
        <p className="font-black text-gray-700 text-base leading-snug">{text}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full max-w-xs mb-5">
        {prompts.map(p => (
          <div key={p.text} className="bg-orange-50 rounded-2xl p-3 text-center border-2 border-orange-100">
            <span className="text-3xl">{p.emoji}</span>
            <p className="text-[10px] font-black text-orange-600 uppercase mt-1 leading-tight">{p.text}</p>
          </div>
        ))}
      </div>

      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FFEDD5" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FB923C" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-orange-500 text-sm">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</span>
        </div>
      </div>

      <button onClick={onComplete}
        className="px-10 py-4 bg-orange-400 shadow-[0_6px_0_#FB923C] text-white font-display font-black text-xl rounded-3xl btn-press">
        🌱 All done!
      </button>
    </motion.div>
  );
}
