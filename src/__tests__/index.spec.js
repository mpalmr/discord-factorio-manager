/* eslint-disable max-classes-per-file */

'use strict';

const schedule = require('node-schedule');
const createDiscordFactorioManager = require('..');
const commands = require('../commands');
const createLogger = require('../logger');

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
	commandOne: jest.fn().mockResolvedValue(),
	commandTwo: jest.fn().mockResolvedValue(),
}));
jest.mock('../logger', () => jest.fn());

const channel = { send: jest.fn() };

beforeEach(() => {
	schedule.scheduleJob.mockClear();
	commands.commandOne.mockClear();
	commands.commandTwo.mockClear();
	createLogger.mockClear();
	channel.send.mockClear();
});

describe('Message handler', () => {
	let originalEnv;
	let client;
	let messageHandler;

	beforeAll(() => {
		originalEnv = process.env;
		Object.assign(process.env, { COMMAND_PREFIX: '~' });
	});

	beforeEach(() => {
		client = createDiscordFactorioManager();
		messageHandler = client.on.mock.calls[0][1];
	});

	afterAll(() => {
		process.env = originalEnv;
	});

	test('Does nothing if message does not start with command prefix', () => {
		messageHandler({
			channel,
			content: 'asdfsdf',
		});
		expect(channel.send).not.toHaveBeenCalled();
		expect(commands.commandOne).not.toHaveBeenCalled();
		expect(commands.commandTwo).not.toHaveBeenCalled();
	});

	test('If the command does not exist send message to channel', () => {
		messageHandler({
			channel,
			content: '~ayyo',
		});
		expect(channel.send).toHaveBeenCalledWith('Command not found.');
		expect(commands.commandOne).not.toHaveBeenCalled();
		expect(commands.commandTwo).not.toHaveBeenCalled();
	});

	test('If the command exists call the command', () => {
		messageHandler({
			channel,
			content: '~commandTwo ay yo',
		});
		expect(channel.send).not.toHaveBeenCalled();
		expect(commands.commandOne).not.toHaveBeenCalled();
		expect(commands.commandTwo).toHaveBeenCalled();
		expect(commands.commandTwo.mock.calls[0][1]).toEqual(['ay', 'yo']);
	});
});
