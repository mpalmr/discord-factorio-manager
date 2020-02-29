'use strict';

module.exports = {
  root: true,
  extends: 'airbnb-base',
  parserOptions: { sourceType: 'script' },
  env: { node: true },
  rules: {
		indent: [2, 'tab'],
		'no-tabs': 0,
    strict: [2, 'global'],
  },
};
