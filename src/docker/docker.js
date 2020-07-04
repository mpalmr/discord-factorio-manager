'use strict';

const { Docker } = require('docker-cli-js');

module.exports = new Docker({ echo: process.env.NODE_ENV !== 'production' });
