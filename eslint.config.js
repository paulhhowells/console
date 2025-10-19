// import css from '@eslint/css';
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	globalIgnores([ 'dist' ]),
	{
		files: [ '**/*.{js,jsx}' ],
		plugins: {
			'@stylistic': stylistic,
			react,
		},
		extends: [
			js.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2024,
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: { jsx: true },
				sourceType: 'module',
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			// JavaScript rules
			'vars-on-top': 'error',

			// React rules
			'react/jsx-uses-react': 'error',
			'react/jsx-uses-vars': 'error',
			'react/jsx-no-undef': 'error',
			'no-unused-vars': [ 'error', { varsIgnorePattern: '^[A-Z_]' } ],

			// Stylistic rules
			'@stylistic/brace-style': [ 'error', '1tbs' ],
			'@stylistic/comma-dangle': [ 'error', 'always-multiline' ],
			'@stylistic/comma-style': [ 'error', 'last' ],
			'@stylistic/eol-last': [ 'error', 'always' ],
			'@stylistic/indent': [ 'error', 'tab', { 'SwitchCase': 1 } ],
			'@stylistic/no-trailing-spaces': 'error',
			'@stylistic/operator-linebreak': [ 'error', 'before' ],
			'@stylistic/quotes': [ 'error', 'single', { 'allowTemplateLiterals': 'always' } ],
			'@stylistic/semi': [ 'error', 'always' ],
			'@stylistic/wrap-iife': [ 'error', 'outside' ],

			// Formatting: Spacing
			'@stylistic/array-bracket-spacing': [ 'error', 'always' ],
			'@stylistic/comma-spacing': [ 'error', { 'before': false, 'after': true } ],
			'@stylistic/function-call-spacing': [ 'error', 'never' ], // no space before parentheses when a function is called
			'@stylistic/keyword-spacing': [ 'error', { before: true, after: true } ], // avoid `if(foo){`
			'@stylistic/key-spacing': [ 'error', { 'beforeColon': false, 'afterColon': true } ],
			'@stylistic/lines-between-class-members': [ 'warn', 'always' ],
			'@stylistic/no-multiple-empty-lines': [
				'error',
				{
					'max': 1,
					'maxBOF': 1,
					'maxEOF': 0, // actually allows one blank line at end of file
				},
			],
			'@stylistic/no-multi-spaces': [ 'error', { ignoreEOLComments: true } ],
			'@stylistic/object-curly-spacing': [ 'error', 'always' ],
			'@stylistic/padded-blocks': [ 'error', 'never' ], // blanklines padding inside blocks
			'@stylistic/padding-line-between-statements': [
				'error',

				// blankline before return (replaces newline-before-return)
				{ 'blankLine': 'always', 'prev': '*', 'next': 'return' },

				// blankline after one or more of [const, var, let] (allows multiline blocks of variables)
				{ 'blankLine': 'always', 'prev': [ 'const', 'let', 'var' ], 'next': '*' },
				{ 'blankLine': 'any', 'prev': [ 'const', 'let', 'var' ], 'next': [ 'const', 'let', 'var' ] },

				// blankline before if blocks
				{ 'blankLine': 'always', 'prev': [ '*' ], 'next': 'if' },
				{ 'blankLine': 'always', 'prev': [ 'if' ], 'next': '*' },

				// blankline after IIFE
				{ 'blankLine': 'always', 'prev': 'iife', 'next': '*' },
			],
			'@stylistic/space-before-blocks': 'error', // before block curly brace
			'@stylistic/space-before-function-paren': [ 'error', 'always' ],
			'@stylistic/space-infix-ops': [ 'error', { 'int32Hint': false } ],
			'@stylistic/space-in-parens': [ 'error', 'never' ],
			'@stylistic/space-unary-ops': [
				'error',
				{
					'words': true,    // new Foo  [new, delete, typeof, void, yield]
					'nonwords': false, // bar++    [-, +, --, ++, !, !!]
				},
			],
		},
	},
]);
