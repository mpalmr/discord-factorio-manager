'use strict';

const getHelpText = require('..');

test('Gets all help files', async () => {
	const helpText = await getHelpText();
	expect(Object.values(helpText).every(a => typeof a === 'string')).toBe(true);
});
