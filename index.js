'use strict';

require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const Discord = require('discord.js');
const { Docker } = require('docker-cli-js');
const winston = require('winston');
const commands = require('./commands');
const { VOLUMES_PATH } = require('./constants');

const client = new Discord.Client();
const docker = new Docker({ echo: false });

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.simple(),
	defaultMeta: { service: 'user-service' },
	transports: [
		new winston.transports.File({ filename: path.resolve('logs/combined.log') }),
		new winston.transports.File({
			filename: path.resolve('logs/error.log'),
			level: 'error',
		}),
	],
});

client.once('ready', () => {
	Promise.all([
		docker.command('pull factoriotools/factorio'),
		fs
			.mkdir(VOLUMES_PATH, { recursive: true })
			.catch(error => (error.code === 'EEXIST' ? error : Promise.reject(error))),
	]).catch(error => {
		error.forEach(logger.error);
		process.exit(1);
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
