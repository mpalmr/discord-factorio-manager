'use strict';

const codeblock = require('../codeblock');

test('Outputs Discord codeblock', () => {
	expect(codeblock('AYYO')).toBe('```\nAYYO\n```');
});

test('Supports non-strings', () => {
	expect(codeblock(123)).toBe('```\n123\n```');
});
