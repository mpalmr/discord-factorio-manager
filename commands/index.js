'use strict';

const list = require('./list');

const listCommand = channel => list(channel);

module.exports = {
	list: listCommand,
	ls: listCommand,
};
