<script lang="ts">
	import '@sveltejs/site-kit/styles/index.css';
	import { browser, dev } from '$app/environment';
	import { page } from '$app/state';
	import { Shell, Banner } from '@sveltejs/site-kit/components';
	import { Nav } from '@sveltejs/site-kit/nav';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { inject } from '@vercel/analytics';

	injectSpeedInsights();
	inject({ mode: dev ? 'development' : 'production' });

	let { data, children: layout_children } = $props();

	const sections: Record<string, string> = {
		playground: 'Playground'
	};
</script>

<svelte:head>
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
	<meta name="og:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
</svelte:head>

<Shell nav_visible={page.route.id !== '/(authed)/playground/[id]/embed'}>
	{#snippet top_nav()}
		<Nav title={sections[page.url.pathname.split('/')[1]!] ?? 'Svelte'} links={[]} />
	{/snippet}

	{#snippet children()}
		{@render layout_children()}
	{/snippet}

	{#snippet banner()}
		{#if data.banner}
			<Banner banner={data.banner} />
		{/if}
	{/snippet}
</Shell>

