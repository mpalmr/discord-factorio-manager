/* eslint-disable max-classes-per-file */

'use strict';

const createDiscordFactorioManager = require('..');

jest.mock('discord.js', () => ({
	Client: class Client {
		constructor() {
			this.once = jest.fn();
			this.on = jest.fn();
			this.login = jest.fn();
		}
	},
}));

jest.mock('docker-cli-js', () => ({ Docker: class Docker {} }));
jest.mock('node-schedule', () => ({ scheduleJob: jest.fn() }));

jest.mock('../commands', () => ({
	commandOne: jest.fn(),
	commandTwo: jest.fn(),
}));
jest.mock('../logger', () => jest.fn());

describe('Message handler', () => {
	const channel = { send: jest.fn() };

	beforeEach(() => {
		channel.send.mockClear();
	});

	test('Does nothing if message does not start with command prefix', () => {
		const client = createDiscordFactorioManager();
		const messageHandler = client.on.mock.calls[0][1];
		const content = { trim: jest.fn() };
		messageHandler({ channel, content });
		expect(content.trim).not.toHaveBeenCalled();
	});
});
