'use strict';

const fs = require('fs').promises;
const listCommand = require('../list');

jest.mock('fs');
jest.mock('columnify', () => jest.fn().mockImplementation(a => a));
jest.mock('../../utils/codeblock', () => jest.fn().mockImplementation(a => a));

const mockChannel = { send: jest.fn() };
const mockDocker = { command: jest.fn() };

const originalEnv = { ...process.env };

beforeEach(() => {
	process.env = { ...originalEnv };
	fs.readdir.mockClear();
	mockDocker.command.mockClear();
});

test('Sends message to channel on any error', async () => {
	const mockError = new Error('mockError');
	fs.readdir.mockRejectedValue(mockError);
	mockDocker.command.mockRejectedValue(mockError);

	return listCommand({ channel: mockChannel, docker: mockDocker }).catch(errors => {
		expect(errors).toEqual(mockError);
		expect(mockChannel.send).toHaveBeenCalledWith('Unable to list games.');
	});
});

test('Successful listing', async () => {
	fs.readdir.mockResolvedValue(['one', 'two', 'three']);
	mockDocker.command.mockResolvedValue({
		containerList: [
			{
				'container id': 'mockId1',
				names: 'one',
				status: 'online',
				ports: '0.0.0.0:32771->27015/tcp, 0.0.0.0:32771->34197/udp',
			},
			{
				'container id': 'mockId2',
				names: 'ayyy',
				status: 'offline',
				ports: '0.0.0.0:33771->27015/tcp, 0.0.0.0:33771->34197/udp',
			},
			{
				'container id': 'mockId3',
				names: 'two',
				status: 'offline',
				ports: '0.0.0.0:34771->27015/tcp, 0.0.0.0:34771->34197/udp',
			},
			{
				'container id': 'mockId4',
				names: 'three',
				status: 'online',
				ports: '0.0.0.0:35771->27015/tcp, 0.0.0.0:35771->34197/udp',
			},
			{
				'container id': 'mockId5',
				names: 'asdfadsf',
				status: 'online',
				ports: '0.0.0.0:36771->27015/tcp, 0.0.0.0:36771->34197/udp',
			},
		],
	});

	return expect(listCommand({ channel: mockChannel, docker: mockDocker })).resolves.toEqual([
		{
			id: 'mockId1',
			name: 'one',
			host: '159.65.219.33:32771',
			status: 'online',
		},
		{
			id: 'mockId3',
			name: 'two',
			host: '159.65.219.33:34771',
			status: 'offline',
		},
		{
			id: 'mockId4',
			name: 'three',
			host: '159.65.219.33:35771',
			status: 'online',
		},
	]);
});
