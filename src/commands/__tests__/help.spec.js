'use strict';

const helpCommand = require('../help');

test('If command has help text display that', async () => expect(helpCommand(
	{
		channel: { send: a => a },
		helpText: {
			foo: 'bar',
			help: 'default',
		},
	},
	'foo',
)).resolves.toBe('```\nbar\n```'));

test('If command has no help text display default information', async () => expect(helpCommand(
	{
		channel: { send: a => a },
		helpText: {
			foo: 'bar',
			help: 'default',
		},
	},
	'asdf',
)).resolves.toBe('```\ndefault\n```'));
