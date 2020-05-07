'use strict';

const Discord = require('discord.js');
const { Docker } = require('docker-cli-js');
const schedule = require('node-schedule');
const commands = require('./commands');
const createLogger = require('./logger');

module.exports = async function createDiscordFactorioManager() {
	const client = new Discord.Client();
	const docker = new Docker({ echo: false });
	const logger = createLogger();

	client.once('ready', () => {
		// Update image
		schedule.scheduleJob({ minute: 0 }, () => () => {
			// Update image
		});
	});

	client.on('message', ({ channel, content }) => {
		if (new RegExp(`^\\s*${process.env.COMMAND_PREFIX}`).test(content)) {
			const [commandName, ...args] = content.trim().slice(1).split(/\s+/g);
			const command = commands[commandName];
			if (!command) channel.send('Command not found.');
			else {
				command({ channel, docker, logger }, args).catch(error => {
					logger.error(error);
					channel.send('There was an error processing your request.');
				});
			}
		}
	});

	client.login(process.env.DISCORD_BOT_TOKEN);

	return client;
};
