// Activity: Food Chains — Energy & Consequence — Age 8 (Band B8)
// Intermediate Phase Gr 3 — cause & effect / ecosystem thinking:
//   Plan (predict) → Build the chain in order → Remove the sun (consequence)
//   → Conclude (fill-in-the-blanks) → Apply (caregiver card)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'build' | 'consequence' | 'conclude' | 'card';

interface Link { id: string; emoji: string; name: string; dead: string; }

// Correct order: energy flows sun → producer → herbivore → carnivore
const CHAIN: Link[] = [
  { id: 'sun',    emoji: '☀️', name: 'Sun',    dead: '☀️' },
  { id: 'grass',  emoji: '🌱', name: 'Grass',  dead: '🥀' },
  { id: 'rabbit', emoji: '🐰', name: 'Rabbit', dead: '😵' },
  { id: 'fox',    emoji: '🦊', name: 'Fox',    dead: '😵' },
];
const SHUFFLED = ['rabbit', 'sun', 'fox', 'grass']; // fixed scramble for repeatability

const OBJECTIVE_ID = 'll.food_chains_b8';
const BADGE = 'Ecosystem Explorer Badge 🌍';

const PLAN_VOICE  = "Every food chain starts with energy from the sun. What do you think happens if we remove the sun?";
const BUILD_VOICE = "Build the food chain in order. Tap them so energy flows from the sun to the fox.";
const CONS_VOICE  = "Now tap the sun to remove it. Watch what happens to the whole chain!";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE  = "You earned the Ecosystem Explorer Badge! At home: make a food chain using four living things you saw outside today.";

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

