<script lang="ts">
	import type { Workspace } from '../Workspace.svelte';
	import { Checkbox, Toolbox } from '@sveltejs/site-kit/components';

	interface Props {
		workspace: Workspace;
		can_migrate: boolean;
		migrate: () => void;
		download?: () => void;
	}

	let { workspace, can_migrate, migrate, download }: Props = $props();
</script>

<div class="controls">
	<Toolbox>
		<label class="option">
			<span>Toggle Vim mode</span>
			<Checkbox bind:checked={workspace.vim}></Checkbox>
		</label>

		<label class="option">
			<span>Toggle Tailwind</span>
			<Checkbox bind:checked={workspace.tailwind}></Checkbox>
		</label>

		<button disabled={!can_migrate} onclick={migrate}>Migrate to Svelte 5, if possible</button>

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

		<button
			class="copy-button"
			title="Copy `npx sv create --from-playground=&quot;...&quot;` to clipboard"
			aria-label="Copy `npx sv create --from-playground=&quot;...&quot;` to clipboard"
			onclick={() => {
				navigator.clipboard.writeText(
					`npx sv create --from-playground="${window.location.href}"`
				);
			}}
		>
			Set up locally
		</button>
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

	.copy-button {
		position: relative;

		&::before,
		&::after {
			content: '';
			display: block;
			position: absolute;
			width: 100%;
			height: 100%;
			right: 0;
			top: 0;
			background: currentColor;
			mask: no-repeat calc(100% - 1rem) 50% / 1.6rem 1.6rem;
			transition: opacity 0.2s;
			transition-delay: 0.6s;
		}

		&::before {
			mask-image: url(icons/copy-to-clipboard);
		}

		&::after {
			mask-image: url(icons/check);
			opacity: 0;
		}

		&:active::before {
			opacity: 0;
			transition: none;
		}

		&:active::after {
			opacity: 1;
			transition: none;
		}
	}
</style>
