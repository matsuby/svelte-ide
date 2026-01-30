<script lang="ts">
	import { page } from '$app/state';
	import ModalDropdown from '$lib/components/ModalDropdown.svelte';
	import SecondaryNav from '$lib/components/SecondaryNav.svelte';
	import type { Repl } from '@sveltejs/repl';

	interface Props {
		examples: Array<{ title: string; examples: any[] }>;
		repl: ReturnType<typeof Repl>;
		name: string;
		modified: boolean;
		onselect: (slug: string) => void;
	}

	let { name = $bindable(), modified = $bindable(), examples, onselect }: Props = $props();

	let active = $state(false);

	function select(slug: string) {
		onselect(slug);
		active = false;
	}
</script>

<SecondaryNav>
	<ModalDropdown label="Examples" bind:active>
		<div class="secondary-nav-dropdown">
			<button class="create-new" onclick={() => select('hello-world')}>Create new</button>

			{#each examples as section}
				<details>
					<summary>{section.title}</summary>

					<ul>
						{#each section.examples as example}
							<li>
								<button class="example-link" onclick={() => select(example.slug)}>
									{example.title}
								</button>
							</li>
						{/each}
					</ul>
				</details>
			{/each}
		</div>
	</ModalDropdown>

	<span class="app-name">{name}</span>

	<div class="buttons"></div>
</SecondaryNav>

<style>
	.buttons {
		display: flex;
		align-items: center;
		gap: 0.2rem;
	}

	.app-name {
		background: transparent;
		color: currentColor;
		width: 0;
		flex: 1;
		padding: 0.2rem 0.6rem;
		height: 3.2rem;
		font: var(--sk-font-ui-medium);
		display: flex;
		align-items: center;
	}

	.create-new {
		margin-bottom: 1rem;
		display: block;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--sk-text-1);
		font: var(--sk-font-ui-medium);
	}

	.example-link {
		display: block;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--sk-text-1);
		padding: 0.2rem 0;
	}

	.example-link:hover,
	.create-new:hover {
		color: var(--sk-theme-1);
	}
</style>
