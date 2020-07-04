'use strict';

const createCommand = require('../create');

jest.mock('fs', () => ({
	promises: {
		access: jest.fn(),
		writeFile: jest.fn(),
	},
}));
