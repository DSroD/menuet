import { defineConfig, ConfigEnv } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv) => {
  const base_config = {
    plugins: [preact()],
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
