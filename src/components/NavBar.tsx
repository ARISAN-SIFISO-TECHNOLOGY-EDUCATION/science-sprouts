// NavBar — persistent app navigation.
//   • Mobile / tablet  → fixed bottom bar (lg:hidden)
//   • Desktop (lg+)     → fixed left sidebar (hidden lg:flex)
// Both respect the device safe-area inset so the bar clears the Android
// gesture pill / iPhone home indicator.

import React from 'react';
import { Home, Layers, Trophy, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export type Tab = 'home' | 'ages' | 'progress' | 'about';

interface NavItem { id: Tab; label: string; Icon: typeof Home; }

const ITEMS: NavItem[] = [
  { id: 'home',     label: 'Home',     Icon: Home },
  { id: 'ages',     label: 'Ages',     Icon: Layers },
  { id: 'progress', label: 'Progress', Icon: Trophy },
  { id: 'about',    label: 'About',    Icon: Info },
];

interface NavBarProps {
  active: Tab;
  onNavigate: (tab: Tab) => void;
}

export default function NavBar({ active, onNavigate }: NavBarProps) {
  return (
    <>
      {/* ── Mobile / tablet: bottom bar ─────────────────────────────────── */}
      <nav
        className="lg:hidden fixed inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur
                   border-t-2 border-gray-100 pb-safe"
        aria-label="Main navigation"
      >
        <div className="max-w-lg mx-auto flex items-stretch h-16">
          {ITEMS.map(({ id, label, Icon }) => {
            const on = active === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                aria-current={on ? 'page' : undefined}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
                  on ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <Icon size={22} strokeWidth={on ? 2.6 : 2} fill={on ? 'currentColor' : 'none'}
                      className={on ? 'opacity-90' : ''} />
                <span className={cn('text-[10px] font-black tracking-wide', on && 'font-black')}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Desktop: left sidebar ───────────────────────────────────────── */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 bottom-0 z-30 w-60 flex-col
                   bg-white border-r-2 border-gray-100 p-5"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-3 mb-8 px-1">
          <div className="w-11 h-11 bg-green-500 rounded-xl flex items-center justify-center
                          text-2xl shadow-[0_4px_0_#16A34A]">🌿</div>
          <div>
            <p className="font-display font-black text-lg text-gray-800 leading-tight">Science Sprouts</p>
            <p className="text-[11px] font-bold text-gray-400">Ages 3 – 12</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {ITEMS.map(({ id, label, Icon }) => {
            const on = active === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                aria-current={on ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl font-display font-black text-base transition-all',
                  on
                    ? 'bg-green-50 text-green-700 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                )}
              >
                <Icon size={20} strokeWidth={on ? 2.6 : 2} />
                {label}
              </button>
            );
          })}
        </div>

        <p className="mt-auto text-[10px] text-gray-300 font-medium tracking-wide px-1">
          Offline · No ads · No sign-up
        </p>
      </aside>
    </>
  );
}
