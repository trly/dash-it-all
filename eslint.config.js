import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import typescript from 'typescript-eslint';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default [
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...typescript.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {
				$$Generic: 'readonly',
				$$Props: 'readonly',
				$$Events: 'readonly',
				$$Slots: 'readonly'
			},
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname,
				extraFileExtensions: ['.svelte']
			}
		}
	},
	{
		files: ['*.svelte', '**/*.svelte'],
		languageOptions: {
			globals: {
				setInterval: 'readonly',
				clearInterval: 'readonly',
				setTimeout: 'readonly',
				clearTimeout: 'readonly'
			},
			parserOptions: {
				parser: typescript.parser
			}
		}
	},
	{
		ignores: [
			'build/',
			'.svelte-kit/',
			'dist/',
			'eslint.config.js',
			'svelte.config.js',
			'vite.config.ts'
		]
	}
];
