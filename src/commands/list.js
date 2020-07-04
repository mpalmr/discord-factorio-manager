'use strict';

const columnify = require('columnify');
const dockerList = require('../docker/list');
const codeblock = require('../utils/codeblock');

module.exports = async function listCommand(channel) {
	console.log(await dockerList());
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
