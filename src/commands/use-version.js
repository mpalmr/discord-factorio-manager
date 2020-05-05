'use strict';

module.exports = async function useVersionCommand({ channel, docker, logger }, name, tag) {
	const imageHandle = `factoriotools/factorio:${tag}`;

	// TODO: Determine if container is already using this tag
	const isAlreadyInUse = await docker.command(`container inspect ${name}`);

	// Determine if image exists or not, and if it doesn't pull it
	const exists = await docker
		.command(`images -q ${imageHandle}`)
		.then(result => !!result.raw);
	if (!exists) {
		await docker.command(`pull ${imageHandle}`);
		logger.info(`Pulled image with tag of '${tag}'`);
	}
};
