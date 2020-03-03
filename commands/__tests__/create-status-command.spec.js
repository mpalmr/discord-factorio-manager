'use strict';

const fs = require('fs').promises;
const createStatusCommand = require('../create-status-command');

jest.mock('fs');

const mockChannel = { send: jest.fn() };
const mockDocker = { command: jest.fn() };

beforeEach(() => {
	fs.readdir.mockClear();
	mockChannel.send.mockClear();
	mockDocker.command.mockClear();
});

test('If container does not exist send message', async () => {
	fs.readdir.mockResolvedValue([]);
	const startCommand = createStatusCommand('start');
	return startCommand(
		{ channel: mockChannel, docker: mockDocker },
		'mockname',
	)
		.then(result => {
			expect(result).toBeNull();
			expect(mockChannel.send).toHaveBeenCalledWith('Game does not exist.');
		});
});

test('If container cannot start send message', async () => {
	fs.readdir.mockResolvedValue(['a', 'mockname', 'b']);
	mockDocker.command.mockRejectedValue(new Error('mockError'));
	const startCommand = createStatusCommand('start');
	return startCommand(
		{ channel: mockChannel, docker: mockDocker },
		'mockname',
	)
		.then(result => {
			expect(result).toBeNull();
			expect(mockDocker.command).toHaveBeenLastCalledWith('start mockname');
			expect(mockChannel.send).toHaveBeenCalledWith('Could not start game.');
		});
});

test('If container does exist start container and send message', async () => {
	fs.readdir.mockResolvedValue(['a', 'mockname', 'b']);
	mockDocker.command.mockResolvedValue('mockStatusResult');
	const startCommand = createStatusCommand('start');
	return startCommand(
		{ channel: mockChannel, docker: mockDocker },
		'mockname',
	)
		.then(result => {
			expect(result).toBe('mockStatusResult');
			expect(mockDocker.command).toHaveBeenCalledWith('start mockname');
			expect(mockChannel.send).toHaveBeenCalledWith('Game started.');
		});
});

describe('Other statuses', () => {
	test('Cannot stop game that does not exist', async () => {
		fs.readdir.mockResolvedValue(['a', 'mockname', 'b']);
		mockDocker.command.mockRejectedValue(new Error('mockStopError'));
		const stopCommand = createStatusCommand('stop');
		return stopCommand(
			{ channel: mockChannel, docker: mockDocker },
			'mockname',
		)
			.then(result => {
				expect(result).toBeNull();
				expect(mockChannel.send).toHaveBeenCalledWith('Could not stop game.');
			});
	});

	test('Successful stop message', async () => {
		fs.readdir.mockResolvedValue(['a', 'mockname', 'b']);
		mockDocker.command.mockResolvedValue('mockStatusResult');
		const stopCommand = createStatusCommand('stop');
		return stopCommand(
			{ channel: mockChannel, docker: mockDocker },
			'mockname',
		)
			.then(result => {
				expect(result).toBe('mockStatusResult');
				expect(mockDocker.command).toHaveBeenCalledWith('stop mockname');
				expect(mockChannel.send).toHaveBeenCalledWith('Game stopped.');
			});
	});
});
