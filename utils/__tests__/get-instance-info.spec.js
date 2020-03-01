'use strict';

const fs = require('fs').promises;
const getInstanceInfo = require('../get-instance-info');

jest.mock('fs', () => ({
	promises: {
		readdir: jest.fn(),
		readFile: jest.fn(),
	},
}));

test('Gets specific file\'s info', async () => {
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
