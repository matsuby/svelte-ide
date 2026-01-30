<script lang="ts">
	import type { Workspace } from '../Workspace.svelte';
	import { Checkbox, Toolbox } from '@sveltejs/site-kit/components';

	interface Props {
		workspace: Workspace;
		download?: () => void;
	}

	let { workspace, download }: Props = $props();
</script>

<div class="controls">
	<Toolbox>
		<label class="option">
			<span>Toggle Tailwind</span>
			<Checkbox bind:checked={workspace.tailwind}></Checkbox>
		</label>

		<label class="option">
			<span>Svelte version</span>
			<input
				value={workspace.svelte_version}
				placeholder="latest"
				onchange={(ev) => workspace.set_svelte_version(ev.currentTarget.value || 'latest', true)}
			/>
		</label>

		{#if download}
			<button onclick={download}>Download app</button>
		{/if}
	</Toolbox>
</div>

<style>
	.controls {
		display: flex;
        justify-content: flex-end;
		align-items: center;
		padding: 0 1rem 0 0;
		height: 100%;
	}

	.option {
		height: 3.6rem;
		display: block;

		input {
			background: transparent;
			border: none;
			border-radius: var(--sk-border-radius);
			color: currentColor;
			width: 0;
			flex: 1;
			padding: 0.2rem 0.6rem;
			height: 3.2rem;
			font: var(--sk-font-ui-medium);
			margin: -0.5rem -0.6rem -0.5rem 1rem;
			text-align: right;
		}
	}
</style>
