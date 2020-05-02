'use strict';

const path = require('path');
const winston = require('winston');

module.exports = function createLogger() {
	return winston.createLogger({
		level: 'info',
		format: winston.format.simple(),
		defaultMeta: { service: 'user-service' },
		transports: [
			new winston.transports.File({ filename: path.resolve('logs/combined.log') }),
			new winston.transports.File({
				filename: path.resolve('logs/error.log'),
				level: 'error',
			}),
		],
	});
};
