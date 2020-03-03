'use strict';

const fs = require('fs').promises;
const { VOLUME_PATH } = require('../constants');

module.exports = function createStatusCommand(status) {
	return async ({ channel, docker, logger }, name) => fs
		.readdir(VOLUME_PATH)
		.then(names => {
			if (!names.includes(name)) {
				channel.send('Game does not exist.');
				return null;
			}
			return docker.command(`${status} ${name}`)
				.then(statusResult => {
					logger.info(statusResult);
					channel.send(`Game ${status === 'start' ? 'started' : 'stopped'}.`);
					return statusResult;
				})
				.catch(error => {
					logger.error(error);
					channel.send(`Could not ${status} game.`);
					return null;
				});
		});
};
