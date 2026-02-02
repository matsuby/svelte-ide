<script lang="ts">
	import * as doNotZip from 'do-not-zip';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { onMount, setContext } from 'svelte';
	import Repl from '../lib/Repl.svelte';
	import { save_project, load_project, type ProjectState } from '../lib/storage';
	import type { File } from '../lib/Workspace.svelte.js';
	import '../lib/styles/index.css';

	let { data } = $props();

	let repl = $state() as ReturnType<typeof Repl>;
	let name = $state(data.default_gist.name);
	let modified = $state(false);

	let version = $derived(page.url.searchParams.get('version') || 'latest');

	const relaxed = true;
	const can_escape = false;

	function munge(data: any): File {
		const basename = `${data.name}.${data.type}`;

		return {
			type: 'file',
			name: basename,
			basename,
			contents: data.source,
			text: true
		};
	}

	async function init() {
		const project = await load_project();
		if (project) {
			restore_project(project);
		} else {
			load_files_from_gist(data.default_gist);
		}
	}

	function restore_project(project: ProjectState) {
		name = project.name;
		repl.set({
			files: project.files.map((f) => ({
				name: `${f.name}`,
				type: 'file',
				basename: f.name,
				contents: f.contents,
				text: true
			})),
			tailwind: project.tailwind
		});
		modified = false;
	}

	function load_files_from_gist(gist: any) {
		name = gist.name;
		repl.set({
			files: JSON.parse(JSON.stringify(gist.components)).map(munge),
			tailwind: false
		});
		modified = false;
		save();
	}

	async function load_example(slug: string) {
		try {
			const res = await fetch(`/api/${slug}.json`);
			if (res.ok) {
				const gist = await res.json();
				load_files_from_gist(gist);
			} else {
				alert('Failed to load example');
			}
		} catch (e) {
			console.error(e);
			alert('Failed to load example');
		}
	}

	let saving: any = null;
	function save() {
		if (!browser) return;
		clearTimeout(saving);
		saving = setTimeout(async () => {
			const { files, tailwind } = repl.toJSON();
			const storage_files = (files as any[]).map((f) => ({
				name: f.name,
				type: 'file' as const,
				contents: f.source ?? f.contents
			}));

			await save_project({
				name,
				files: storage_files,
				tailwind
			});
			modified = false;
		}, 500);
	}

	function onchange() {
		modified = true;
		save();
	}

	onMount(() => {
		init();
	});

	async function download() {
		const { files: components, imports } = repl.toJSON();

		// TODO: Implement a mechanism to update svelte-template.json using `sv` (like the original implementation)
		try {
			const response = await fetch('/svelte-template.json');
			if (!response.ok) throw new Error();
			
			const files: Array<{ path: string; data: string }> = await response.json();

			if (imports.length > 0) {
				const idx = files.findIndex(({ path }) => path === 'package.json');
				const pkg = JSON.parse(files[idx].data);
				const { devDependencies } = pkg;
				imports.forEach((mod) => {
					const match = /^(@[^/]+\/)?[^@/]+/.exec(mod)!;
					devDependencies[match[0]] = 'latest';
				});
				pkg.devDependencies = devDependencies;
				files[idx].data = JSON.stringify(pkg, null, '  ');
			}

			files.push(
				...components.map((component) => ({
					path: `src/routes/${component.name}`,
					data: (component as File).contents
				}))
			);

			const url = URL.createObjectURL((doNotZip as any).toBlob(files));
			const link = document.createElement('a');
			link.href = url;
			link.download = 'svelte-app.zip';
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
			URL.revokeObjectURL(url);
			link.remove();
		} catch (e) {
			console.error(e);
			alert('Download failed: svelte-template.json not found or error occurred.');
		}
	}
</script>

<svelte:head>
	<title>{name} • Svelte IDE</title>
</svelte:head>

<div class="repl-outer">
	<Repl
		bind:this={repl}
		svelteVersion={version}
		{relaxed}
		{can_escape}
		{onchange}
		{download}
		examples={data.examples}
		onselect={load_example}
		previewTheme={'light'}
	/>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.repl-outer {
		position: relative;
		height: 100vh;
		overflow: hidden;
		background-color: var(--sk-bg-1);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	/* temp fix for #2499 and #2550 while waiting for a fix for https://github.com/sveltejs/svelte-repl/issues/8 */
	.repl-outer :global(.tab-content),
	.repl-outer :global(.tab-content.visible) {
		pointer-events: all;
		opacity: 1;
	}
	.repl-outer :global(.tab-content) {
		visibility: hidden;
	}
	.repl-outer :global(.tab-content.visible) {
		visibility: visible;
	}
</style>
