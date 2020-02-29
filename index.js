'use strict';

require('dotenv').config();
const Discord = require('discord.js');
const commands = require('./commands');

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

const commandPattern = new RegExp(`^\\s*${process.env.COMMAND_PREFIX}`);
client.on('message', ({ channel, content }) => {
	if (commandPattern.test(content)) {
		const [commandName, ...args] = content.trim().slice(1).split(/\s+/g);
		const command = commands[commandName];
		if (command) command(args);
		else channel.send('Command not found.');
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);
