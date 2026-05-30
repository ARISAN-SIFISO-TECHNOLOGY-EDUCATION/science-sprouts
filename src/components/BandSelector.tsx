// BandSelector — shown on first launch and whenever the user taps "Change".
//
// Ages 3–5 are shown as 3 compact individual cards (each age has its own content).
// Ages 6–9 and 10–12 are shown as full detail cards.

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { Band } from '../types';
import { BAND_META } from '../curriculum';
import { cn } from '../lib/utils';

interface BandSelectorProps {
  currentBand?: Band;
  onSelect: (band: Band) => void;
  onBack?: () => void;
}

// ── Per-age config ────────────────────────────────────────────────────────────

const YOUNG_AGES: { band: Band; emoji: string; tagline: string }[] = [
  { band: 'A3', emoji: '👶', tagline: 'Sensory play' },
  { band: 'A4', emoji: '🌼', tagline: 'Hands-on explore' },
  { band: 'A5', emoji: '🌟', tagline: 'Guided discovery' },
];

const OLDER_BANDS: {
  band: Band;
  emoji: string;
  bullets: string[];
  accentBg: string;
  accentBorder: string;
  accentText: string;
  accentIcon: string;
  buttonBg: string;
  buttonShadow: string;
}[] = [
  {
    band: 'B6',
    emoji: '🔬',
    bullets: [
      'First real science: predict, test & record',
      'Reads simple 3-word sentences (audio helps)',
      'Fill in their first data tables',
      'Earn Observer & Scientist badges',
    ],
    accentBg:     'bg-lime-50',
    accentBorder: 'border-lime-200',
    accentText:   'text-lime-700',
    accentIcon:   'bg-lime-100',
    buttonBg:     'bg-lime-500',
    buttonShadow: 'shadow-[0_6px_0_#65A30D]',
  },
  {
    band: 'B',
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
  {
    band: 'C',
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
];

// ── Young age accent colours (for compact cards) ──────────────────────────────

const YOUNG_ACCENT: Record<'A3' | 'A4' | 'A5', {
  bg: string; border: string; text: string; selectedBg: string; selectedBorder: string;
}> = {
  A3: { bg: 'bg-rose-50',   border: 'border-rose-200',   text: 'text-rose-700',   selectedBg: 'bg-rose-100',   selectedBorder: 'border-rose-400'   },
  A4: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', selectedBg: 'bg-orange-100', selectedBorder: 'border-orange-400' },
  A5: { bg: 'bg-sky-50',    border: 'border-sky-200',    text: 'text-sky-700',    selectedBg: 'bg-sky-100',    selectedBorder: 'border-sky-400'    },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function BandSelector({ currentBand, onSelect, onBack }: BandSelectorProps) {
  const isYoung = currentBand === 'A3' || currentBand === 'A4' || currentBand === 'A5';

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-brand-cream shadow-xl flex flex-col p-6 pb-10 overflow-y-auto">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-2">
        {onBack && (
          <button onClick={onBack}
            className="p-2.5 bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:scale-105 transition-transform active:scale-95 mr-1 flex-shrink-0"
            aria-label="Back">
            <ChevronLeft size={20} />
          </button>
        )}
        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-2xl shadow-[0_4px_0_#16A34A] flex-shrink-0">🌿</div>
        <div>
          <h1 className="font-display font-black text-xl text-gray-800 leading-tight">Science Sprouts</h1>
          <p className="text-xs font-bold text-gray-400 tracking-wide">Ages 3 – 12</p>
        </div>
      </div>

      {/* ── Prompt ─────────────────────────────────────────────────────── */}
      <div className="mb-5 mt-4">
        <h2 className="font-display font-black text-2xl text-gray-800 leading-tight">Who is learning today?</h2>
        <p className="text-sm text-gray-500 mt-1">
          Choose your child's age. Each age has content designed specifically for that stage.
        </p>
      </div>

      {/* ── Ages 3–5 grouped section ────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-4 shadow-sm mb-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
          👶 Little Ones — Ages 3, 4 &amp; 5
        </p>
        <p className="text-xs text-gray-400 mb-3">
          Short caregiver-led activities · No reading needed · Big buttons
        </p>

        <div className="grid grid-cols-3 gap-3">
          {YOUNG_AGES.map(({ band, emoji, tagline }, i) => {
            const meta    = BAND_META[band as 'A3' | 'A4' | 'A5'];
            const accent  = YOUNG_ACCENT[band as 'A3' | 'A4' | 'A5'];
            const active  = currentBand === band;

            return (
              <motion.button
                key={band}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => onSelect(band)}
                className={cn(
                  'flex flex-col items-center p-3 rounded-2xl border-2 transition-all active:scale-95',
                  active
                    ? `${accent.selectedBg} ${accent.selectedBorder} shadow-md`
                    : `${accent.bg} ${accent.border}`
                )}
              >
                <span className="text-4xl mb-1">{emoji}</span>
                <p className={cn('font-display font-black text-xl leading-none mb-0.5', accent.text)}>
                  {meta.ageRange}
                </p>
                <p className="text-[9px] font-bold text-gray-400 text-center leading-tight">{tagline}</p>
                {active && (
                  <span className={cn('mt-1.5 text-[9px] font-black text-white px-2 py-0.5 rounded-full', BAND_META[band as 'A3'].color)}>
                    SELECTED ✓
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {isYoung && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-center text-xs text-gray-400 font-bold"
          >
            ✓ Each age gets its own set of topics suited to that stage
          </motion.p>
        )}
      </div>

      {/* ── Ages 6–9 and 10–12 ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {OLDER_BANDS.map(({ band, emoji, bullets, accentBg, accentBorder, accentText, accentIcon, buttonBg, buttonShadow }, i) => {
          const meta   = BAND_META[band];
          const active = currentBand === band;

          return (
            <motion.button
              key={band}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 + i * 0.08 }}
              onClick={() => onSelect(band)}
              className={cn(
                'w-full text-left p-4 rounded-3xl border-2 transition-all',
                'hover:scale-[1.01] active:scale-[0.99]',
                active
                  ? `${accentBg} ${accentBorder} shadow-lg`
                  : 'bg-white border-gray-100 shadow-sm'
              )}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0', active ? accentIcon : 'bg-gray-100')}>
                  {emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={cn('font-display font-black text-xl leading-tight', active ? accentText : 'text-gray-700')}>
                      {meta.label}
                    </p>
                    {active && (
                      <span className={cn('text-[10px] font-black px-2 py-0.5 rounded-full text-white', buttonBg)}>SELECTED</span>
                    )}
                  </div>
                  <p className={cn('text-base font-black mt-0.5', active ? accentText : 'text-gray-400')}>
                    {meta.ageRange}
                  </p>
                </div>
              </div>

              <ul className="space-y-1 mb-4 pl-1">
                {bullets.map(b => (
                  <li key={b} className={cn('text-xs flex items-start gap-2', active ? accentText : 'text-gray-500')}>
                    <span className="mt-0.5 flex-shrink-0">•</span>{b}
                  </li>
                ))}
              </ul>

              <div className={cn('w-full py-3 rounded-2xl font-display font-black text-base text-white text-center', buttonBg, buttonShadow, active ? 'opacity-60' : '')}>
                {active ? `✓ ${meta.ageRange} selected` : `Select ${meta.ageRange}`}
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-300 text-center mt-6 font-medium tracking-wide">
        Aligned to South African CAPS curriculum &amp; NCF Birth-to-Four
      </p>
    </div>
  );
}
