'use strict';

const fs = require('fs').promises;
const columnify = require('columnify');
const { VOLUMES_PATH } = require('../constants');
const codeblock = require('../utils/codeblock');

function parsePorts(ports) {
	return ports
		.split(', ')
		.find(port => port.includes('tcp'))
		.split(':')[1]
		.split('->')[0];
}

module.exports = async function listCommand({ channel, docker }) {
	return Promise.all([
		fs.readdir(VOLUMES_PATH).then(volumes => volumes),
		docker.command('ps -a').then(({ containerList }) => containerList),
	])
		.then(([volumeNames, containers]) => containers
			.filter(container => volumeNames.includes(container.names)))
		.then(containers => containers.map(container => ({
			id: container['container id'],
			name: container.names,
			status: container.status,
			url: `${process.env.FACTORIO_HOST}:${parsePorts(container.ports)}`,
		})))
		.then(gameInfo => {
			channel.send(codeblock(columnify(gameInfo, {
				columns: ['id', 'name', 'status', 'url'],
			})));
			return gameInfo;
		});
};
