<script lang="ts">
	import { marked } from 'marked';
	import Viewer from './Viewer.svelte';
	import { Workspace } from '../Workspace.svelte';

	interface Props {
		status: string | null;
		runtimeError?: Error | null;
		relaxed?: boolean;
		can_escape?: boolean;
		injectedJS: string;
		injectedCSS: string;
		previewTheme: 'light' | 'dark';
		workspace: Workspace;
	}

	let {
		status,
		runtimeError = $bindable(null),
		relaxed = false,
		can_escape = false,
		injectedJS,
		injectedCSS,
		previewTheme,
		workspace
	}: Props = $props();

	let is_markdown = $derived(workspace.current.name.endsWith('.md'));

	let markdown = $derived(is_markdown ? (marked.parse(workspace.current!.contents) as string) : '');
</script>

<div class="output-container">
	<!-- component viewer -->
	<div class="tab-content" class:visible={!is_markdown}>
		<Viewer
			bind:error={runtimeError}
			{status}
			{relaxed}
			{can_escape}
			{injectedJS}
			{injectedCSS}
			onLog={undefined}
			theme={previewTheme}
		/>
	</div>

	<!-- markdown output -->
	<div class="tab-content" class:visible={is_markdown}>
		<iframe title="Markdown" srcdoc={markdown}></iframe>
	</div>
</div>

<style>
	.output-container {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.tab-content {
		position: absolute;
		width: 100%;
		height: 100% !important;
		visibility: hidden;
		pointer-events: none;
	}

	.tab-content.visible {
		visibility: visible;
		pointer-events: all;
	}

	iframe {
		width: 100%;
		height: 100%;
		border: none;
		display: block;
	}
</style>
