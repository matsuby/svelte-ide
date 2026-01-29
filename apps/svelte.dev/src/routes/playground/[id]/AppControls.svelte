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
	}

	let {
		name = $bindable(),
		modified = $bindable(),
		examples
	}: Props = $props();

</script>

<SecondaryNav>
	<ModalDropdown label="Examples">
		<div class="secondary-nav-dropdown">
			<a class="create-new" href="/playground/untitled">Create new</a>

			{#each examples as section}
				<details>
					<summary>{section.title}</summary>

					<ul>
						{#each section.examples as example}
							<li>
								<a
									href="/playground/{example.slug}"
									aria-current={page.params.id === example.slug && !modified ? 'page' : undefined}
								>
									{example.title}
								</a>
							</li>
						{/each}
					</ul>
				</details>
			{/each}
		</div>
	</ModalDropdown>

	<span class="app-name">{name}</span>

	<div class="buttons">
	</div>
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
	}
</style>
