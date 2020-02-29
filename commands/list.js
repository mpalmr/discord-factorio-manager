'use strict';

const { dockerCommand } = require('docker-cli-js');
const columnify = require('columnify');
const codeblock = require('../utils/codeblock');

module.exports = async function listCommand(channel) {
	console.log(await dockerCommand('ps -a', { echo: false })
		.then(containers => containers.filter(container => container.image === 'factoriotools/factorio')));
	channel.send(codeblock(columnify(
		[
			{
				instance: 'Vanilla',
				status: 'ONLINE',
			},
			{
				instance: 'Vanilla QoL',
				status: 'OFFLINE',
			},
		],
		{
			columns: ['instance', 'status'],
			columnSplitter: '    ',
		},
	)));
};
