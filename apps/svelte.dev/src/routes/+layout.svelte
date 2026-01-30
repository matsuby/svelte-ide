<script lang="ts">
	import '@sveltejs/site-kit/styles/index.css';
	import { Shell } from '@sveltejs/site-kit/components';

	let { children: layout_children } = $props();
</script>

<svelte:head>
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
	<meta name="og:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
</svelte:head>

<Shell>
	{#snippet children()}
		{@render layout_children()}
	{/snippet}
</Shell>
