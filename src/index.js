'use strict';

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const Discord = require('discord.js');
const commands = require('./commands');

module.exports = function createBot() {
	const client = new Discord.Client();

	client.once('ready', () => {
		fs
			.mkdir(path.resolve('containers'))
			.catch(error => (error.code === 'EEXIST' ? error : Promise.reject(error)));
	});

	client.on('message', ({ channel, content }) => {
		if (new RegExp(`^\\s*${process.env.COMMAND_PREFIX}`).test(content)) {
			const [commandName, ...args] = content.trim().slice(1).split(/\s+/g);
			const command = commands[commandName];
			if (command) command(channel, args);
			else channel.send('Command not found.');
		}
	});

	client.login(process.env.DISCORD_BOT_TOKEN);
};
