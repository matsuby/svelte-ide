import type { EditorState } from '@codemirror/state';
import { OutputChunk, RollupError } from '@rollup/browser';
import type { Readable, Writable } from 'svelte/store';
import type { CompileError } from 'svelte/compiler';
import type { Workspace } from './Workspace.svelte';
import type { BundleResult } from './public';

export type Lang = 'js' | 'svelte' | 'json' | 'md' | 'css' | (string & Record<never, never>);

type StartOrEnd = {
	line: number;
	column: number;
	character: number;
};

export type MessageDetails = {
	start: StartOrEnd;
	end: StartOrEnd;
	filename: string;
	message: string;
};

export type Warning = MessageDetails;

export type File = {
	name: string;
	source: string;
	type: Lang;
	modified?: boolean;
};

export type ReplState = {
	bundle: BundleResult | null;
	bundler: import('./Bundler.svelte').default | null;
	toggleable: boolean;
};

export type ReplContext = {
	bundler: Bundler;
	toggleable: Writable<ReplState['toggleable']>;
	workspace: Workspace;
	svelteVersion: string;
};

export type Document = {
	slug: string;
	file: string;
	metadata: { title: string; [key: string]: any };
	breadcrumbs: Array<{ title: string }>;
	body: string;
	sections: Array<{ slug: string; title: string }>;
	children: Document[];
	prev: null | { slug: string; title: string };
	next: null | { slug: string; title: string };
	assets?: Record<string, string>;
};
