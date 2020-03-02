'use strict';

const fs = require('fs').promises;
const columnify = require('columnify');
const { VOLUMES_PATH } = require('../constants');
const codeblock = require('../utils/codeblock');

function parsePorts(ports) {
	return ports
		.split(', ')
		.find(port => /tcp$/.test(port))
		.split(':')[1]
		.split('->')[0];
}

module.exports = async function listCommand({ channel, docker }) {
	return Promise.all([
		fs.readdir(VOLUMES_PATH),
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
		})
		.catch(error => {
			channel.send('Unable to list games.');
			return Promise.reject(error);
		});
};
