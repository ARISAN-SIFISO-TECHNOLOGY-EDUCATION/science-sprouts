// Activity: Hot vs Cold — Age 5 (Band A5)
// Pattern: See → Predict → Do → Caregiver Card
//
// See     (8s):  ice (blue, COLD) vs tea (red, HOT) with word labels
// Predict (30s): "Which one is COLD?" — 2 choices
// Do      (60s): tap items → each shows HOT (red) or COLD (blue) + word
// Card   (120s): SAFETY — "With a grown-up, feel cool tap water vs warm tea"
//
// Safety-first: the caregiver card stresses adult supervision (no hot taps alone).

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'see' | 'predict' | 'do' | 'card';
type Temp = 'HOT' | 'COLD';

interface Item { id: string; emoji: string; name: string; temp: Temp; voice: string; }

const ITEMS: Item[] = [
  { id: 'ice',     emoji: '🧊', name: 'Ice',       temp: 'COLD', voice: 'Ice is COLD! Brrr — it makes your fingers chilly!' },
  { id: 'tea',     emoji: '🍵', name: 'Hot tea',   temp: 'HOT',  voice: 'Tea is HOT! Be careful — never touch hot things without a grown-up!' },
  { id: 'icecream',emoji: '🍦', name: 'Ice cream', temp: 'COLD', voice: 'Ice cream is COLD! It is frozen and yummy!' },
  { id: 'soup',    emoji: '🍲', name: 'Soup',      temp: 'HOT',  voice: 'Soup is HOT! Let it cool down before you eat it!' },
  { id: 'snow',    emoji: '❄️', name: 'Snow',      temp: 'COLD', voice: 'Snow is COLD! It is frozen water from the sky!' },
  { id: 'fire',    emoji: '🔥', name: 'Fire',      temp: 'HOT',  voice: 'Fire is very HOT! Never ever touch fire — stay safe!' },
];

