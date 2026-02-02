import { error } from '@sveltejs/kit';
import type { Examples } from './api/examples/all.json/+server.js';

export async function load({ fetch }) {
	const examples_res = fetch('/api/examples/all.json').then((r) => r.json());
	
	const res = await fetch(`/api/hello-world.json`);

	if (!res.ok) {
		error(res.status as any);
	}

	const [default_project, examples] = await Promise.all([res.json(), examples_res as Promise<Examples>]);

	return {
		default_project,
		examples: examples
			.filter((section) => !section.title.includes('Embeds'))
			.map((section) => ({
				title: section.title,
				examples: section.examples.map((example) => ({
					title: example.title,
					slug: example.slug
				}))
			}))
	};
}
