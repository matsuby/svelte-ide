import fs from 'node:fs/promises';
import path from 'node:path';
import { examples } from '../../../../lib/server/examples.js';
import { json } from '@sveltejs/kit';

export type Examples = Array<{
	title: string;
	examples: Array<{
		title: string;
		slug: string;
		components: Array<{ name: string; type: string; source: string }>;
	}>;
}>;

export const prerender = true;

async function munge(files: Record<string, string>) {
	const result = [];

	for (const [file, source] of Object.entries(files)) {
		const dot = file.lastIndexOf('.');
		let name = file.slice(0, dot);
		let type = file.slice(dot + 1);

		const resolved = source.startsWith('/')
			? path.resolve(process.cwd(), source.slice(1))
			: path.resolve(process.cwd(), source);

		result.push({ name, type, source: await fs.readFile(resolved, 'utf-8') });
	}

	result.sort((a, b) => {
		if (a.name === 'App' && a.type === 'svelte') return -1;
		if (b.name === 'App' && b.type === 'svelte') return 1;

		if (a.type !== b.type) return a.type === 'svelte' ? -1 : 1;

		return a.name < b.name ? -1 : 1;
	});

	return result;
}

export async function GET() {
	return json(
		(await Promise.all(
			examples.map(async (section) => ({
				title: section.metadata.title,
				examples: await Promise.all(
					section.children.map(async (example) => ({
						title: example.metadata.title,
						slug: example.slug.split('/').pop()!,
						components: await munge(example.assets!)
					}))
				)
			}))
		)) as Examples
	);
}
