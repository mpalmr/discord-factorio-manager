'use strict';

const createStatusCommand = require('./create-status-command');
const list = require('./list');
const create = require('./create');
const remove = require('./remove');

const start = createStatusCommand('start');
const stop = createStatusCommand('stop');

const removeCommand = (deps, [name]) => remove(deps, name);

module.exports = {
	list,
	ls: list,
	start: (deps, [name]) => start(deps, name),
	stop: (deps, [name]) => stop(deps, name),
	restart: (deps, [name]) => stop(deps, name).then(() => start(deps, name)),
	create: (deps, [name]) => create(deps, name),
	remove: removeCommand,
	rm: removeCommand,
};
