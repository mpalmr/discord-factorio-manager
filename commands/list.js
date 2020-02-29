'use strict';

const columnify = require('columnify');

module.exports = async function listCommand(channel) {
	channel.send(`\`\`\`
${columnify(
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
	)}
\`\`\`
	`);
};