export default function FoodChainsInvestigateActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [placed, setPlaced] = useState<string[]>([]); // ids in chosen order
  const [shake, setShake] = useState(false);
  const [sunRemoved, setSunRemoved] = useState(false);
  const [collapsed, setCollapsed] = useState(0); // how many links have died

  // Conclusion builder
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  function predict() {
    setPredicted(true);
    speak("Good thinking! Let's build the chain first, then find out.", 0.9, () => {
      setPhase('build'); setTimeout(() => speak(BUILD_VOICE), 300);
    });
  }

  function place(id: string) {
    const nextNeeded = CHAIN[placed.length].id;
    if (id !== nextNeeded) { setShake(true); speak("Energy flows from the sun first. Try the order again!", 0.95); setTimeout(() => setShake(false), 500); return; }
    const next = [...placed, id];
    setPlaced(next);
    const link = CHAIN.find(c => c.id === id)!;
    if (next.length >= CHAIN.length) {
      speak("The chain is complete! Sun feeds grass, grass feeds rabbit, rabbit feeds fox.", 0.9, () => { setPhase('consequence'); setTimeout(() => speak(CONS_VOICE), 300); });
    } else {
      speak(link.name, 1.0);
    }
  }

  function removeSun() {
    if (sunRemoved) return;
    setSunRemoved(true);
    speak("No sun! Now the grass cannot grow...", 0.9, undefined);
    // collapse links one by one
    [1, 2, 3].forEach((linkIdx, i) => {
      setTimeout(() => {
        setCollapsed(linkIdx);
        if (linkIdx === 3) {
          setTimeout(() => speak("Without the sun, the grass dies, then the rabbit, then the fox. The whole chain breaks!", 0.85, () => setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 500)), 600);
        }
      }, 900 + i * 900);
    });
  }

  function checkConclusion() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'sun' && blank2 === 'breaks') {
      setResult('correct');
      awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! A food chain starts with energy from the sun. Remove it and the whole chain breaks. You are an Ecosystem Explorer!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else {
      setResult('wrong');
      speak("Not quite. Remember what happened when the sun was removed. Try again.", 0.9, undefined);
      setTimeout(() => setResult('idle'), 1600);
    }
  }

  const pool = SHUFFLED.filter(id => !placed.includes(id));

  return (
    <div className="fixed inset-0 bg-lime-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── PLAN ─────────────────────────────────────────────── */}
        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-lime-400 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-lime-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-lime-600 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">☀️🌱🐰🦊</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Every food chain starts with energy from the Sun.</p>
              <p className="text-sm text-gray-500 mt-2 leading-snug">What happens if we <b>remove the sun</b>?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-lime-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-lime-200 rounded-3xl active:scale-95">
                  <span className="text-3xl">✅</span><p className="font-black text-lime-700 text-[11px] uppercase mt-1">Chain is fine</p>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-lime-200 rounded-3xl active:scale-95">
                  <span className="text-3xl">💥</span><p className="font-black text-lime-700 text-[11px] uppercase mt-1">Chain breaks</p>
                </motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🤔</motion.div>}
          </motion.div>
        )}

        {/* ── BUILD ────────────────────────────────────────────── */}
        {phase === 'build' && (
          <motion.div key="build" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-lime-400 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-lime-700 text-base mb-1">Build the chain</p>
            <p className="text-center text-xs text-lime-500 font-bold mb-3">Tap in order — energy flows from ☀️ to 🦊</p>

            {/* chain slots */}
            <motion.div animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}
              className="flex items-center justify-center gap-1 flex-wrap mb-5">
              {CHAIN.map((c, i) => {
                const done = placed.includes(c.id);
                return (
                  <React.Fragment key={c.id}>
                    {i > 0 && <span className="text-lime-300 font-black text-lg">→</span>}
                    <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl ${done ? 'bg-lime-100 border-lime-300' : 'bg-white border-dashed border-gray-200'}`}>
                      {done ? c.emoji : <span className="text-gray-200 text-base font-black">{i + 1}</span>}
                    </div>
                  </React.Fragment>
                );
              })}
            </motion.div>

            <p className="text-center text-[10px] font-black text-gray-400 uppercase mb-2">Tap the next link</p>
            <div className="grid grid-cols-2 gap-3 px-2">
              {pool.map(id => {
                const c = CHAIN.find(x => x.id === id)!;
                return (
                  <motion.button key={id} whileTap={{ scale: 0.92 }} onClick={() => place(id)}
                    className="flex items-center gap-2 p-3 bg-white border-2 border-lime-200 rounded-2xl shadow-sm active:scale-95">
                    <span className="text-3xl">{c.emoji}</span>
                    <span className="font-black text-lime-700 text-sm uppercase">{c.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── CONSEQUENCE ──────────────────────────────────────── */}
        {phase === 'consequence' && (
          <motion.div key="cons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-5 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-lime-400 text-sm font-bold">← Back</button>
            <p className="font-display font-black text-lime-700 text-base text-center">
              {sunRemoved ? 'The chain reacts…' : 'Tap the ☀️ Sun to remove it'}
            </p>

            <div className="flex items-center justify-center gap-1 flex-wrap">
              {CHAIN.map((c, i) => {
                // index 0 = sun; links 1..3 collapse after sun removed
                const isSun = c.id === 'sun';
                const dead = sunRemoved && (isSun || i <= collapsed);
                return (
                  <React.Fragment key={c.id}>
                    {i > 0 && <span className={`font-black text-lg ${dead ? 'text-red-300' : 'text-lime-300'}`}>→</span>}
                    <motion.button
                      onClick={isSun ? removeSun : undefined}
                      disabled={!isSun || sunRemoved}
                      animate={dead ? { scale: [1, 1.25, 0.9], rotate: [0, -8, 8, 0] } : {}}
                      className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl transition-colors
                        ${isSun && !sunRemoved ? 'bg-amber-100 border-amber-400 animate-pulse' : dead ? 'bg-red-50 border-red-200' : 'bg-lime-100 border-lime-300'}`}>
                      {dead ? c.dead : c.emoji}
                    </motion.button>
                  </React.Fragment>
                );
              })}
            </div>

            {sunRemoved && collapsed >= 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-4 border-2 border-red-100 text-center max-w-xs">
                <p className="text-3xl mb-1">💥</p>
                <p className="font-black text-gray-700 text-sm leading-snug">No sun → no grass → no rabbit → no fox. The whole chain breaks!</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── CONCLUDE ─────────────────────────────────────────── */}
        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-lime-400 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-lime-700 text-base">✍️ My Conclusion</p>

            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-5 border-2 border-lime-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                A food chain starts with energy from the{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-lime-100 border-lime-400 text-lime-700' : 'border-lime-200 text-lime-300'}`}>{blank1 ?? '____'}</span>.
                If it is removed, the whole chain{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-lime-100 border-lime-400 text-lime-700' : 'border-lime-200 text-lime-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>

            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">
                {['sun', 'water'].map(w => (
                  <button key={w} onClick={() => setBlank1(w)}
                    className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-lime-500 text-white border-lime-500' : 'bg-white text-lime-700 border-lime-200'}`}>{w}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">
                {['breaks', 'grows'].map(w => (
                  <button key={w} onClick={() => setBlank2(w)}
                    className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-lime-500 text-white border-lime-500' : 'bg-white text-lime-700 border-lime-200'}`}>{w}</button>
                ))}
              </div>
            </div>

            <button onClick={checkConclusion} disabled={!blank1 || !blank2 || result === 'correct'}
              className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-lime-500 shadow-[0_5px_0_#65A30D]' : 'bg-gray-300'}`}>
              {result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}
            </button>
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
      <button onClick={onExit} className="self-start text-lime-400 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-lime-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌍</div>
        <p className="font-display font-black text-lime-700 text-sm">Ecosystem Explorer Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-lime-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">☀️→🌱→🐛→🐦</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: make a food chain using 4 living things you saw outside today. What would happen if you removed the first one?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ECFCCB" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#65A30D" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-lime-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-lime-600 shadow-[0_6px_0_#4D7C0F] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
