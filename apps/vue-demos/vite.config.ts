import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import Unocss from 'unocss/vite'
import type { PluginOption } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.ts', 'src/**/*.vue', 'src/*.js', 'src/*.ts', 'src/*.vue']
      }),
      Unocss(),
      visualizer() as PluginOption
    ],
    build: {
      target: 'es2015'
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      host: '0.0.0.0',
      open: true,
      cors: true,
      proxy: {
        '/proxy': {
          target: env.VITE_LOCAL_PROXY_BASE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/proxy/, '')
        },
        '/cdn': {
          target: env.VITE_CDN_BASE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/cdn/, '')
        }
      }
    }
  }
})
