// Activity: Weather — Ages 3–4 (Band A3 + A4)
// 3S Pattern: See → Do → Caregiver Card
//
// See  (5s):  Sky cycles through weather types automatically
// Do   (30s): Tap ← → to change weather — each shows dressed child + voice
// Card (60s): "Look outside. What is the weather today?"
//
// After visiting all 3 weather types → card unlocks

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'see' | 'do' | 'card';

interface WeatherState {
  id: string;
  emoji: string;
  name: string;
  skyClass: string;
  childEmoji: string;
  outfit: string;
  voice: string;
  raindrops?: boolean;
}

const WEATHER: WeatherState[] = [
  {
    id: 'sunny',
    emoji: '☀️',
    name: 'SUNNY',
    skyClass: 'from-sky-300 to-sky-100',
    childEmoji: '🧒',
    outfit: '🧢☀️',
    voice: 'Sunny day! It is warm and bright. Wear a hat and sunscreen to protect your skin!',
  },
  {
    id: 'cloudy',
    emoji: '⛅',
    name: 'CLOUDY',
    skyClass: 'from-gray-300 to-gray-100',
    childEmoji: '🧒',
    outfit: '🧥🌫️',
    voice: 'Cloudy day! The sun is hiding. Put on a warm jacket just in case!',
  },
  {
    id: 'rainy',
    emoji: '🌧️',
    name: 'RAINY',
    skyClass: 'from-slate-400 to-slate-200',
    childEmoji: '🧒',
    outfit: '☂️👢',
    voice: 'Rainy day! Water falls from the sky. Use your umbrella and put on your boots!',
    raindrops: true,
  },
];

const SEE_VOICE = "Look at the sky! The weather changes every day. Sunny, cloudy, rainy. Let us explore them together!";
const CARD_VOICE = "Now go outside together! Look at the sky. What is the weather today? Sunny, cloudy, or rainy?";

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

