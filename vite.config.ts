import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name:             'TravelPlanner',
        short_name:       'TravelPlan',
        description:      'Plan trips, track expenses, and explore the world — all in one place.',
        theme_color:      '#2563eb',
        background_color: '#ffffff',
        display:          'standalone',
        orientation:      'portrait',
        scope:            '/',
        start_url:        '/',
        icons: [
          {
            src:   '/icon-192.svg',
            sizes: '192x192',
            type:  'image/svg+xml',
          },
          {
            src:   '/icon-512.svg',
            sizes: '512x512',
            type:  'image/svg+xml',
          },
          {
            src:     '/icon-512.svg',
            sizes:   '512x512',
            type:    'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        // Cache all build assets — includes png for Leaflet marker images
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf}'],

        // SPA fallback — serve index.html for all navigation requests
        navigateFallback: 'index.html',

        // Only block Vite internals and Supabase server-side auth API.
        // /auth/callback is a client-side React route and must be served by the SW.
        // No allowlist: Workbox's default [/./] handles every non-denied path.
        navigateFallbackDenylist: [/^\/__/, /\/auth\/v1\//],

        runtimeCaching: [
          // Supabase REST API — NetworkFirst so offline falls back to cache
          {
            urlPattern: /^https:\/\/[^/]+\.supabase\.co\/rest\//,
            handler: 'NetworkFirst',
            options: {
              cacheName:            'supabase-rest',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries:     200,
                maxAgeSeconds:  24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Supabase Storage (avatars, documents) — CacheFirst
          {
            urlPattern: /^https:\/\/[^/]+\.supabase\.co\/storage\//,
            handler: 'CacheFirst',
            options: {
              cacheName:   'supabase-storage',
              expiration: {
                maxEntries:    100,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Google Fonts (if ever added) — StaleWhileRevalidate
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },

      devOptions: {
        // Enable service worker in development for testing offline behaviour
        enabled: false, // flip to true when you want to test SW locally
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:   ['react', 'react-dom', 'react-router-dom'],
          query:    ['@tanstack/react-query'],
          supabase: ['@supabase/supabase-js'],
          charts:   ['recharts'],
          maps:     ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
});
