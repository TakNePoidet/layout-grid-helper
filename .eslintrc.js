module.exports = {
	extends: ['airbnb/base', 'prettier'],
	rules: {
		'no-param-reassign': 'off',
		'no-prototype-builtins': 'off',
		'no-tabs': 'off',
		indent: ['error', 'tab'],
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				js: 'never',
				ts: 'never'
			}
		],
		'no-console': 'off',
		'comma-dangle': [
			'error',
			{
				arrays: 'never',
				objects: 'never',
				imports: 'never',
				exports: 'never',
				functions: 'never'
			}
		]
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js']
			}
		}
	},
	overrides: [
		{
			files: ['*.ts'],
			parser: '@typescript-eslint/parser',
			plugins: ['@typescript-eslint'],
			extends: ['plugin:@typescript-eslint/recommended'],
			rules: {},
			settings: {
				'import/resolver': {
					node: {
						extensions: ['.ts']
					}
				}
			}
		}
	]
};