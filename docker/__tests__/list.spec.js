'use strict';

const dockerList = require('../list');

jest.mock('../docker', () => ({
	async command() {
		return {
			containerList: [
				{
					id: 'mockContainer1',
					image: 'factoriotools/factorio',
				},
				{
					id: 'mockContainer2',
					image: 'not/factorio',
				},
				{
					id: 'mockContainer3',
					image: 'factoriotools/factorio',
				},
				{
					id: 'mockContainer4',
					image: 'not/factorio',
				},
			],
		};
	},
}));

test('Only returns containers with the correct image', async () => expect(dockerList())
	.resolves
	.toEqual([
		{
			id: 'mockContainer1',
			image: 'factoriotools/factorio',
		},
		{
			id: 'mockContainer3',
			image: 'factoriotools/factorio',
		},
	]));
