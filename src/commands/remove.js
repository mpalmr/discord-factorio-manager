'use strict';

module.exports = async function removeCommand({ channel, docker, logger }, name) {
	const rmResult = await docker.command(`rm -vf ${name.trim()}`);

	if (rmResult.raw === name) {
		channel.send('Removal successful.');
		return rmResult;
	}

	if (rmResult.raw.includes('No such container')) channel.send('Game does not exist.');
	else {
		logger.error(rmResult);
		channel.send('An unknown error has occured.');
	}
	return null;
};
