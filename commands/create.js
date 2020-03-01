'use strict';

module.exports = async function createCommand({ channel, docker }, name) {
	// Validation
	if (!(/^[a-z\d-]{4,}$/.test(name))) {
		channel.send(
			'Invalid name parameter. Must contain 4 or more alphanumeric characters or dashes.',
		);
		return null;
	}
	return null;
};
