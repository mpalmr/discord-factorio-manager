'use strict';

const path = require('path');
const docker = require('./docker');

module.exports = async function dockerBuild(name) {
	return docker.command(`build -f ${path.resolve(`containers/${name}`)}.Dockerfile .`);
};
