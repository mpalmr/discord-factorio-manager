'use strict';

const columnify = require('columnify');
const codeblock = require('../utils/codeblock');

module.exports = async function listCommand({ channel, docker }) {
	return docker.command(`images factorio:${process.env.DOCKER_TAG}`).then(console.log);
};
