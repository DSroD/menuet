import { defineConfig, ConfigEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv) => {
  const base_config = {
    plugins: [preact(), VitePWA({
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'Menuet',
        short_name: 'Menuet',
        description: 'Keeping track of all the drinks!',
        theme_color: '#673ab8',
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
