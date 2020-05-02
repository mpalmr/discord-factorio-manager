'use strict';

const gameExists = require('../utils/game-exists');

module.exports = function createStatusCommand(status) {
	return async ({ channel, docker, logger }, name) => {
		if (!await gameExists(name)) {
			channel.send('Game does not exist.');
			return null;
		}

		const statusResult = await docker.command(`${status} ${name}`).catch(error => {
			logger.error(error);
			channel.send(`Could not ${status} game.`);
			return null;
		});

		logger.info(statusResult);
		channel.send(`Game ${status === 'start' ? 'started' : 'stopped'}.`);
		return statusResult;
	};
};
