'use strict';

const docker = require('./docker');

module.exports = async function dockerList() {
	return docker.command('ps -a')
		.then(({ containerList }) => containerList
			.filter(container => container.image === 'factoriotools/factorio'));
};
