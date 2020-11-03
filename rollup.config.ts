import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

const pkg = require('./package.json');

const libraryName = 'layout-grid-helper';
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export default {
	input: `src/${libraryName}.ts`,
	output: [
		{ file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: isDev },
		{ file: pkg.module, format: 'es', sourcemap: isDev }
	],
	// Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
	external: [],
	watch: {
		include: 'src/**'
	},
	plugins: [
		json(),
		typescript({ useTsconfigDeclarationDir: true }),
		resolve(),
		commonjs(),
		sourceMaps()
	]
};