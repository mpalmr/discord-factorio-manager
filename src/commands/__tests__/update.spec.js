'use strict';

const updateCommand = require('../update');

const channel = { send: jest.fn() };
const docker = { command: jest.fn() };
const logger = { info: jest.fn() };

beforeEach(() => {
	channel.send.mockReset();
	docker.command.mockReset();
	logger.info.mockReset();
});

test('Does not use logger or send to channel if there was no update', async () => {
	docker.command.mockResolvedValue({ raw: 'no update' });

	await updateCommand({ channel, docker, logger });
	expect(logger.info).not.toHaveBeenCalled();
	expect(channel.send).not.toHaveBeenCalled();
});

test('Logs but does not send to channel if there has been an update but the channel is not provided', async () => {
	docker.command.mockResolvedValue({
		raw: 'sfljsdf\r\nsdfdsf\r\nDownloaded newer image for\r\nsdfds',
	});

	await updateCommand({ docker, logger });
	expect(logger.info).toHaveBeenCalled();
	expect(channel.send).not.toHaveBeenCalled();
});

test('Logs and sends to channel if there has been an update', async () => {
	docker.command.mockResolvedValue({
		raw: 'sfljsdf\r\nsdfdsf\r\nDownloaded newer image for\r\nsdfds',
	});

	await updateCommand({ channel, docker, logger });
	expect(logger.info).toHaveBeenCalled();
	expect(channel.send).toHaveBeenCalled();
});
