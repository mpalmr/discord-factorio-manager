'use strict';

require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

const commandPattern = new RegExp(`^\\s*${process.env.COMMAND_PREFIX}`);
function parseMessage(handleCommand) {
	return ({ channel, content }) => {
		if (!commandPattern.test(content)) return null;
		const [commandName, ...args] = content.trim().slice(1).split(/\s+/g);
		return handleCommand(channel, {
			name: commandName.toLowerCase(),
			args,
		});
	};
}

client.on('message', parseMessage((channel, command) => {
	if (command.name === 'ping') channel.send('Pong.');
}));

client.login(process.env.DISCORD_BOT_TOKEN);
