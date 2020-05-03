'use strict';

const codeblock = require('../utils/codeblock');

const listHelpText = ``;

const removeHelpText = ``;

const commandHelpText = {
	list: listHelpText,
	ls: listHelpText,
	create: ``,
	start: ``,
	stop: ``,
	restart: ``,
	remove: removeHelpText,
	rm: removeHelpText,
};

module.exports = async function helpCommand({ channel }, commandName) {
	return channel.send(codeblock((commandHelpText[commandName] || `
Usage: ~<command> [arguments]

Run \`~help <command>\` for command specific help.

Commands:
\tlist\tLists all game instances and their status
\tcreate\tCreates game instance
\tstart\tStarts a game instance
\tstop\tStops a running game instance
\trestart\tRestarts a running game instance
\tremove\tRemoves a game instance and all save files associated with it
\tls\tAlias for the \`list\` command
\trm\tAlias for the \`remove\` command
`).trim()));
};
