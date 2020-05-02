'use strict';

const removeCommand = require('../remove');

const channel = { send: jest.fn() };
const docker = { command: jest.fn() };
const logger = { error: jest.fn() };

beforeEach(() => {
	channel.send.mockClear();
	docker.command.mockClear();
	logger.error.mockClear();
});

test('Sends success message if game was successfully removed', async () => {
	docker.command.mockResolvedValue({ raw: 'crunckle-blast-9000' });
	await expect(removeCommand({ channel, docker, logger }, 'crunckle-blast-9000')).resolves
		.toEqual({ raw: 'crunckle-blast-9000' });
	expect(channel.send).toHaveBeenCalledTimes(1);
	expect(channel.send).toHaveBeenCalledWith('Removal successful.');
	expect(logger.error).not.toHaveBeenCalled();
});

test('Sends error message if game does not exist', async () => {
	docker.command.mockResolvedValue({ raw: 'asdfsdfNo such containerasdfdsf' });
	await expect(removeCommand({ channel, docker, logger }, 'AY')).resolves.toBeNull();
	expect(channel.send).toHaveBeenCalledTimes(1);
	expect(channel.send).toHaveBeenCalledWith('Game does not exist.');
	expect(logger.error).not.toHaveBeenCalled();
});

test('Logs and sends appropriate error message for unknown error', async () => {
	docker.command.mockResolvedValue({ raw: 'it dun blowed up' });
	await expect(removeCommand({ channel, docker, logger }, 'game-with-mom')).resolves.toBeNull();
	expect(channel.send).toHaveBeenCalledTimes(1);
	expect(channel.send).toHaveBeenCalledWith('An unknown error has occured.');
	expect(logger.error).not.toHaveBeenCalledWith({ raw: 'game-with-mom' });
});
