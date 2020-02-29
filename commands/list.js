'use strict';

const columnify = require('columnify');
const codeblock = require('../utils/codeblock');

module.exports = async function listCommand(channel) {
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
