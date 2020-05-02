'use strict';

const fs = require('fs').promises;
const createStatusCommand = require('../create-status-command');

jest.mock('fs');

const channel = { send: jest.fn() };
const docker = { command: jest.fn() };
const logger = {
	info: jest.fn(),
	error: jest.fn(),
};

beforeEach(() => {
	fs.readdir.mockClear();
	channel.send.mockClear();
	docker.command.mockClear();
	logger.info.mockClear();
	logger.error.mockClear();
});

test('If container does not exist send message', async () => {
	fs.readdir.mockResolvedValue([]);
	const startCommand = createStatusCommand('start');

	await expect(startCommand({ channel, docker, logger }, 'mockname')).resolves.toBeNull();
	expect(channel.send).toHaveBeenCalledWith('Game does not exist.');
});

test('If container cannot start send message', async () => {
	fs.readdir.mockResolvedValue(['a', 'mockname', 'b']);
	docker.command.mockRejectedValue(new Error('mockError'));
	const startCommand = createStatusCommand('start');

	await expect(startCommand({ channel, docker, logger }, 'mockname')).resolves.toBeNull();
	expect(docker.command).toHaveBeenLastCalledWith('start mockname');
	expect(channel.send).toHaveBeenCalledWith('Could not start game.');
});

test('If container does exist start container and send message', async () => {
	fs.readdir.mockResolvedValue(['a', 'mockname', 'b']);
	docker.command.mockResolvedValue('mockStatusResult');
	const startCommand = createStatusCommand('start');

	await expect(startCommand({ channel, docker, logger }, 'mockname')).resolves
		.toBe('mockStatusResult');
	expect(docker.command).toHaveBeenCalledWith('start mockname');
	expect(channel.send).toHaveBeenCalledWith('Game started.');
});

describe('Other statuses', () => {
	test('Cannot stop game that does not exist', async () => {
		fs.readdir.mockResolvedValue(['a', 'mockname', 'b']);
		docker.command.mockRejectedValue(new Error('mockStopError'));
		const stopCommand = createStatusCommand('stop');

		await expect(stopCommand({ channel, docker, logger }, 'mockname')).resolves.toBeNull();
		expect(channel.send).toHaveBeenCalledWith('Could not stop game.');
	});

	test('Successful stop message', async () => {
		fs.readdir.mockResolvedValue(['a', 'mockname', 'b']);
		docker.command.mockResolvedValue('mockStatusResult');
		const stopCommand = createStatusCommand('stop');

		await expect(stopCommand({ channel, docker, logger }, 'mockname')).resolves
			.toBe('mockStatusResult');
		expect(docker.command).toHaveBeenCalledWith('stop mockname');
		expect(channel.send).toHaveBeenCalledWith('Game stopped.');
	});
});
