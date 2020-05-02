'use strict';

const fs = require('fs').promises;
const createCommand = require('../create');

jest.mock('fs');

const channel = { send: jest.fn() };
const docker = { command: jest.fn() };
const logger = {
	info: jest.fn(),
	error: jest.fn(),
};

beforeEach(() => {
	fs.mkdir.mockClear();
	fs.rmdir.mockClear();
	channel.send.mockClear();
	docker.command.mockClear();
	logger.info.mockClear();
	logger.error.mockClear();
});

const originalEnv = { ...process.env };
afterEach(() => {
	process.env = { ...originalEnv };
});

test('Throws an error for too short a name', async () => {
	await expect(createCommand({ channel, docker, logger }, 'abc')).resolves.toBeNull();
	expect(channel.send).toHaveBeenCalledWith(
		'Invalid name parameter. Must contain 4 or more alphanumeric characters or dashes.',
	);
});

test('Throws an error for a name with invalid characters', async () => {
	await expect(createCommand({ channel, docker, logger }, 'abc$d')).resolves.toBeNull();
	expect(channel.send).toHaveBeenCalledWith(
		'Invalid name parameter. Must contain 4 or more alphanumeric characters or dashes.',
	);
});

test('Displays appropriate message when already exists.', async () => {
	fs.mkdir.mockRejectedValue({ code: 'EEXISTS' });

	await expect(createCommand({ channel, docker, logger }, 'mockgamename')).resolves.toBeNull();
	expect(channel.send).toHaveBeenCalledWith('Game by that name already exists.');
});

test('Cleans up volumes directory on error', async () => {
	fs.mkdir.mockResolvedValue();
	fs.rmdir.mockResolvedValue();
	docker.command.mockRejectedValue({ code: 'EMOCKERROR' });

	await expect(createCommand({ channel, docker, logger }, 'mockgamename')).rejects
		.toEqual({ code: 'EMOCKERROR' });
	expect(fs.rmdir).toHaveBeenCalled();
});

test('Successful creation', async () => {
	fs.mkdir.mockResolvedValue();
	docker.command.mockResolvedValue({ containerId: 'mockContainerId' });

	await expect(createCommand({ channel, docker, logger }, 'mockgamename')).resolves.toBeNull();
	expect(channel.send).toHaveBeenCalledWith('Game created.');
});
