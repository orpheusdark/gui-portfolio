import { svelte } from '@sveltejs/vite-plugin-svelte';
import UnpluginIcons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { VitePWA } from 'vite-plugin-pwa';
import { browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';

import { prefetch } from './prefetch-plugin';

declare const process: {
	env: Record<string, string | undefined>;
};

const repo_name = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = process.env.GITHUB_ACTIONS === 'true' && repo_name ? `/${repo_name}/` : '/';

export default defineConfig({
	base,
	plugins: [
		svelte(),
		prefetch(),

		UnpluginIcons({ autoInstall: true, compiler: 'svelte' }),
		VitePWA({
			includeAssets: [
				'robots.txt',
				'app-icons/finder/32.png',
				'cover-image.png',
				'cursors/(normal|link|text|help)-select.svg',
				'**/*.mp3',
			],
			manifest: {
				name: 'NirantOS - Developer OS',
				short_name: 'NirantOS',
				theme_color: '#ffffff',
				description:
					'Cybersecurity-focused developer OS portfolio of Nirant Chavda, Computer Engineering Student.',
				icons: [
					{
						src: 'app-icons/finder/128.png',
						sizes: '128x128',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/256.png',
						sizes: '256x256',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable',
					},
				],
			},
		}),
		imagetools({}),
	],
	resolve: {
		alias: {
			'🍎': new URL('./src/', import.meta.url).pathname,
		},
	},
	build: {
		minify: 'terser',
		cssMinify: 'lightningcss',
	},
	css: {
		transformer: 'lightningcss',
		lightningcss: {
			targets: browserslistToTargets(browserslist('defaults, not IE 11, not IE_Mob 11, not dead')),
		},
	},
});
