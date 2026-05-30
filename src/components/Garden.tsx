// Science Sprouts garden — same reward metaphor as Numeracy Sprouts.
// Flowers bloom as the learner completes activities.

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Cloud } from 'lucide-react';
import { cn } from '../lib/utils';

const FLOWER_EMOJIS = ['🌸', '🌼', '🌺', '🌻', '💐'];

interface GardenProps {
  flowers: number;
}

export default function Garden({ flowers }: GardenProps) {
  return (
    <div className="relative w-full h-44 bg-gradient-to-b from-sky-100 to-green-100 rounded-3xl overflow-hidden shadow-inner mb-5 border-b-4 border-green-200">
      {/* Sky decorations */}
      <motion.div
        animate={{ x: [0, 12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute top-3 left-6 text-white/70"
      >
        <Cloud size={36} />
      </motion.div>
      <div className="absolute top-3 right-8 text-yellow-400">
        <Sun size={30} />
      </div>

      {/* Flowers */}
      <div className="absolute bottom-0 w-full flex flex-wrap justify-center gap-3 p-3 items-end min-h-[56px]">
        <AnimatePresence>
          {Array.from({ length: flowers }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', damping: 12, delay: i * 0.04 }}
              className="flex flex-col items-center"
            >
              <span className={cn('text-2xl', i % 2 === 0 ? '' : 'text-3xl')}>
                {FLOWER_EMOJIS[i % FLOWER_EMOJIS.length]}
              </span>
              <div className="w-0.5 h-3 bg-green-500 rounded-full" />
            </motion.div>
          ))}
        </AnimatePresence>

        {flowers === 0 && (
          <p className="text-gray-400 text-xs italic pb-2">
            Complete activities to grow your garden!
          </p>
        )}
      </div>
    </div>
  );
}
