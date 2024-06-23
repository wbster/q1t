import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";


export default [
	{
		files: ["src/**/*.{ts}"],
	},
	{
		languageOptions: {
			globals: globals.browser
		}
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			semi: ['error', 'never'],
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			"@typescript-eslint/ban-types": "off",
			"eol-last": ["error", "always"],
			"padding-line-between-statements": ["error", { blankLine: "always", prev: "*", next: "return" }],
			'no-multiple-empty-lines': ['error', { max: 1 }],
		},
	}
]
