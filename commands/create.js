'use strict';

const { promisify } = require('util');
const path = require('path');
const fs = require('fs').promises;
const rimrafCb = require('rimraf');
const getGameInfo = require('../utils/get-game-info');
const codeblock = require('../utils/codeblock');

const rimraf = promisify(rimrafCb);

const FACTORIO_TCP_PORT = 27015;
const FACTORIO_UDP_PORT = 34197;

module.exports = async function createCommand({ channel, docker }, name) {
	// Validation
	if (!(/^[a-z\d-]{4,}$/.test(name))) {
		channel.send(
			'Invalid name parameter. Must contain 4 or more alphanumeric characters or dashes.',
		);
		return null;
	}

	const games = await getGameInfo().catch(error => {
		channel.send('Unable to read game listing.');
		return Promise.reject(error);
	});
	if (games.some(game => game.name === name)) {
		channel.send('A game with that name already exists.');
		return null;
	}

	// Execute command
	const contents = `
FROM factoriotools/factorio

EXPOSE ${FACTORIO_TCP_PORT}/tcp
EXPOSE ${FACTORIO_UDP_PORT}/udp

VOLUME "/opt/factorio/${name}" "/factorio"
`.trim();

	const dockerFilePath = path.resolve(`containers/${name}.Dockerfile`);
	const mountPath = path.resolve(`containers/mount/${name}`);
	const hostPort = Math.max(games.map(game => game.port)) + 1;

	channel.send(`Creating container '${name}'.`);

	return Promise.all([
		fs.writeFile(dockerFilePath, contents),
		fs.mkdir(path.resolve(`containers/mount/${name}`)),
	])
		.then(() => docker.command(`build -f ${dockerFilePath} -t factorio:${name} .`))
		.then(() => docker.command(`
			run -it \ --name ${name} -d \
				-p ${hostPort}:${FACTORIO_TCP_PORT}/tcp \
				-p ${hostPort}:${FACTORIO_UDP_PORT}/udp \
				factorio:${name}
		`))
		.then(() => docker.command(`stop ${name}`))
		.catch(error => {
			console.error(error);
			channel.send('Could not create container.');
			channel.send(codeblock(error.message));
			return Promise.all([
				fs.unlink(dockerFilePath),
				rimraf(mountPath),
				docker.command(`rm ${name}`),
			]);
		});
};