const TEMP_META: Record<Temp, { color: string; bg: string; border: string; flash: string }> = {
  HOT:  { color: 'text-red-700',  bg: 'bg-red-100',  border: 'border-red-300',  flash: 'bg-red-500'  },
  COLD: { color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-300', flash: 'bg-blue-500' },
};

const SEE_VOICE  = "Some things are HOT and some things are COLD. Ice is COLD — it feels chilly! Tea is HOT — it can burn, so be careful! We feel hot and cold with our skin.";
const CARD_VOICE = "Safety time with a grown-up! Feel cool tap water with your hands. Then carefully feel a warm cup that a grown-up is holding. Which is hot? Which is cold?";

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

export default function HotColdActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]     = useState<Phase>('see');
  const [predicted, setPredicted] = useState(false);
  const [tapped, setTapped]   = useState<Set<string>>(new Set());
  const [glowing, setGlowing] = useState<string | null>(null);
  const [wordFlash, setWordFlash] = useState<Temp | null>(null);

  useEffect(() => {
    speak(SEE_VOICE);
    const t = setTimeout(() => setPhase('predict'), 8500);
    return () => { clearTimeout(t); stopAudio(); };
  }, []);

  function predict(temp: Temp) {
    setPredicted(true);
    speak(temp === 'COLD' ? "Yes! Ice is COLD! Great thinking!" : "Let's find out! Ice is COLD and chilly!",
      0.85, () => setPhase('do'));
  }

  function tapItem(item: Item) {
    if (tapped.has(item.id)) return;
    const isLast = tapped.size + 1 >= ITEMS.length;
    speak(item.voice, 0.85, isLast ? () => setPhase('card') : undefined);
    setGlowing(item.id);
    setWordFlash(item.temp);
    setTapped(prev => new Set([...prev, item.id]));
    setTimeout(() => { setGlowing(null); setWordFlash(null); }, 1600);
  }

  return (
    <div className="fixed inset-0 bg-orange-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── SEE ───────────────────────────────────────────────────────── */}
        {phase === 'see' && (
          <motion.div key="see" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 gap-5">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold">← Back</button>
            <div className="flex gap-6 items-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 bg-blue-100 rounded-3xl border-4 border-blue-300 flex items-center justify-center text-5xl">🧊</div>
                <span className="font-black text-blue-700 text-sm uppercase">COLD ❄️</span>
              </div>
              <span className="text-3xl text-gray-300 font-black">vs</span>
              <div className="flex flex-col items-center gap-2">
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: Infinity }}
                  className="w-24 h-24 bg-red-100 rounded-3xl border-4 border-red-300 flex items-center justify-center text-5xl">🍵</motion.div>
                <span className="font-black text-red-700 text-sm uppercase">HOT 🔥</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-orange-100 text-center max-w-xs">
              <p className="font-bold text-gray-700 text-base leading-snug">{SEE_VOICE}</p>
              <button onClick={() => speak(SEE_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-orange-400 text-sm font-bold">
                <Volume2 size={14} /> Again
              </button>
            </div>
          </motion.div>
        )}

        {/* ── PREDICT ───────────────────────────────────────────────────── */}
        {phase === 'predict' && !predicted && (
          <motion.div key="predict" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-orange-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">❄️❓</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Which one is COLD?</p>
              <button onClick={() => speak("Which one is cold?")} className="mt-2 flex items-center gap-1 mx-auto text-orange-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            <div className="flex gap-4 w-full max-w-xs">
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict('COLD')}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-3xl active:scale-95">
                <span className="text-5xl">🧊</span>
                <span className="font-black text-blue-700 text-sm uppercase">Ice</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict('HOT')}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-red-50 border-2 border-red-200 rounded-3xl active:scale-95">
                <span className="text-5xl">🔥</span>
                <span className="font-black text-red-700 text-sm uppercase">Fire</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'predict' && predicted && (
          <motion.div key="predDone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full items-center justify-center">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 2 }} className="text-7xl">🧊</motion.div>
          </motion.div>
        )}

        {/* ── DO ────────────────────────────────────────────────────────── */}
        {phase === 'do' && (
          <motion.div key="do" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-orange-600 text-sm uppercase tracking-widest mb-3">
              Tap each thing — hot or cold?
            </p>
            <div className="flex justify-center gap-2 mb-3">
              {ITEMS.map(i => (
                <div key={i.id} className={`w-3 h-3 rounded-full ${tapped.has(i.id) ? 'bg-orange-400' : 'bg-orange-100'}`} />
              ))}
            </div>

            <AnimatePresence>
              {wordFlash && (
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.3, opacity: 0 }}
                  className={`absolute inset-x-8 top-24 z-20 rounded-3xl p-4 text-center shadow-xl ${TEMP_META[wordFlash].flash}`}>
                  <p className="font-display font-black text-6xl text-white">{wordFlash === 'HOT' ? '🔥 HOT!' : '❄️ COLD!'}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-3 gap-3 flex-1 content-center">
              {ITEMS.map(item => {
                const done = tapped.has(item.id);
                const glow = glowing === item.id;
                return (
                  <motion.button key={item.id} animate={glow ? { scale: [1, 1.18, 0.95, 1] } : {}} transition={{ duration: 0.4 }}
                    onClick={() => tapItem(item)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-3xl min-h-[88px] border-2 transition-all active:scale-95
                      ${done ? `${TEMP_META[item.temp].bg} ${TEMP_META[item.temp].border}` : 'bg-white border-gray-100 shadow-sm'}`}>
                    <span className="text-4xl">{item.emoji}</span>
                    <span className={`text-[10px] font-black uppercase ${done ? TEMP_META[item.temp].color : 'text-gray-300'}`}>
                      {done ? item.temp : item.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
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
      <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold mb-4">← Back</button>
      <div className="bg-orange-100 border-2 border-orange-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-4">
        <span>👨‍👩‍👧</span><span className="text-xs font-black text-orange-600 uppercase tracking-widest">Safe Touch Mission!</span>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-orange-200 w-full max-w-xs mb-3 text-center">
        <p className="text-5xl mb-3">🤲💧🍵</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          With a grown-up: feel cool tap water with your hands. Then carefully touch a warm cup the grown-up is holding. Say which is HOT and which is COLD!
        </p>
      </div>
      {/* Safety warning */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 w-full max-w-xs mb-4 text-center">
        <p className="text-xs font-black text-red-600">⚠️ Never touch hot things alone! Always with a grown-up.</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FED7AA" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FB923C" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-orange-500 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span>
        </div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-orange-400 shadow-[0_6px_0_#FB923C] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
