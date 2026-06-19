import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Web-only PWA layer: installable + 100% offline app shell. The service
    // worker is NOT auto-registered here (`injectRegister: false`); main.tsx
    // registers it only when NOT running inside Capacitor, so the live
    // Android/Play build is left untouched.
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      manifest: {
        // Explicit, unique app identity — never depends on the install origin.
        // Prevents PWA collisions when sibling People's Home apps are ever
        // installed from the same origin (e.g. localhost during testing).
        id: '/science-sprouts/',
        name: 'Science Sprouts',
        short_name: 'Science Sprouts',
        description:
          'Hands-on CAPS-aligned science for curious kids (3–12). 100% offline, no ads, no accounts. Free forever.',
        theme_color: '#22C55E',
        background_color: '#22C55E',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the whole app shell so it loads with no network.
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,woff,woff2}'],
        // SPA: serve index.html for unknown routes offline.
        navigateFallback: 'index.html',
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  server: {
    port: 3001,
    host: '0.0.0.0',
  },
});
