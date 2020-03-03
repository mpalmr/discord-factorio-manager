'use strict';

const createStatusCommand = require('./create-status-command');
const create = require('./create');
const list = require('./list');

const start = createStatusCommand('start');
const stop = createStatusCommand('stop');

const listCommand = channel => list(channel);

module.exports = {
	start: (deps, [name]) => start(deps, name),
	stop: (deps, [name]) => stop(deps, name),
	create: (deps, [name]) => create(deps, name),
	list: listCommand,
	ls: listCommand,
};
