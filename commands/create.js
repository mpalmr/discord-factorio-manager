'use strict';

const path = require('path');
const fs = require('fs').promises;
const { VOLUMES_PATH } = require('../constants');

module.exports = async function createCommand({ channel, docker, logger }, name) {
	if (!(/^[a-z\d-]{4,}$/.test(name))) {
		channel.send(
			'Invalid name parameter. Must contain 4 or more alphanumeric characters or dashes.',
		);
		return null;
	}

	const volumePath = path.join(VOLUMES_PATH, name);
	return fs.mkdir(volumePath)
		.then(() => docker.command(`build -t ${process.env.DOCKER_TAG} .`))
		.then(buildResult => {
			logger.info(buildResult);
			return docker.command(`run -dP \
				-v ${volumePath}:/factorio \
				--name ${name} \
				--restart=always \
				factoriotools/factorio
			`);
		})
		.then(runResult => {
			logger.info(runResult);
			return docker.command(`stop ${runResult.containerId}`);
		})
		.then(() => {
			channel.send('Game created.');
			return null;
		})
		.catch(error => {
			if (error.code === 'EEXISTS') {
				channel.send('Game by that name already exists.');
				return null;
			}
			logger.error(error);
			return fs.rmdir(volumePath).catch(logger.error);
		});
};
