'use strict';

const path = require('path');
const fs = require('fs').promises;

const containersPath = path.resolve('containers');

function getInstanceContents(name) {
	return fs.readFile(path.join(containersPath, name)).then(contents => ({
		name: name.split('.')[0],
		port: parseInt(contents
			.split('\n')
			.find(line => line.slice(0, 6) === 'EXPOSE')
			.split(' ')[1]
			.split('/')[0], 10),
	}));
}

exports.getInstanceInfo = async function getInstanceInfo(name) {
	return name
		? getInstanceContents(name)
		: fs.readdir(containersPath).then(names => Promise.all(names.map(getInstanceContents)));
};
