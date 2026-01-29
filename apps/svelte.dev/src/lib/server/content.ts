import { read } from '$app/server';
import { create_index } from '@sveltejs/site-kit/server/content';

const examples_content = import.meta.glob<string>('../../../content/examples/**/*.md', {
	eager: true,
	query: '?url',
	import: 'default'
});

const examples_assets = import.meta.glob<string>(
	['../../../content/examples/**/+assets/**', '../../../content/examples/**/+assets/**/.env'],
	{
		eager: true,
		query: '?url',
		import: 'default'
	}
);

// https://github.com/vitejs/vite/issues/17453
export const index = await create_index(
	examples_content,
	examples_assets,
	{},
	'../../../content',
	read
);

export const examples = index.examples.children;
