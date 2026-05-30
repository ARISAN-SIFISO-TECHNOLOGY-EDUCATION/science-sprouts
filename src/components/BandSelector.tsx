// BandSelector — shown on first launch and whenever the user taps "Change".
// Makes the full 3–12 age range immediately obvious: three cards, one per band.

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { Band } from '../types';
import { BAND_META } from '../curriculum';
import { cn } from '../lib/utils';

interface BandSelectorProps {
  currentBand?: Band;
  onSelect: (band: Band) => void;
  /** If provided, show a back button (user came from home, not first launch) */
  onBack?: () => void;
}

const BAND_DETAILS: Record<Band, {
  emoji: string;
  bullets: string[];
  accentBg: string;
  accentBorder: string;
  accentText: string;
  accentIcon: string;
  buttonBg: string;
  buttonShadow: string;
}> = {
  A: {
    emoji: '👶',
    bullets: [
      'Short 30-second activities',
      'Done together with a grown-up',
      'Big buttons, no reading needed',
      'Audio narration in English & isiZulu',
    ],
    accentBg:     'bg-sky-50',
    accentBorder: 'border-sky-200',
    accentText:   'text-sky-700',
    accentIcon:   'bg-sky-100',
    buttonBg:     'bg-sky-400',
    buttonShadow: 'shadow-[0_6px_0_#0EA5E9]',
  },
  B: {
    emoji: '🧒',
    bullets: [
      'Explore, experiment & discover',
      'Guided or semi-independent',
      'Simple cause-and-effect games',
      'Fun "go try it at home" activities',
    ],
    accentBg:     'bg-green-50',
    accentBorder: 'border-green-200',
    accentText:   'text-green-700',
    accentIcon:   'bg-green-100',
    buttonBg:     'bg-green-500',
    buttonShadow: 'shadow-[0_6px_0_#16A34A]',
  },
  C: {
    emoji: '👦',
    bullets: [
      'Investigate and reason independently',
      'Record predictions & test them',
      'Deeper explanations & diagrams',
      'Aligned to CAPS Gr 4–7',
    ],
    accentBg:     'bg-indigo-50',
    accentBorder: 'border-indigo-200',
    accentText:   'text-indigo-700',
    accentIcon:   'bg-indigo-100',
    buttonBg:     'bg-indigo-500',
    buttonShadow: 'shadow-[0_6px_0_#4338CA]',
  },
};

export default function BandSelector({ currentBand, onSelect, onBack }: BandSelectorProps) {
  return (
    <div className="min-h-screen max-w-lg mx-auto bg-brand-cream shadow-xl flex flex-col p-6 pb-10">
      {/* ── App title + optional back button ───────────────────────────── */}
      <div className="flex items-center gap-3 mb-2">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2.5 bg-white rounded-xl shadow-sm border-2 border-gray-100
                       hover:scale-105 transition-transform active:scale-95 mr-1 flex-shrink-0"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center
                        text-2xl shadow-[0_4px_0_#16A34A] flex-shrink-0">
          🌿
        </div>
        <div>
          <h1 className="font-display font-black text-xl text-gray-800 leading-tight">
            Science Sprouts
          </h1>
          <p className="text-xs font-bold text-gray-400 tracking-wide">Ages 3 – 12</p>
        </div>
      </div>

      {/* ── Prompt ─────────────────────────────────────────────────────── */}
      <div className="mb-6 mt-4">
        <h2 className="font-display font-black text-2xl text-gray-800 leading-tight">
          Who is learning today?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Choose the age group that matches your child. You can change this anytime in settings.
        </p>
      </div>

      {/* ── Band cards ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 flex-1">
        {(['A', 'B', 'C'] as Band[]).map((band, i) => {
          const meta    = BAND_META[band];
          const details = BAND_DETAILS[band];
          const active  = currentBand === band;

          return (
            <motion.button
              key={band}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onSelect(band)}
              className={cn(
                'w-full text-left p-4 rounded-3xl border-2 transition-all',
                'hover:scale-[1.01] active:scale-[0.99]',
                active
                  ? `${details.accentBg} ${details.accentBorder} shadow-lg`
                  : 'bg-white border-gray-100 shadow-sm'
              )}
            >
              <div className="flex items-center gap-4 mb-3">
                {/* Age emoji */}
                <div className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0',
                  active ? details.accentIcon : 'bg-gray-100'
                )}>
                  {details.emoji}
                </div>

                {/* Name + age range */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={cn(
                      'font-display font-black text-xl leading-tight',
                      active ? details.accentText : 'text-gray-700'
                    )}>
                      {meta.label}
                    </p>
                    {active && (
                      <span className={cn(
                        'text-[10px] font-black px-2 py-0.5 rounded-full text-white',
                        details.buttonBg
                      )}>
                        SELECTED
                      </span>
                    )}
                  </div>
                  {/* Big, readable age range */}
                  <p className={cn(
                    'text-base font-black mt-0.5',
                    active ? details.accentText : 'text-gray-400'
                  )}>
                    {meta.ageRange}
                  </p>
                </div>
              </div>

              {/* Bullet points */}
              <ul className="space-y-1 mb-4 pl-1">
                {details.bullets.map(b => (
                  <li key={b} className={cn(
                    'text-xs flex items-start gap-2',
                    active ? details.accentText : 'text-gray-500'
                  )}>
                    <span className="mt-0.5 flex-shrink-0">•</span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* Select button */}
              <div className={cn(
                'w-full py-3 rounded-2xl font-display font-black text-base text-white text-center',
                details.buttonBg, details.buttonShadow,
                active ? 'opacity-60' : ''
              )}>
                {active ? '✓ This is my band' : `Select ${meta.ageRange}`}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Footer note ────────────────────────────────────────────────── */}
      <p className="text-[10px] text-gray-300 text-center mt-6 font-medium tracking-wide">
        Aligned to South African CAPS curriculum & NCF Birth-to-Four
      </p>
    </div>
  );
}
