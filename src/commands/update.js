'use strict';

module.exports = async function updateCommand({ channel, docker, logger }) {
	const isUpdated = await docker
		.command('pull factoriotool/factorio')
		.then(pullResult => pullResult.raw.includes('Downloaded newer image for'));
	if (isUpdated) {
		logger.info('Factorio has been updated to its latest version.');
		if (channel) channel.send('Factorio version has been updated to the latest version.');
	}
};
