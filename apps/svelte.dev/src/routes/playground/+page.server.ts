import { error } from '@sveltejs/kit';
import type { Examples } from './api/examples/all.json/+server.js';

export async function load({ fetch }) {
	// Load 'hello-world' by default or list of examples
	const examples_res = fetch('/playground/api/examples/all.json').then((r) => r.json());
	
    // We always load hello-world as a fallback for the "default" state 
    // if OPFS is empty.
	const res = await fetch(`/playground/api/hello-world.json`);

	if (!res.ok) {
		error(res.status);
	}

	const [default_gist, examples] = await Promise.all([res.json(), examples_res as Promise<Examples>]);

	return {
		default_gist, // Renamed from gist to clarify it's just the fallback
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
