'use strict';

const path = require('path');
const fs = require('fs').promises;
const { build } = require('../docker');

// TODO: Improve
async function getNextPort() {
	return Promise.all(fs.readdir(path.resolve('containers')))
		.then(files => files
			.map(file => file.split('\n')
				.find(line => line.slice(0, 6) === 'EXPOSE'))
			.map(portLine => portLine
				.split(' ')[1]
				.split('/')[0])
			.map(port => parseInt(port, 10)))
		.then(ports => Math.max(ports) + 1);
}

module.exports = async function createCommand(channel, name) {
	// Validation
	if (!(/^[a-z\d-]{4,}$/i.test(name))) {
		channel.send(
			'Invalid name parameter. Must contain 4 or more alphanumeric characters or dashes.'
		);
	}

	return Promise.all(fs.readdir(path.resolve('containers')));
	// Execute command
	const port = await getNextPort();
	const dockerFilePath = path.resolve(`containers/${name}.Dockerfile`);

	const contents = `FROM factoriotools/factorio

EXPOSE ${port}/tcp
EXPOSE ${port}/udp

VOLUME /opt/factorio/${name} /factorio`;

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
