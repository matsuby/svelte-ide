<script lang="ts">
	import { Dropdown, HoverMenu } from '../components';

	interface Props {
		examples: Array<{ title: string; examples: any[] }>;
		onselect: (slug: string) => void;
	}

	let { examples, onselect }: Props = $props();

	let active = $state(false);

	function select(slug: string) {
		onselect(slug);
		active = false;
	}
</script>

<Dropdown align="right" bind:active>
	<div class="target">
		<span>Templates</span>
	</div>

	{#snippet dropdown()}
		<HoverMenu>
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
		</HoverMenu>
	{/snippet}
</Dropdown>

<style>
	.target {
		text-transform: uppercase;
		font: var(--sk-font-ui-small);
		position: relative;
		display: flex;
		align-items: center;
		height: 100%;
		padding: 0 0.8rem;
		gap: 0.5rem;
		z-index: 2;
		cursor: pointer;
	}

	.secondary-nav-dropdown {
		padding: 1rem;
		min-width: 200px;
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

	details {
		margin-bottom: 0.5rem;
	}

	summary {
		font-weight: bold;
		cursor: pointer;
		padding: 0.2rem 0;
	}

	ul {
		list-style: none;
		padding-left: 1rem;
		margin: 0;
	}
</style>
