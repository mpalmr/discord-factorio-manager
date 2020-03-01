'use strict';

const fs = require('fs').promises;
const createCommand = require('../create');

jest.mock('fs');

const mockChannel = { send: jest.fn() };
const mockDocker = { command: jest.fn() };

beforeEach(() => {
	fs.mkdir.mockClear();
	fs.rmdir.mockClear();
	mockChannel.send.mockClear();
	mockDocker.command.mockClear();
});

const originalEnv = { ...process.env };
afterEach(() => {
	process.env = { ...originalEnv };
});

test('Throws an error for too short a name', async () => createCommand(
	{ channel: mockChannel, docker: mockDocker },
	'abc',
)
	.then(result => {
		expect(result).toBeNull();
		expect(mockChannel.send).toHaveBeenCalledWith(
			'Invalid name parameter. Must contain 4 or more alphanumeric characters or dashes.',
		);
	}));

test('Throws an error for a name with invalid characters', async () => createCommand(
	{ channel: mockChannel, docker: mockDocker },
	'abc$d',
)
	.then(result => {
		expect(result).toBeNull();
		expect(mockChannel.send).toHaveBeenCalledWith(
			'Invalid name parameter. Must contain 4 or more alphanumeric characters or dashes.',
		);
	}));

test('Displays appropriate message when already exists.', async () => {
	fs.mkdir.mockRejectedValue({ code: 'EEXISTS' });
	return createCommand({ channel: mockChannel, docker: mockDocker }, 'mockgamename')
		.then(result => {
			expect(result).toBeNull();
			expect(mockChannel.send).toHaveBeenCalledWith('Game by that name already exists.');
		});
});

test('Cleans up volumes directory on error', async () => {
	fs.mkdir.mockResolvedValue();
	fs.rmdir.mockResolvedValue();
	mockDocker.command.mockRejectedValue({ code: 'EMOCKERROR' });
	return createCommand({ channel: mockChannel, docker: mockDocker }, 'mockgamename')
		.catch(error => {
			expect(error).toEqual({ code: 'EMOCKERROR' });
			expect(fs.rmdir).toHaveBeenCalled();
		});
});

test('Successful creation', async () => {
	fs.mkdir.mockResolvedValue();
	mockDocker.command.mockResolvedValue({ containerId: 'mockContainerId' });
	return createCommand({ channel: mockChannel, docker: mockDocker }, 'mockgamename')
		.then(result => {
			expect(result).toBeNull();
			expect(mockChannel.send).toHaveBeenCalledWith('Game created.');
		});
});
