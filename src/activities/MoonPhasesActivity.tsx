// Activity: The Moon & its Phases — Age 11 (Band C11 · CAPS Gr 6)
//   Plan (predict) → Order the moon phases → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface MoonPhase { id: string; emoji: string; name: string; }
// Correct order, new → full
const PHASES: MoonPhase[] = [
  { id: 'new',      emoji: '🌑', name: 'New' },
  { id: 'crescent', emoji: '🌒', name: 'Crescent' },
  { id: 'half',     emoji: '🌓', name: 'Half' },
  { id: 'gibbous',  emoji: '🌔', name: 'Gibbous' },
  { id: 'full',     emoji: '🌕', name: 'Full' },
];
const SHUFFLED: MoonPhase[] = [PHASES[3], PHASES[0], PHASES[4], PHASES[1], PHASES[2]];

const OBJECTIVE_ID = 'eb.moon_phases';
const BADGE = 'Moon Watcher Badge 🌙';

const PLAN_VOICE = "The moon does not make its own light — it reflects sunlight. As the moon orbits the Earth, we see different amounts of its lit side. These shapes are called phases. Does the moon grow from a thin sliver to a full circle, or the other way? Predict!";
const TEST_VOICE = "Tap the moon phases in order, from the dark New Moon as it grows to the bright Full Moon.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Moon Watcher Badge! Look for the moon tonight, and again in a few nights. Notice how its shape changes. It takes about four weeks for the moon to go from new, to full, and back again.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function MoonPhasesActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [placed, setPlaced] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  function predict() { setPredicted(true); speak("Let's put the moon phases in order!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function tap(p: MoonPhase) {
    if (placed.includes(p.id)) return;
    const expected = PHASES[placed.length];
    if (p.id === expected.id) {
      const next = [...placed, p.id];
      setPlaced(next);
      speak(`${p.name} moon`, 0.95);
      if (next.length === PHASES.length) setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 900);
    } else {
      setShake(true); speak("Not next — the lit part grows a little each time.", 0.9);
      setTimeout(() => setShake(false), 500);
    }
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'reflects' && blank2 === 'orbits') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! The moon reflects the sun's light — it makes none of its own. We see phases because the moon orbits the Earth, showing us different amounts of its lit side. You are a Moon Watcher!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("The moon reflects sunlight, and we see phases as it orbits Earth. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-slate-800 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-slate-400 text-sm font-bold">← Back</button>
            <div className="bg-slate-700 rounded-3xl p-5 border-2 border-slate-600 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🌑🌓🌕</p>
              <p className="font-display font-black text-lg text-white leading-snug">Does the moon grow from a sliver to a full circle?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-slate-300 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-slate-700 border-2 border-slate-600 rounded-3xl active:scale-95"><span className="text-3xl">🌒</span><p className="font-black text-slate-200 text-[11px] uppercase mt-1">Grows</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-slate-700 border-2 border-slate-600 rounded-3xl active:scale-95"><span className="text-3xl">🌘</span><p className="font-black text-slate-200 text-[11px] uppercase mt-1">Shrinks</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🌙</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-4">
            <button onClick={onExit} className="self-start text-slate-400 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-white text-base">🌑 New → Full 🌕</p>
            {/* Placed so far */}
            <div className="flex items-center justify-center gap-2 flex-wrap w-full max-w-sm min-h-[56px]">
              {placed.map(id => {
                const p = PHASES.find(x => x.id === id)!;
                return (
                  <motion.div key={id} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                    <span className="text-3xl">{p.emoji}</span>
                  </motion.div>
                );
              })}
              {placed.length === 0 && <span className="text-slate-500 text-sm font-bold">Start with the New moon…</span>}
            </div>
            {/* Choices */}
            <motion.div animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="grid grid-cols-3 gap-3 w-full max-w-sm">
              {SHUFFLED.map(p => {
                const used = placed.includes(p.id);
                return (
                  <motion.button key={p.id} whileTap={{ scale: used ? 1 : 0.92 }} onClick={() => tap(p)} disabled={used}
                    className={`p-3 rounded-3xl border-2 active:scale-95 flex flex-col items-center gap-1 ${used ? 'bg-slate-700 border-slate-700 opacity-30' : 'bg-slate-700 border-slate-500'}`}>
                    <span className="text-4xl">{p.emoji}</span>
                    <p className="font-black text-slate-200 text-[10px] uppercase">{p.name}</p>
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-slate-400 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-white text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-slate-700 rounded-3xl p-5 border-2 border-slate-600 shadow-md">
              <p className="text-lg text-white font-bold leading-relaxed text-center">
                The moon{' '}
                <span className={`inline-block min-w-[60px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-slate-600 border-slate-400 text-white' : 'border-slate-500 text-slate-500'}`}>{blank1 ?? '____'}</span>{' '}
                the sun's light. We see phases because the moon{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-slate-600 border-slate-400 text-white' : 'border-slate-500 text-slate-500'}`}>{blank2 ?? '____'}</span>{' '}
                the Earth.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Blank 1 — the moon … sunlight</p>
              <div className="flex gap-2">{['reflects', 'makes'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-slate-300 text-slate-900 border-slate-300' : 'bg-slate-700 text-slate-200 border-slate-500'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Blank 2 — the moon … the Earth</p>
              <div className="flex gap-2">{['orbits', 'lights'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-slate-300 text-slate-900 border-slate-300' : 'bg-slate-700 text-slate-200 border-slate-500'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-indigo-500 shadow-[0_5px_0_#4338CA]' : 'bg-slate-600'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-slate-400 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌙</div>
        <p className="font-display font-black text-slate-200 text-sm">Moon Watcher Badge!</p>
      </motion.div>
      <div className="bg-slate-700 rounded-3xl p-5 shadow-xl border-2 border-slate-600 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌑🌓🌕</p>
        <p className="font-black text-slate-100 text-base leading-snug">Look for the moon tonight, and again in a few nights. Watch its shape change. New to full and back takes about four weeks!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#475569" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#A5B4FC" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-slate-200 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-indigo-600 shadow-[0_6px_0_#3730A3] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
