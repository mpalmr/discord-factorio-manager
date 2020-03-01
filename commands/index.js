'use strict';

const list = require('./list');
const create = require('./create');

const listCommand = channel => list(channel);

module.exports = {
	list: listCommand,
	ls: listCommand,
	create: (channel, [name, port]) => create(channel, name, port),
};
