<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		dropdown,
		align = 'left',
		active = $bindable(false)
	}: {
		children: Snippet;
		dropdown: Snippet;
		align?: 'left' | 'right';
		active?: boolean;
	} = $props();
</script>

<div class="dropdown">
	<button onmouseenter={() => active = true} onmouseleave={() => active = false}>
		{@render children()}
	</button>

	<nav class="dropdown-content" class:align-right={align === 'right'} class:active>
		{@render dropdown()}
	</nav>
</div>

<style>
	.dropdown {
		position: relative;
		display: grid;
	}

	.dropdown-content {
		opacity: 0;
		pointer-events: none;
		position: absolute;
		left: -1rem;
		/* this is a bit of a kludge, but it ensures a contiguous hit area (50% + 50%) while also working for tall links like `Docs` (50% + 1.5rem) */
		top: calc(50% + min(50%, 1.5rem));
		background-color: var(--sk-bg-2);
		z-index: 1;
		filter: var(--sk-shadow);
		border-radius: var(--sk-border-radius);
		z-index: 999;
		transform: var(--safari-fix);
		-webkit-transform: var(--safari-fix);
		will-change: opacity;
		overflow: scroll;

		&.align-right {
			left: auto;
			right: -1rem;
		}
	}

	.dropdown:hover .dropdown-content,
	.dropdown:focus-within .dropdown-content,
	.dropdown-content.active {
		opacity: 1;
		pointer-events: all;
	}
</style>
