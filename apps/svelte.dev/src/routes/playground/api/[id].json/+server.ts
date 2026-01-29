import { examples } from '$lib/server/content';
import { error, json } from '@sveltejs/kit';
import type { Examples } from '../examples/all.json/+server.js';

export const prerender = 'auto';

export async function GET({ fetch, params }) {
	const examples: Examples = await fetch('/playground/api/examples/all.json').then((r) => r.json());
	const example = examples
		.flatMap((section) => section.examples)
		.find((example) => example.slug.split('/').pop() === params.id);

	if (example) {
		return json({
			id: params.id,
			name: example.title,
			owner: null,
			relaxed: false,
			components: example.components
		});
	}

	error(404, 'not found');
}

export async function entries() {
	return examples
		.flatMap((section) => section.children)
		.map((example) => ({ id: example.slug.split('/').pop()! }));
}
