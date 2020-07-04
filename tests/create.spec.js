'use strict';

const path = require('path');
const fs = require('fs').promises;
const { Docker } = require('docker-cli-js');
const createCommand = require('../src/commands/create');

const GAME_NAME = 'create-command-test123';
const testVolumePath = path.resolve(`volumes/${GAME_NAME}`);

let docker;
const logger = {
	info: jest.fn(),
	error: jest.fn(),
};
const channel = { send: jest.fn() };

beforeAll(() => {
	docker = new Docker({ echo: false });
});

beforeEach(() => {
	jest.clearAllMocks();
});

afterAll(async () => fs.unlink(testVolumePath));

test('Input validation', async () => {
	expect(createCommand({ channel, docker, logger }, '$24jks')).resolves.toBeNull();
	expect(channel.send).toHaveBeenCalledWith(
		'Invalid name parameter. Must contain 4 or more alphanumeric characters or dashes.',
	);
});

test('Successful creation', async () => {
	await expect(createCommand({ channel, docker, logger }, GAME_NAME)).resolves.toBeNull();
	expect(logger.info).toHaveBeenCalled();
	expect(channel.send).toHaveBeenCalledWith('Game created.');
	await expect(fs.access(testVolumePath)).rejects.toBeInstanceOf(Error);
});
