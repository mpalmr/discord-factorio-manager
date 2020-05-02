'use strict';

const fs = require('fs').promises;
const gameExists = require('../game-exists');

jest.mock('fs');

beforeEach(() => {
	fs.readdir.mockClear();
});

test('Returns true if directory is returned that matches the provided name', async () => {
	fs.readdir.mockResolvedValue(['bar', 'foo', 'baz']);
	return expect(gameExists('foo')).resolves.toBe(true);
});

test('Returns false if directory is returned that does not match the provided name', async () => {
	fs.readdir.mockResolvedValue(['foo', 'bar', 'baz']);
	return expect(gameExists('ayyyyy')).resolves.toBe(false);
});
