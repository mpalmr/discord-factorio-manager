'use strict';

const codeblock = require('../utils/codeblock');

module.exports = async function helpCommand({ channel, helpText }, commandName) {
	return channel.send(codeblock(helpText[commandName] || helpText.help));
};
