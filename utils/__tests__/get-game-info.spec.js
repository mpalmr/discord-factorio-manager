'use strict';

const fs = require('fs').promises;
const getGameInfo = require('../get-game-info');

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

	return getGameInfo('mockInstanceName').then(result => {
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
			return `
FROM factoriotools/factorio

EXPOSE 34197/udp
EXPOSE 34197/tcp

VOLUME /opt/factorio/one /factorio

ENTRYPOINT ["/bin/sh -c \\"mkdir -p /opt/factorio/one && chown -R 845:845 /opt/factorio/one && exec /docker-entrypoint.sh\\""]
`.trim();
		}
		if (name === 'two.Dockerfile') {
			return `
FROM factoriotools/factorio

EXPOSE 34297/udp
EXPOSE 34297/tcp

VOLUME /opt/factorio/two /factorio

ENTRYPOINT ["/bin/sh -c \\"mkdir -p /opt/factorio/two && chown -R 845:845 /opt/factorio/two && exec /docker-entrypoint.sh\\""]
`.trim();
		}
		return `
FROM factoriotools/factorio

EXPOSE 34397/udp
EXPOSE 34397/tcp

VOLUME /opt/factorio/three /factorio

ENTRYPOINT ["/bin/sh -c \\"mkdir -p /opt/factorio/two && chown -R 845:845 /opt/factorio/two && exec /docker-entrypoint.sh\\""]
`.trim();
	});

	return getGameInfo().then(result => {
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
