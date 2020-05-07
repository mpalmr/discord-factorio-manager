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
				--name ${name} \
				-v ${volumePath}:/factorio \
				-e ENABLE_SERVER_LOAD_LATEST=false \
				-e ENABLE_GENERATE_NEW_MAP_SAVE=true \
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
		.catch(async error => {
			if (error.code === 'EEXISTS') {
				channel.send('Game by that name already exists.');
				return null;
			}
			channel.send('Game could not be created.');
			logger.error(error);
			await fs.rmdir(volumePath).catch(logger.error);
			return Promise.reject(error);
		});
};
