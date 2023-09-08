module.exports = {
	extends: ['standard', 'prettier'],
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': 1
	},
	overrides: [
		{
			files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
			extends: ['standard-with-typescript', 'prettier'],
			rules: {
				'@typescript-eslint/explicit-function-return-type': 0,
				'@typescript-eslint/strict-boolean-expressions': 0
			},
			parserOptions: {
				project: ['./tsconfig.json']
			}
		}
	]
};
