'use strict';

const path = require('path');
const fs = require('fs').promises;

module.exports = async function createCommand({ channel, docker }, name) {
	if (!(/^[a-z\d-]{4,}$/.test(name))) {
		channel.send(
			'Invalid name parameter. Must contain 4 or more alphanumeric characters or dashes.',
		);
		return null;
	}

	const volumePath = path.resolve(`volumes/${name}`);
	return fs.mkdir(volumePath)
		.then(() => docker.command(`build -t ${process.env.DOCKER_TAG} .`))
		.then(() => docker.command(`run -dP \
			-v ${volumePath}:/factorio \
			--name ${name} \
			--restart=always \
			factoriotools/factorio
		`))
		.then(({ containerId }) => docker.command(`stop ${containerId}`))
		.then(() => {
			channel.send('Game created.');
			return null;
		})
		.catch(error => {
			if (error.code === 'EEXISTS') {
				channel.send('Game by that name already exists.');
				return null;
			}
			return fs.rmdir(volumePath).then(() => Promise.reject(error));
		});
};
