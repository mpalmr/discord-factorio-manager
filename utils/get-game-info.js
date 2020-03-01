'use strict';

const path = require('path');
const fs = require('fs').promises;

const containersPath = path.resolve('containers');

function getGameContents(name) {
	return fs.readFile(path.join(containersPath, name), { encoding: 'utf-8' }).then(contents => ({
		name: name.split('.')[0],
		port: parseInt(contents
			.split('\n')
			.find(line => line.slice(0, 6) === 'EXPOSE')
			.split(' ')[1]
			.split('/')[0], 10),
	}));
}

module.exports = async function getInstanceInfo(findGame) {
	return findGame
		? getGameContents(`${findGame}.Dockerfile`)
		: fs.readdir(containersPath).then(names => Promise.all(names
			.filter(name => /\.Dockerfile$/.test(name))
			.map(getGameContents)));
};
