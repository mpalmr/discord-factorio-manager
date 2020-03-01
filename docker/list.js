'use strict';

module.exports = async function dockerList({ docker }) {
	return docker.command('ps -a')
		.then(({ containerList }) => containerList
			.filter(container => container.image === 'factoriotools/factorio'));
};
