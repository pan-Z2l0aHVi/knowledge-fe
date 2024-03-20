import mdx from '@mdx-js/rollup'
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react-swc'
import { excludeDeps } from '@youknown/img-wasm'
import { resolve } from 'path'
import remarkGfm from 'remark-gfm'
import { visualizer } from 'rollup-plugin-visualizer'
import unocss from 'unocss/vite'
import { defineConfig, loadEnv, PluginOption, splitVendorChunkPlugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import topLevelAwait from 'vite-plugin-top-level-await'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode, command }) => {
	const env = loadEnv(mode, process.cwd())
	const isBuild = command === 'build'
	return {
		base: isBuild ? env.VITE_CDN_BASE_URL : '',
		plugins: [
			mdx({
				remarkPlugins: [remarkGfm]
			}),
			VitePWA({
				devOptions: {
					enabled: true
				},
				base: isBuild ? `${env.VITE_BASE_URL}/` : '',
				injectRegister: null,
				manifest: {
					name: 'Book',
					short_name: 'Book',
					description: 'document book',
					display: 'standalone',
					background_color: '#ffffff',
					theme_color: '#ffffff',
					icons: [
						{
							src: '/branch.png',
							sizes: '512x512',
							type: 'image/png'
						}
					]
				}
			}),
			legacy({
				renderLegacyChunks: false,
				modernPolyfills: ['es.promise.all-settled', 'es.object.has-own']
			}),
			splitVendorChunkPlugin(),
			tsconfigPaths(),
			topLevelAwait(),
			react(),
			unocss(),
			visualizer() as PluginOption
		],
		optimizeDeps: {
			exclude: [...excludeDeps]
		},
		resolve: {
			alias: {
				'@': resolve(__dirname, 'src')
			}
		},
		build: {
			target: 'es2015',
			reportCompressedSize: false
		},
		server: {
			host: '0.0.0.0',
			open: env.VITE_ROUTER_BASENAME,
			cors: true,
			proxy: {
				'/proxy': {
					target: env.VITE_LOCAL_PROXY_BASE_URL,
					changeOrigin: true,
					secure: false,
					rewrite: path => path.replace(/^\/proxy/, '')
				}
			}
		}
	}
})