export default function WeatherActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]     = useState<Phase>('see');
  const [idx, setIdx]         = useState(0);
  const [visited, setVisited] = useState<Set<string>>(new Set(['sunny']));

  useEffect(() => {
    speak(SEE_VOICE);
    // Cycle through all 3 weather states in the SEE phase
    const t1 = setTimeout(() => { setIdx(1); }, 1500);
    const t2 = setTimeout(() => { setIdx(2); }, 3000);
    const t3 = setTimeout(() => { setIdx(0); setPhase('do'); speak(WEATHER[0].voice); }, 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); stopAudio(); };
  }, []);

  function goTo(newIdx: number) {
    const w = WEATHER[newIdx];
    setIdx(newIdx);
    setVisited(prev => new Set([...prev, w.id]));
    speak(w.voice);
    if (visited.size + 1 >= WEATHER.length && !visited.has(w.id)) {
      setTimeout(() => setPhase('card'), 1800);
    }
  }

  function prev() { goTo((idx - 1 + WEATHER.length) % WEATHER.length); }
  function next() { goTo((idx + 1) % WEATHER.length); }

  const allVisited = visited.size >= WEATHER.length;
  const current = WEATHER[idx];

  return (
    <div className="fixed inset-0 bg-sky-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── SEE phase ──────────────────────────────────────────────────── */}
        {phase === 'see' && (
          <motion.div key="see" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full">
            <button onClick={onExit} className="absolute top-4 left-4 text-sky-300 text-sm font-bold z-10">← Back</button>

            {/* Animated sky */}
            <motion.div
              key={idx}
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.5 }}
              className={`flex-1 bg-gradient-to-b ${current.skyClass} flex flex-col items-center justify-center p-6`}
            >
              <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                className="text-8xl mb-4">{current.emoji}</motion.span>
              <p className="font-black text-white text-3xl drop-shadow">{current.name}</p>
            </motion.div>

            <div className="bg-white p-4 text-center border-t-2 border-sky-100">
              <p className="text-sky-700 text-base font-black leading-snug">{SEE_VOICE}</p>
            </div>
          </motion.div>
        )}

        {/* ── DO phase ───────────────────────────────────────────────────── */}
        {phase === 'do' && (
          <motion.div key="do" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full">
            <button onClick={onExit} className="absolute top-4 left-4 text-white/70 text-sm font-bold z-10">← Back</button>

            {/* Sky area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`relative flex-1 bg-gradient-to-b ${current.skyClass} flex flex-col items-center justify-center overflow-hidden`}
              >
                {/* Rain effect */}
                {current.raindrops && (
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: ['0%', '110%'] }}
                        transition={{ duration: 0.8 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.15 }}
                        className="absolute text-2xl"
                        style={{ left: `${(i * 8) + 2}%`, top: '-10%' }}
                      >
                        💧
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Weather emoji */}
                <motion.span
                  animate={current.raindrops ? {} : { scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl mb-3 z-10"
                >
                  {current.emoji}
                </motion.span>

                {/* Weather name */}
                <p className="font-display font-black text-4xl text-white drop-shadow-lg z-10 mb-4">
                  {current.name}
                </p>

                {/* Dressed child */}
                <div className="bg-white/30 rounded-3xl px-6 py-3 z-10 text-center">
                  <p className="text-3xl">{current.childEmoji}</p>
                  <p className="text-3xl">{current.outfit}</p>
                  <p className="text-xs font-black text-white/90 mt-1">dress for the weather</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation + progress */}
            <div className="bg-white p-4 border-t-2 border-sky-100">
              {/* Visited dots */}
              <div className="flex justify-center gap-3 mb-3">
                {WEATHER.map(w => (
                  <div key={w.id} className={`w-4 h-4 rounded-full transition-all text-center leading-none flex items-center justify-center text-lg
                    ${visited.has(w.id) ? '' : 'opacity-30 grayscale'}`}>
                    {w.emoji}
                  </div>
                ))}
              </div>

              {/* Big nav buttons */}
              <div className="flex items-center gap-3">
                <button onClick={prev}
                  className="flex-1 py-4 bg-sky-100 rounded-2xl flex items-center justify-center active:scale-95 transition-transform">
                  <ChevronLeft size={32} className="text-sky-600" />
                </button>

                <button onClick={() => speak(current.voice)}
                  className="p-4 bg-sky-400 rounded-2xl text-white active:scale-95 transition-transform">
                  <Volume2 size={24} />
                </button>

                <button onClick={next}
                  className="flex-1 py-4 bg-sky-100 rounded-2xl flex items-center justify-center active:scale-95 transition-transform">
                  <ChevronRight size={32} className="text-sky-600" />
                </button>
              </div>

              {allVisited && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setPhase('card')}
                  className="mt-3 w-full py-4 bg-sky-500 shadow-[0_4px_0_#0284C7] text-white font-display font-black text-xl rounded-3xl btn-press"
                >
                  I found all 3 weathers! →
                </motion.button>
              )}
            </div>
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
  useEffect(() => { speak(CARD_VOICE); }, []);

  return (
    <motion.div key="card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full p-6 items-center">
      <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold mb-4">← Back</button>

      <div className="bg-sky-100 border-2 border-sky-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-4">
        <span className="text-lg">👨‍👩‍👧</span>
        <span className="text-xs font-black text-sky-600 uppercase tracking-widest">Now try at home!</span>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-sky-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌤️👀</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          Go to a window together. Look at the sky! Is it sunny, cloudy, or rainy? Help your child say the weather word!
        </p>
      </div>

      {/* Activity prompts */}
      <div className="space-y-2 w-full max-w-xs mb-5">
        {[
          { emoji: '☀️', text: 'Point to the sun' },
          { emoji: '🧢', text: 'Dress for the weather' },
          { emoji: '💧', text: 'Feel a raindrop (if raining!)' },
        ].map(p => (
          <div key={p.text} className="bg-sky-50 border-2 border-sky-100 rounded-2xl p-3 flex items-center gap-3">
            <span className="text-3xl flex-shrink-0">{p.emoji}</span>
            <p className="font-black text-sky-700 text-sm">{p.text}</p>
          </div>
        ))}
      </div>

      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E0F2FE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#38BDF8" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-sky-500 text-sm">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</span>
        </div>
      </div>

      <button onClick={onComplete}
        className="px-10 py-4 bg-sky-500 shadow-[0_6px_0_#0284C7] text-white font-display font-black text-xl rounded-3xl btn-press">
        🌱 All done!
      </button>
    </motion.div>
  );
}
