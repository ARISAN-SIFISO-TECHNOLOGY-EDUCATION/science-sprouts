// Activity: Galaxies & the Scale of Space — Age 12 (Band C12 · CAPS Gr 7)
//   Plan (predict) → Order objects from smallest to largest → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Step { id: string; emoji: string; name: string; }
// Correct order: smallest → largest
const STEPS: Step[] = [
  { id: 'moon',   emoji: '🌙', name: 'The Moon' },
  { id: 'earth',  emoji: '🌍', name: 'Earth' },
  { id: 'sun',    emoji: '☀️', name: 'The Sun' },
  { id: 'solar',  emoji: '🪐', name: 'Solar System' },
  { id: 'galaxy', emoji: '🌌', name: 'The Galaxy' },
];
const SHUFFLED: Step[] = [STEPS[2], STEPS[4], STEPS[0], STEPS[3], STEPS[1]];

const OBJECTIVE_ID = 'eb.galaxies';
const BADGE = 'Cosmic Explorer Badge 🌌';

const PLAN_VOICE = "Space is built in layers, from small to almost unimaginably huge. The Moon orbits the Earth. The Earth orbits the Sun. The Sun and its planets make the Solar System. And billions of stars together make a galaxy. Is a galaxy bigger than our whole Solar System? Predict!";
const TEST_VOICE = "Tap the objects in order, from the smallest all the way up to the largest.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Cosmic Explorer Badge! Our galaxy is the Milky Way. On a very dark night, far from city lights, you can sometimes see it as a faint band of light across the sky — that glow is billions of distant stars, all in our own galaxy.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function GalaxiesActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [placed, setPlaced] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  function predict() { setPredicted(true); speak("Let's order space from small to huge!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function tap(s: Step) {
    if (placed.includes(s.id)) return;
    const expected = STEPS[placed.length];
    if (s.id === expected.id) {
      const next = [...placed, s.id];
      setPlaced(next);
      speak(s.name, 0.95);
      if (next.length === STEPS.length) setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 900);
    } else {
      setShake(true); speak("Not yet — what is the next biggest?", 0.9);
      setTimeout(() => setShake(false), 500);
    }
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'galaxy' && blank2 === 'stars') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! The biggest of them all is the galaxy, made of billions of stars. Our Solar System is just one tiny part of our galaxy, the Milky Way. You are a Cosmic Explorer!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("The galaxy is the biggest, and it is made of billions of stars. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-slate-900 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-indigo-300 text-sm font-bold">← Back</button>
            <div className="bg-slate-800 rounded-3xl p-5 border-2 border-indigo-500/40 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🌙🌍🌌</p>
              <p className="font-display font-black text-lg text-white leading-snug">Is a galaxy bigger than our whole Solar System?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-indigo-300 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-slate-800 border-2 border-indigo-500/40 rounded-3xl active:scale-95"><span className="text-3xl">🪐</span><p className="font-black text-indigo-200 text-[11px] uppercase mt-1">Same / smaller</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-slate-800 border-2 border-indigo-500/40 rounded-3xl active:scale-95"><span className="text-3xl">🌌</span><p className="font-black text-indigo-200 text-[11px] uppercase mt-1">Much bigger</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🌌</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-4">
            <button onClick={onExit} className="self-start text-indigo-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-indigo-200 text-base">🌙 Small → Huge 🌌</p>
            <div className="flex items-center justify-center gap-1 flex-wrap w-full max-w-sm min-h-[56px]">
              {placed.map((id, i) => {
                const s = STEPS.find(x => x.id === id)!;
                return (
                  <React.Fragment key={id}>
                    {i > 0 && <span className="text-indigo-400 font-black">→</span>}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                      <span className="text-2xl">{s.emoji}</span>
                    </motion.div>
                  </React.Fragment>
                );
              })}
              {placed.length === 0 && <span className="text-indigo-400 text-sm font-bold">Start with the smallest…</span>}
            </div>
            <motion.div animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="grid grid-cols-3 gap-3 w-full max-w-sm">
              {SHUFFLED.map(s => {
                const used = placed.includes(s.id);
                return (
                  <motion.button key={s.id} whileTap={{ scale: used ? 1 : 0.92 }} onClick={() => tap(s)} disabled={used}
                    className={`p-3 rounded-3xl border-2 active:scale-95 flex flex-col items-center gap-1 ${used ? 'bg-slate-800 border-slate-700 opacity-40' : 'bg-slate-800 border-indigo-500/40'}`}>
                    <span className="text-3xl">{s.emoji}</span>
                    <p className="font-black text-indigo-200 text-[9px] uppercase text-center leading-tight">{s.name}</p>
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-indigo-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-indigo-200 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-slate-800 rounded-3xl p-5 border-2 border-indigo-500/40 shadow-md">
              <p className="text-lg text-white font-bold leading-relaxed text-center">
                The largest of them all is the{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-indigo-500/30 border-indigo-400 text-indigo-100' : 'border-indigo-500/40 text-indigo-400'}`}>{blank1 ?? '____'}</span>,
                which is made of billions of{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-indigo-500/30 border-indigo-400 text-indigo-100' : 'border-indigo-500/40 text-indigo-400'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Blank 1 — the largest is the…</p>
              <div className="flex gap-2">{['galaxy', 'planet'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-slate-800 text-indigo-200 border-indigo-500/40'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Blank 2 — made of billions of…</p>
              <div className="flex gap-2">{['stars', 'moons'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-slate-800 text-indigo-200 border-indigo-500/40'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-indigo-500 shadow-[0_5px_0_#4338CA]' : 'bg-slate-700'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-indigo-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌌</div>
        <p className="font-display font-black text-indigo-200 text-sm">Cosmic Explorer Badge!</p>
      </motion.div>
      <div className="bg-slate-800 rounded-3xl p-5 shadow-xl border-2 border-indigo-500/40 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌌✨🔭</p>
        <p className="font-black text-indigo-100 text-base leading-snug">Our galaxy is the Milky Way. On a very dark night you can see it as a faint band of light — billions of distant stars in our own galaxy!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#312E81" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#818CF8" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-indigo-200 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-indigo-500 shadow-[0_6px_0_#3730A3] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
