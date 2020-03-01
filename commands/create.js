'use strict';

const path = require('path');
const fs = require('fs').promises;
const { build } = require('../docker');

module.exports = async function createCommand(channel, name, port) {
	const dockerFilePath = path.resolve(`containers/${name}.Dockerfile`);

	const contents = `
FROM factoriotools/factorio

EXPOSE ${port}/tcp
EXPOSE ${port}/udp

VOLUME /opt/factorio/${name} /factorio
`.trim();

	return fs.access(path.resolve(dockerFilePath))
		.then(() => Promise.all([
			fs.writeFile(dockerFilePath, contents),
			fs.mkdir(path.resolve(`/opt/factorio/${name}`)),
		]))
		.then(() => build(name))
		.then(console.log)
		.catch(error => {
			if (error.code !== 'EEXIST') Promise.reject(error);
			channel.send('Instance by that name already exists.');
			return null;
		});
};
