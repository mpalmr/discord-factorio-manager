'use strict';

require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', ({ content, channel }) => {
	if (content === '!ping') channel.send('Pong.');
});

client.login(process.env.DISCORD_BOT_TOKEN);
