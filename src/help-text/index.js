'use strict';

const fs = require('fs').promises;
const path = require('path');

const HELP_TEXT_PATH = path.resolve('src/help-text');

module.exports = async function getHelpText() {
	const fileNames = await fs.readdir(HELP_TEXT_PATH)
		.then(names => names.filter(name => /\.txt$/.test(name)));

	const fileContents = await Promise.all(fileNames
		.map(name => fs.readFile(path.join(HELP_TEXT_PATH, name), 'utf-8')
			.then(contents => ({ name, contents }))));

	return fileContents.reduce((acc, { name, contents }) => ({ [name]: contents }), {});
};
