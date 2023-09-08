import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
const libraryName = 'LayoutGridHelper';
export default defineConfig({
	plugins: [dts()],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: libraryName,
			formats: ['es', 'cjs', 'iife'],
			fileName: (format, entryName) => `${entryName}.${format}.js`
		},
		rollupOptions: {
			output: {
				preserveModules: false
			}
		},
		minify: 'terser'
	}
});
