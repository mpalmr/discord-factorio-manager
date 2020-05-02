'use strict';

const fs = require('fs').promises;
const { VOLUME_PATH } = require('../constants');

module.exports = async function gameExists(name) {
	const allGameNames = await fs.readdir(VOLUME_PATH);
	return allGameNames.includes(name);
};
