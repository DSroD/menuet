import { defineConfig, ConfigEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv) => {
  const base_config = {
    plugins: [preact(), VitePWA({
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Menuet',
        short_name: 'Menuet',
        description: 'Keeping track of all the drinks!',
        theme_color: '#673ab8',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ],
      },
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      }
    })],
    resolve: {
      alias: {
        "react": "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
        "react/jsx-runtime": "preact/jsx-runtime"
      }
    }
  }
  if (command === 'build')
  {
    return {...base_config, base: "/menuet/"}
  }
  return base_config
})
