// Shared chrome for every science activity — header, voice prompt, round
// progress dots, success overlay. Same pattern as Numeracy Sprouts.

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Volume2, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { speak } from '../lib/utils';

interface ActivityWrapperProps {
  title: string;
  voicePrompt?: string;
  currentRound?: number;
  totalRounds?: number;
  onExit: () => void;
  onSuccess: () => void;
  children: React.ReactNode;
  accentColor?: string; // Tailwind bg class for the speaker button
}

export default function ActivityWrapper({
  title,
  voicePrompt,
  currentRound,
  totalRounds,
  onExit,
  onSuccess,
  children,
  accentColor = 'bg-green-500',
}: ActivityWrapperProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  // Speak the prompt whenever it changes
  useEffect(() => {
    if (voicePrompt) speak(voicePrompt);
  }, [voicePrompt]);

  // Exposed via ref so child activities can trigger success
  // (kept simple — children call the passed onSuccess directly)
  const handleChildSuccess = () => {
    setShowSuccess(true);
  };

  return (
    <div className="fixed inset-0 bg-brand-cream z-40 flex flex-col p-4 md:p-8 overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between mb-6 pb-4 dashed-divider">
        <button
          onClick={onExit}
          className="p-3 bg-white shadow-sm rounded-2xl border-2 border-gray-100
                     hover:scale-110 transition-transform active:scale-95"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="flex-1 text-center px-4">
          <h2 className="font-display font-black text-gray-500 text-lg uppercase tracking-tight truncate">
            {title}
          </h2>
          {totalRounds && currentRound !== undefined && (
            <div className="flex justify-center gap-1.5 mt-1.5">
              {Array.from({ length: totalRounds }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-500',
                    i < currentRound ? 'w-4 bg-green-500' : 'w-1.5 bg-gray-200'
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => voicePrompt && speak(voicePrompt)}
          className={cn(
            'p-3 text-white rounded-2xl shadow-md animate-pulse',
            accentColor
          )}
          aria-label="Listen again"
        >
          <Volume2 size={22} />
        </button>
      </header>

      {/* ── Voice bubble ──────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {voicePrompt && (
          <motion.div
            key={voicePrompt}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="voice-bubble mb-6 mx-auto max-w-sm text-center"
          >
            {voicePrompt}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center overflow-y-auto pb-8">
        {React.Children.map(children, child => {
          // Pass down handleChildSuccess so activities can trigger the overlay
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<{ onSuccess?: () => void }>, {
              onSuccess: handleChildSuccess,
            });
          }
          return child;
        })}
      </main>

      {/* ── Success overlay ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-green-500/90 flex flex-col items-center justify-center p-8 text-white text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10 }}
              className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center mb-8"
            >
              <Star size={88} fill="currentColor" className="text-yellow-300" />
            </motion.div>
            <h2 className="text-5xl font-display font-black mb-3">
              Great work! 🌱
            </h2>
            <p className="text-xl mb-10 opacity-90">You earned a star for your garden!</p>
            <button
              onClick={onSuccess}
              className="px-12 py-5 bg-white text-green-600 rounded-3xl font-display
                         font-black text-2xl shadow-xl hover:scale-105 active:scale-95 transition-transform"
            >
              Next →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
