import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import * as pkg from './package.json';

const libraryName = 'layoutGridHelper';
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const plugins = [
	typescript({
		tsconfig: './tsconfig.json',
		exclude: ['test/**', 'example/**'],
	})
];

if (isDev === false) {
	plugins.push(terser());
}

export default {
	input: `src/index.ts`,
	output: [
		{ file: pkg.main, name: libraryName, format: 'umd', sourcemap: isDev },
		{ file: pkg.module, format: 'es', sourcemap: isDev },
		{ file: pkg.browser, name: libraryName, format: 'iife', sourcemap: isDev }
	],
	plugins
};
