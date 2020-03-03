'use strict';

const fs = require('fs').promises;
const columnify = require('columnify');
const { VOLUMES_PATH } = require('../constants');
const codeblock = require('../utils/codeblock');

function parsePorts(ports) {
	return !ports ? null : ports
		.split(', ')
		.find(port => /tcp$/.test(port))
		.split(':')[1]
		.split('->')[0];
}

module.exports = async function listCommand({ channel, docker, logger }) {
	return Promise.all([
		fs.readdir(VOLUMES_PATH),
		docker.command('ps -a').then(({ containerList }) => containerList),
	])
		.then(([volumeNames, containers]) => containers
			.filter(container => volumeNames.includes(container.names)))
		.then(containers => containers.map(container => ({
			id: container['container id'],
			name: container.names,
			host: `${process.env.FACTORIO_HOST}:${parsePorts(container.ports)}`,
			status: container.status,
		})))
		.then(gameInfo => {
			const rows = gameInfo.map(({ id, ...info }) => info);
			channel.send(codeblock(columnify(rows, {
				columns: ['name', 'host', 'status'],
				columnSplitter: '    ',
			})));
			return gameInfo;
		})
		.catch(error => {
			logger.error(error);
			channel.send('Unable to list games.');
		});
};
