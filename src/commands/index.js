'use strict';

const help = require('./help');
const list = require('./list');
const create = require('./create');
const remove = require('./remove');
const useVersion = require('./use-version');
const createStatusCommand = require('./create-status-command');

const start = createStatusCommand('start');
const stop = createStatusCommand('stop');

const removeCommand = (deps, [name]) => remove(deps, name);

module.exports = {
	help: (deps, [name]) => help(deps, name),
	list,
	ls: list,
	start: (deps, [name]) => start(deps, name),
	stop: (deps, [name]) => stop(deps, name),
	restart: (deps, [name]) => stop(deps, name).then(() => start(deps, name)),
	create: (deps, [name]) => create(deps, name),
	remove: removeCommand,
	rm: removeCommand,
	useVersion: (deps, [name, version]) => useVersion(deps, name, version),
	update: (deps, [name]) => useVersion(deps, name, 'latest'),
};
