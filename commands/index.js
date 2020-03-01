'use strict';

const list = require('./list');
const create = require('./create');

const listCommand = channel => list(channel);

module.exports = {
	list: listCommand,
	ls: listCommand,
	create: (deps, [name]) => create(deps, name),
};
