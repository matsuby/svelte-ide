import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import type { PluginOption, UserConfig } from 'vite';
import { browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';

const plugins: PluginOption[] = [
	enhancedImages(),
	sveltekit() as PluginOption
];

// Only enable sharp if we're not in a webcontainer env
if (!process.versions.webcontainer) {
	plugins.push(
		(await import('vite-imagetools')).imagetools({
			exclude: 'content/**',
			defaultDirectives: (url) => {
				if (url.searchParams.has('big-image')) {
					return new URLSearchParams('w=640;1280;2560;3840&format=avif;webp;png&as=picture');
				}

				return new URLSearchParams();
			}
		}) as PluginOption
	);
}

const config: UserConfig = {
	plugins,
	css: {
		transformer: 'lightningcss',
		lightningcss: {
			targets: browserslistToTargets(browserslist(['>0.2%', 'not dead']))
		}
	},
	build: {
		cssMinify: 'lightningcss',
		rollupOptions: {
			output: {
				banner: (chunk) => {
					// this monstrosity is required for twoslash (which uses `require`) to work during prerendering.
					// it is brittle and may not work in perpetuity but i'm not sure what a better solution would be
					if (chunk.type === 'chunk' && chunk.name === 'renderer') {
						return `import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);`;
					}

					return '';
				}
			}
		}
	},
	server: {
		fs: { allow: ['../../packages', '../../../KIT/kit/packages/kit'] }
	},
	optimizeDeps: {
		exclude: ['@sveltejs/site-kit', '@sveltejs/repl', '@rollup/browser']
	},
	ssr: {
		noExternal: ['@sveltejs/site-kit', '@sveltejs/repl']
	},
	worker: {
		format: 'es'
	}
};

export default config;
