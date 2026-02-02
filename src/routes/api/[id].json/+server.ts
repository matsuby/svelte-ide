import { json } from '@sveltejs/kit';
import type { Examples } from '../examples/all.json/+server.js';

export const prerender = 'auto';

export async function GET({ fetch, params }) {
	const examples: Examples = await fetch('/api/examples/all.json').then((r) => r.json());
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

	return new Response('not found', { status: 404 });
}
