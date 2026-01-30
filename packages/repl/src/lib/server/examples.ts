import fs from 'node:fs/promises';
import path from 'node:path';
import { create_index } from './content';

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

// Custom read implementation that works in Node and avoids SvelteKit's environment check
const node_read = (pathname: string) => {
	// Vite might return paths starting with / if it treats them as root-relative URLs
	const resolved = pathname.startsWith('/')
		? path.resolve(process.cwd(), pathname.slice(1))
		: path.resolve(process.cwd(), pathname);

	return {
		text: () => fs.readFile(resolved, 'utf-8'),
		json: () => fs.readFile(resolved, 'utf-8').then(JSON.parse),
		arrayBuffer: () => fs.readFile(resolved).then((b) => b.buffer)
	};
};

// https://github.com/vitejs/vite/issues/17453
export const index = await create_index(
	examples_content,
	examples_assets,
	{},
	'../../../content',
	node_read as any
);

export const examples = index.examples.children;
