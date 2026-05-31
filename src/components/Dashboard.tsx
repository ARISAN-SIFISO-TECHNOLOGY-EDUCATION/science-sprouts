// Parent / teacher dashboard — band selector, sequence override, reset.
// Accessible via the ⚙️ gear icon, guarded by a simple "tap 5 times" pattern
// (same approach as Numeracy Sprouts; a proper PIN can come later).

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, RotateCcw, Shuffle } from 'lucide-react';
import { LearnerProfile, Band } from '../types';
import { saveProfile, resetProfile } from '../lib/db';
import { BAND_META } from '../curriculum';
import { cn } from '../lib/utils';

interface DashboardProps {
  profile: LearnerProfile;
  onUpdate: (p: LearnerProfile) => void;
  onClose: () => void;
}

export default function Dashboard({ profile, onUpdate, onClose }: DashboardProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  async function handleBandChange(band: Band) {
    const updated = { ...profile, selectedBand: band };
    await saveProfile(updated);
    onUpdate(updated);
  }

  async function handleToggleOverride() {
    const updated = {
      ...profile,
      settings: {
        ...profile.settings,
        overrideSequence: !profile.settings.overrideSequence,
      },
    };
    await saveProfile(updated);
    onUpdate(updated);
  }

  async function handleReset() {
    const fresh = await resetProfile();
    onUpdate(fresh);
    setConfirmReset(false);
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 pb-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-black text-xl text-gray-800">
            Parent / Teacher Settings
          </h3>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Band selector */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Age Group
        </p>

        {/* Ages 3–5 row */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {(['A3', 'A4', 'A5'] as Band[]).map(band => {
            const m = BAND_META[band];
            const active = profile.selectedBand === band;
            return (
              <button
                key={band}
                onClick={() => handleBandChange(band)}
                className={cn(
                  'p-3 rounded-2xl border-2 text-center transition-all',
                  active
                    ? `${m.bgLight} border-current ${m.textColor} shadow-md`
                    : 'border-gray-100 bg-gray-50 text-gray-500'
                )}
              >
                <p className="font-display font-black text-sm">{m.ageRange}</p>
                <p className="text-[10px] opacity-70 leading-tight">{m.description}</p>
              </button>
            );
          })}
        </div>

        {/* Age 6, Age 7, Ages 8–9, Ages 10–12 */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {(['B6', 'B7', 'B8', 'B', 'C'] as Band[]).map(band => {
            const m = BAND_META[band];
            const active = profile.selectedBand === band;
            return (
              <button
                key={band}
                onClick={() => handleBandChange(band)}
                className={cn(
                  'p-3 rounded-2xl border-2 text-left transition-all',
                  active
                    ? `${m.bgLight} border-current ${m.textColor} shadow-md`
                    : 'border-gray-100 bg-gray-50 text-gray-500'
                )}
              >
                <p className="font-display font-black text-sm">{m.label}</p>
                <p className="text-[10px] opacity-70">{m.ageRange}</p>
              </button>
            );
          })}
        </div>

        {/* Override sequence */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-6">
          <div className="flex items-center gap-3">
            <Shuffle size={20} className="text-gray-500" />
            <div>
              <p className="font-bold text-sm text-gray-700">Unlock all activities</p>
              <p className="text-xs text-gray-400">Skip the recommended sequence</p>
            </div>
          </div>
          <button
            onClick={handleToggleOverride}
            className={cn(
              'w-12 h-6 rounded-full transition-all relative',
              profile.settings.overrideSequence ? 'bg-green-500' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all',
                profile.settings.overrideSequence ? 'left-7' : 'left-1'
              )}
            />
          </button>
        </div>

        {/* Reset */}
        {confirmReset ? (
          <div className="p-4 bg-red-50 rounded-2xl border-2 border-red-200">
            <p className="text-sm font-bold text-red-700 mb-3">
              Reset all progress? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl font-bold text-sm"
              >
                Yes, reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-2 text-red-400 text-sm font-bold hover:text-red-600 transition-colors"
          >
            <RotateCcw size={16} />
            Reset all progress
          </button>
        )}
      </div>
    </motion.div>
  );
}
