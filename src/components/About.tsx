// About — app info, "safe & private" summary, contact, and a linked
// Privacy Policy sub-page. The current sub-view is owned by App (so the
// hardware/browser Back gesture can pop Privacy → About).

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Shield, WifiOff, Ban, Mail, Heart } from 'lucide-react';

const CONTACT_EMAIL = 'sifiso.cyprianshezi28@gmail.com';
const APP_VERSION = '1.0';

interface AboutProps {
  view: 'about' | 'privacy';
  onShowPrivacy: () => void;
  onBackToAbout: () => void;
}

export default function About({ view, onShowPrivacy, onBackToAbout }: AboutProps) {
  if (view === 'privacy') return <Privacy onBack={onBackToAbout} />;

  return (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 pt-6 pb-nav"
    >
      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center
                        text-4xl shadow-[0_6px_0_#16A34A] mb-3">🌿</div>
        <h1 className="font-display font-black text-2xl text-gray-800">Science Sprouts</h1>
        <p className="text-sm text-gray-500 mt-1">Hands-on science adventures for ages 3–12</p>
      </div>

      {/* What it is */}
      <section className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm mb-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">🌱 What it is</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Science Sprouts turns curiosity into discovery. Your child predicts, investigates and
          writes their own conclusions — just like a real scientist — then earns a badge and a
          simple real-world mission to try with a grown-up. Topics follow the South African CAPS
          Natural Sciences curriculum, across all four strands, from age 3 to age 12.
        </p>
      </section>

      {/* Safe & private */}
      <section className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm mb-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">🔒 Safe &amp; private</p>
        <ul className="space-y-3">
          <SafeRow Icon={WifiOff} title="100% offline" desc="Works anywhere — no internet needed." />
          <SafeRow Icon={Ban}     title="No ads, no sign-up" desc="No accounts, no in-app purchases, ever." />
          <SafeRow Icon={Shield}  title="No data collected" desc="Progress is saved only on this device." />
        </ul>
      </section>

      {/* Privacy link */}
      <button
        onClick={onShowPrivacy}
        className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 border-2 border-gray-100
                   shadow-sm mb-4 text-left hover:shadow-md transition-shadow"
      >
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
          <Shield size={18} className="text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-black text-base text-gray-800">Privacy Policy</p>
          <p className="text-xs text-gray-400">Read the full policy</p>
        </div>
        <ChevronRight size={20} className="text-gray-300 flex-shrink-0" />
      </button>

      {/* Contact */}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 border-2 border-gray-100
                   shadow-sm mb-6 text-left hover:shadow-md transition-shadow"
      >
        <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
          <Mail size={18} className="text-sky-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-black text-base text-gray-800">Contact us</p>
          <p className="text-xs text-gray-400 truncate">{CONTACT_EMAIL}</p>
        </div>
        <ChevronRight size={20} className="text-gray-300 flex-shrink-0" />
      </a>

      <p className="text-center text-[11px] text-gray-400 font-bold flex items-center justify-center gap-1">
        Made with <Heart size={11} fill="currentColor" className="text-rose-400" /> in South Africa
      </p>
      <p className="text-center text-[10px] text-gray-300 mt-1">Version {APP_VERSION}</p>
    </motion.div>
  );
}

function SafeRow({ Icon, title, desc }: { Icon: typeof Shield; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
        <Icon size={17} className="text-green-600" />
      </div>
      <div>
        <p className="font-bold text-sm text-gray-700 leading-tight">{title}</p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
    </li>
  );
}

// ── Privacy sub-page ──────────────────────────────────────────────────────────

function Privacy({ onBack }: { onBack: () => void }) {
  return (
    <motion.div
      key="privacy"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      className="px-6 pt-6 pb-nav"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-black text-gray-500 hover:text-gray-800 mb-5"
        aria-label="Back to About"
      >
        <ChevronLeft size={18} /> About
      </button>

      <h1 className="font-display font-black text-2xl text-gray-800 mb-1">Privacy Policy</h1>
      <p className="text-xs text-gray-400 mb-6">Last updated: 2 June 2026</p>

      <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
        <div className="bg-green-50 border-2 border-green-100 rounded-2xl p-4">
          <p className="font-bold text-green-800">
            Science Sprouts does not collect, store, share, or transmit any personal information.
            No accounts, no ads, no analytics. Everything happens on your device, fully offline.
          </p>
        </div>

        <Block title="What we collect">
          Nothing. We never ask for names, emails, ages, photos, location, or contacts, and the
          app never asks a child or caregiver to sign in or create an account.
        </Block>

        <Block title="Information stored on your device">
          To remember a child's progress, the app saves a small amount of data <em>only on your
          own device</em> (which band was last chosen, completed activities, badges earned, and
          garden visuals). This never leaves the device and is not shared with us or anyone else.
          Uninstalling the app or clearing its storage permanently deletes it.
        </Block>

        <Block title="Internet &amp; network use">
          The app runs entirely offline and makes no network requests. It loads no remote content,
          ads, or trackers. The Android package includes the standard INTERNET permission that
          ships by default with the app framework, but the app does not use it to send or receive
          any data.
        </Block>

        <Block title="Voice narration">
          Activities can be read aloud using your device's built-in text-to-speech engine, handled
          by your device. No audio is recorded, stored, or transmitted.
        </Block>

        <Block title="Third-party services">
          There are none — no advertising networks, no analytics SDKs, no social media SDKs, and
          no third-party data-collection libraries.
        </Block>

        <Block title="Children's privacy">
          Science Sprouts is designed for children and complies with the Google Play Families
          Policy. Because the app collects no personal information of any kind, it collects no
          information from children.
        </Block>

        <Block title="Contact">
          Questions about this policy? Email{' '}
          <a className="text-green-600 font-bold underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>.
        </Block>
      </div>
    </motion.div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display font-black text-base text-gray-800 mb-1">{title}</h2>
      <p>{children}</p>
    </div>
  );
}
