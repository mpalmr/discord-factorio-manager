'use strict';

module.exports = function createStatusCommand(status) {
	return async ({ channel, docker, logger }, name) => {
		const statusResult = await docker.command(`${status} ${name}`).catch(error => {
			logger.error(error);
			channel.send(`Could not ${status} game.`);
			return null;
		});

		if (statusResult.raw.includes('No such container')) {
			channel.send('Game does not exist.');
			return null;
		}

		logger.info(statusResult);
		channel.send(`Game ${status === 'start' ? 'started' : 'stopped'}.`);
		return statusResult;
	};
};
