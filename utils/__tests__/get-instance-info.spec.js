'use strict';

const fs = require('fs').promises;
const getInstanceInfo = require('../get-instance-info');

jest.mock('fs', () => ({
	promises: {
		readdir: jest.fn(),
		readFile: jest.fn(),
	},
}));

beforeEach(() => {
	jest.clearAllMocks();
});

test('Gets specific instance by name', async () => {
	fs.readFile.mockResolvedValue(`FROM factoriotools/factorio

EXPOSE 34197/udp
EXPOSE 34197/tcp

VOLUME /opt/factorio/vanilla /factorio`);

	return getInstanceInfo('mockInstanceName').then(result => {
		expect(result).toEqual({
			name: 'mockInstanceName',
			port: 34197,
		});
		expect(fs.readFile.mock.calls[0][0]).toMatch(/\/containers\/mockInstanceName\.Dockerfile$/);
	});
});

test('Gets all instances', async () => {
	fs.readdir.mockResolvedValue(['one.Dockerfile', 'two.Dockerfile', 'three.Dockerfile']);
	fs.readFile.mockImplementation(async filePath => {
		const name = filePath.split('/')[filePath.split('/').length - 1];
		if (name === 'one.Dockerfile') {
			return `FROM factoriotools/factorio

EXPOSE 34197/udp
EXPOSE 34197/tcp

VOLUME /opt/factorio/one /factorio`;
		}
		if (name === 'two.Dockerfile') {
			return `FROM factoriotools/factorio

EXPOSE 34297/udp
EXPOSE 34297/tcp

VOLUME /opt/factorio/two /factorio`;
		}
		return `FROM factoriotools/factorio

EXPOSE 34397/udp
EXPOSE 34397/tcp

VOLUME /opt/factorio/three /factorio`;
	});

	return getInstanceInfo().then(result => {
		expect(fs.readFile).toHaveBeenCalledTimes(3);
		expect(result).toEqual([
			{
				name: 'one',
				port: 34197,
			},
			{
				name: 'two',
				port: 34297,
			},
			{
				name: 'three',
				port: 34397,
			},
		]);
	});
});
