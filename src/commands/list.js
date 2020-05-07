'use strict';

const fs = require('fs').promises;
const columnify = require('columnify');
const { VOLUMES_PATH } = require('../constants');
const codeblock = require('../utils/codeblock');

function parseGuestPort(ports) {
	return !ports ? null : ports
		.split(', ')
		.find(port => /tcp$/.test(port))
		.split(':')[1]
		.split('->')[0];
}

module.exports = async function listCommand({ channel, docker }) {
	const games = await Promise.all([
		fs.readdir(VOLUMES_PATH),
		docker.command('ps -a').then(({ containerList }) => containerList),
	])
		.then(([volumeNames, containers]) => containers
			.filter(container => volumeNames.includes(container.names))
			.map(container => ({
				id: container['container id'],
				name: container.names,
				host: `${process.env.FACTORIO_HOST}:${parseGuestPort(container.ports)}`,
				status: container.status,
			})));

	const rows = games.map(({ id, ...game }) => game);

	if (rows.length) {
		channel.send(codeblock(columnify(rows, {
			columns: ['name', 'host', 'status'],
			columnSplitter: '    ',
		})));
	} else {
		channel.send('No instance have been created yet.');
	}

	return games;
};
