<script lang="ts">
	import '@sveltejs/site-kit/styles/index.css';
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import { Shell } from '@sveltejs/site-kit/components';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { inject } from '@vercel/analytics';

	injectSpeedInsights();
	inject({ mode: dev ? 'development' : 'production' });

	let { data, children: layout_children } = $props();


</script>

<svelte:head>
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
	<meta name="og:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
</svelte:head>

<Shell nav_visible={page.route.id !== '/(authed)/playground/[id]/embed'}>


	{#snippet children()}
		{@render layout_children()}
	{/snippet}
</Shell>

