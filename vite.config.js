import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [VitePWA({
    registerType: 'autoUpdate',
    injectRegister: false,
    includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
    manifest: {
      id: '/',
      name: 'MY SPACE',
      short_name: 'MY SPACE',
      description: 'Personal student planner and task management app.',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      theme_color: '#f5f4ef',
background_color: '#f5f4ef',
      icons: [
        {src:'/icons/pwa-192.png',sizes:'192x192',type:'image/png',purpose:'any'},
        {src:'/icons/pwa-512.png',sizes:'512x512',type:'image/png',purpose:'any'},
        {src:'/icons/pwa-maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'},
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
      cleanupOutdatedCaches: true,
      navigateFallback: 'index.html',
    },
  })],
});
