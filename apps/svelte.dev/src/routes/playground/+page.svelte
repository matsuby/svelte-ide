<script lang="ts">
	// @ts-expect-error no types
	import * as doNotZip from 'do-not-zip';
	import { browser } from '$app/environment';
	import { Repl } from '@sveltejs/repl';
	import { mapbox_setup } from '../../config.js';
	import AppControls from './AppControls.svelte';
	import { save_project, load_project, type ProjectState } from './storage';
	import { page } from '$app/state';
	import type { File } from '@sveltejs/repl/workspace';
	import { onMount } from 'svelte';

	let { data } = $props();

	let repl = $state() as ReturnType<typeof Repl>;
	// svelte-ignore state_referenced_locally
	let name = $state(data.default_gist.name);
	let modified = $state(false);

	let version = $derived(page.url.searchParams.get('version') || 'latest');

	// Playground is not safe enough to allow escaping sandbox without hash confirmation
	// But since we are local-only now, maybe we can relax?
	// For now, keep it safe.
	const can_escape = false;

	// TODO make this munging unnecessary
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
			// Load default hello world
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
			// TODO make this munging unnecessary (using JSON instead of structuredClone for better browser compat)
			files: JSON.parse(JSON.stringify(gist.components)).map(munge),
			tailwind: false // TODO
		});
		modified = false;
		save(); // Save immediately as the current workspace
	}

	async function load_example(slug: string) {
		// If modified, maybe ask for confirmation? For now, just overwrite.
		try {
			const res = await fetch(`/playground/api/${slug}.json`);
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
		// Keep modified "true" visually until saved?
		// Or if we treat OPFS as persistent state, "modified" might mean "unsaved to cloud"?
		// But since we don't have cloud save anymore, "modified" concept is tricky.
		// It used to mean "differs from Gist/Hash".
		// Now it might mean "differs from the Example/Original"?
		// For now, let's just save.
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

		const files: Array<{ path: string; data: string }> = await (
			await fetch('/svelte-template.json')
		).json();

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

		const url = URL.createObjectURL(doNotZip.toBlob(files));
		const link = document.createElement('a');
		link.href = url;
		link.download = 'svelte-app.zip';
		link.style.display = 'none';
		document.body.appendChild(link);
		link.click();
		URL.revokeObjectURL(url);
		link.remove();
	}

	const relaxed = true;
</script>

<svelte:head>
	<title>{name} • Playground • Svelte</title>
	<meta name="description" content="Interactive Svelte playground" />
</svelte:head>

<div class="repl-outer">
	<AppControls examples={data.examples} {repl} bind:name bind:modified onselect={load_example} />

	{#if browser}
		<div style="display: contents">
			<Repl
				bind:this={repl}
				svelteVersion={version}
				{relaxed}
				{can_escape}
				injectedJS={mapbox_setup}
				{onchange}
				{download}
				previewTheme={'light'}
			/>
		</div>
	{/if}
</div>

<style>
	.repl-outer {
		position: relative;
		height: calc(100% - var(--sk-banner-height));
		height: calc(100dvh - var(--sk-banner-height));
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

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
