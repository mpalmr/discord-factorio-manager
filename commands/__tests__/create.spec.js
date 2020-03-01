'use strict';

const fs = require('fs');
const createCommand = require('../create');
const getGameInfo = require('../../utils/get-game-info');

jest.mock('fs');
jest.mock('../../utils/get-game-info');

const mockChannel = { send: jest.fn() };
const mockDocker = { command: jest.fn() };

beforeEach(() => {
	jest.clearAllMocks();
});

describe('Validation', () => {
	test('Throws an error for too short a name', async () => createCommand(
		{
			channel: mockChannel,
			docker: mockDocker,
		},
		'abc',
	)
		.then(result => {
			expect(result).toBeNull();
			expect(mockChannel.send).toHaveBeenCalledWith(
				'Invalid name parameter. Must contain 4 or more alphanumeric characters or dashes.',
			);
		}));

	test('Throws an error for a name with invalid characters', async () => createCommand(
		{
			channel: mockChannel,
			docker: mockDocker,
		},
		'abc$d',
	)
		.then(result => {
			expect(result).toBeNull();
			expect(mockChannel.send).toHaveBeenCalledWith(
				'Invalid name parameter. Must contain 4 or more alphanumeric characters or dashes.',
			);
		}));

	test('Throws an error if game listing cannot be fetched', async () => {
		getGameInfo.mockRejectedValue(new Error('mockPromise'));
		return createCommand(
			{
				channel: mockChannel,
				docker: mockDocker,
			},
			'mockGame',
		).catch(error => {
			expect(error).toBeInstancecof(Error);
			expect(error.message).toBe('mockPromise');
			expect(mockChannel.send).toHaveBeenCalledWith('Unable to read game listing.');
		});
	});

	test('Throws an error if name already exists', async () => {
		getGameInfo.mockResolvedValue(
			[
				{
					channel: mockChannel,
					docker: mockDocker,
				},
			],
			'factone',
		);

		fs.readdir.mockResolvedValue('factone.Dockerfile');
		fs.readFile.mockResolvedValue(`
FROM factoriotools/factorio

EXPOSE 34197/udp
EXPOSE 34197/tcp

VOLUME /opt/factorio/one /factorio
`);

		return createCommand({
			channel: mockChannel,
			docker: mockDocker,
		}, 'factone')
			.then(result => {
				expect(result).toBeNull();
				expect(mockChannel.send).toHaveBeenCalledWith('A game with that name already exists.');
			});
	});
});
