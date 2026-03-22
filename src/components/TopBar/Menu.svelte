<script lang="ts">
	import { apps } from '🍎/state/apps.svelte.ts';
	import { menubar_state } from '🍎/state/menubar.svelte.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';

	const { menu }: { menu: any } = $props();

	function openApp(app_id: keyof typeof apps.open) {
		apps.open[app_id] = true;
		apps.minimized[app_id] = false;
		apps.restoring[app_id] = false;
		apps.active = app_id;
	}

	function closeWebsite() {
		window.open('', '_self');
		window.close();

		if (!window.closed) {
			window.location.replace('about:blank');
		}
	}

	function reloadWebsite() {
		window.location.reload();
	}

	function handleMenuAction(item_id: string, disabled?: boolean) {
		if (disabled) return;

		switch (item_id) {
			case 'about-this-mac':
				window.location.href = 'https://github.com/orpheusdark/gui-portfolio';
				break;
			case 'app-store':
				openApp('appstore');
				break;
			case 'restart':
			case 'lock-screen':
			case 'logout':
				reloadWebsite();
				break;
			case 'shutdown':
				closeWebsite();
				break;
			case 'about-finder':
				openApp('orpheus-twitter');
				break;
			case 'macos-help':
				openApp('finder');
				break;
		}

		menubar_state.active = '';
	}
</script>

<section class="container" class:dark={preferences.theme.scheme === 'dark'}>
	{#each Object.entries(menu) as Array<[any, any]> as [item_id, val]}
		<button class="menu-item" disabled={val.disabled} onclick={() => handleMenuAction(item_id, val.disabled)}>{val.title}</button>
		{#if val.breakAfter}
			<div class="divider"></div>
		{/if}
	{/each}
</section>

<style>
	.container {
		/* // Initial invisible border */
		--additional-box-shadow: 0 0 0 0 white;

		display: block;

		min-width: 16rem;
		width: max-content;

		padding: 0.5rem;

		position: relative;

		user-select: none;

		background-color: hsla(var(--system-color-light-hsl), 0.3);
		backdrop-filter: blur(25px);

		border-radius: 0.5rem;

		box-shadow:
			hsla(0, 0%, 0%, 0.3) 0px 0px 11px 0px,
			var(--additional-box-shadow);

		&.dark {
			--additional-box-shadow: inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
				0 0 0 1.2px hsla(var(--system-color-light-hsl), 0.3);
		}
	}

	.menu-item {
		--alpha: 1;

		display: flex;
		justify-content: flex-start;

		width: 100%;

		padding: 0.2rem 0.4rem;
		margin: 0.1rem;

		letter-spacing: 0.4px;
		font-weight: 400 !important;
		font-size: 0.9rem !important;

		border-radius: 0.3rem;

		transition: none;

		color: hsla(var(--system-color-dark-hsl), var(--alpha));

		&:disabled {
			--alpha: 0.5;
		}

		&:not(:disabled) {
			&:hover,
			&:focus-visible {
				background-color: var(--system-color-primary);
				color: var(--system-color-primary-contrast);
				font-weight: 500 !important;
			}
		}
	}

	.divider {
		width: 100%;
		height: 0.2px;

		background-color: hsla(var(--system-color-dark-hsl), 0.3);

		margin: 2px 0;
	}
</style>
