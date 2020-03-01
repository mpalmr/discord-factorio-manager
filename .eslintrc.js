'use strict';

module.exports = {
  root: true,
  extends: 'airbnb-base',
  parserOptions: { sourceType: 'script' },
  env: { node: true },
  rules: {
		strict: [2, 'global'],
		indent: [2, 'tab'],
		'no-tabs': 0,
		'no-console': 0,
		'arrow-parens': [2, 'as-needed'],
	},
	overrides: [
		{
			files: ['**/__tests__/*.spec.js', '**/__mocks__/*.js'],
			env: { jest: true },
		},
	],
};
