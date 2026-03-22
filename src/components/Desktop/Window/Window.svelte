<script lang="ts">
	import {
		bounds,
		BoundsFrom,
		ControlFrom,
		controls,
		disabled,
		draggable,
		events,
		position,
	} from '@neodrag/svelte';
	import { onMount, untrack } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	import { rand_int } from '🍎/helpers/random.ts';
	import { sleep } from '🍎/helpers/sleep';
	import { apps, type AppID } from '🍎/state/apps.svelte.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';

	import AppNexus from '../../apps/AppNexus.svelte';
	import TrafficLights from './TrafficLights.svelte';

	const { app_id }: { app_id: AppID } = $props();

	let dragging_enabled = $state(true);

	let is_maximized = $state(false);
	let minimized_transform = $state<string>();

	let windowEl = $state<HTMLElement>();

	const { height, width, resizable } = apps_config[app_id];

	const remModifier = +height * 1.2 >= window.innerHeight ? 24 : 16;

	const randX = rand_int(-600, 600);
	const randY = rand_int(-100, 100);

	let defaultPosition = {
		x: (document.body.clientWidth / 2 + randX) / 2,
		y: (100 + randY) / 2,
	};

	let remembered_width = $state<string>();
	let remembered_height = $state<string>();

	$effect(() => {
		apps.active_z_index;

		if (apps.active === app_id) {
			untrack(() => (apps.z_indices[app_id] = apps.active_z_index));
		}
	});

	function focusApp() {
		apps.active = app_id;
	}

	function windowCloseTransition(
		el: HTMLElement,
		{ duration = preferences.reduced_motion ? 0 : 300 }: SvelteTransitionConfig = {},
	): SvelteTransitionReturnType {
		const existingTransform = getComputedStyle(el).transform;

		return {
			duration,
			easing: sineInOut,
			css: (t) => `opacity: ${t}; transform: ${existingTransform} scale(${t})`,
		};
	}

	function windowOpenTransition(
		el: HTMLElement,
		{ duration = preferences.reduced_motion ? 0 : 260 }: SvelteTransitionConfig = {},
	): SvelteTransitionReturnType {
		const existingTransform = getComputedStyle(el).transform;
		const baseTransform = existingTransform === 'none' ? '' : `${existingTransform} `;
		const isRestoringFromMinimized = apps.restoring[app_id];
		const startScale = isRestoringFromMinimized ? 0.88 : 0.94;
		const startYOffset = isRestoringFromMinimized ? 18 : 0;

		return {
			duration,
			easing: sineInOut,
			css: (t) =>
				`opacity: ${t}; transform: ${baseTransform}translateY(${(1 - t) * startYOffset}px) scale(${startScale + t * (1 - startScale)})`,
		};
	}

	async function maximizeApp() {
		if (!windowEl) return;

		if (!preferences.reduced_motion) {
			windowEl.style.transition = 'height 0.3s ease, width 0.3s ease, transform 0.3s ease';
		}

		if (!is_maximized) {
			dragging_enabled = false;

			const computed = getComputedStyle(windowEl);
			remembered_width = computed.width;
			remembered_height = computed.height;

			minimized_transform = windowEl.style.transform || '';
			windowEl.style.transform = `translate(0px, 27.2px)`;

			windowEl.style.width = `100vw`;
			windowEl.style.height = 'calc(100vh - 1.7rem)';
			windowEl.style.borderRadius = '0';
		} else {
			dragging_enabled = true;
			windowEl.style.transform = minimized_transform;

			windowEl.style.width = remembered_width || `${+width / remModifier}rem`;
			windowEl.style.height = remembered_height || `${+height / remModifier}rem`;
			windowEl.style.borderRadius = '0.75rem';
		}

		is_maximized = !is_maximized;

		apps.fullscreen[app_id] = is_maximized;

		await sleep(300);

		if (!preferences.reduced_motion) windowEl.style.transition = '';
	}

	async function minimizeApp() {
		if (!windowEl) return;

		const duration = preferences.reduced_motion ? 0 : 220;
		const existingTransform = windowEl.style.transform || getComputedStyle(windowEl).transform;

		if (!preferences.reduced_motion) {
			windowEl.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
			windowEl.style.opacity = '0';
			windowEl.style.transform = `${existingTransform} scale(0.96)`;
		}

		await sleep(duration);

		apps.minimized[app_id] = true;
		apps.fullscreen[app_id] = false;
		apps.restoring[app_id] = false;
		is_maximized = false;
		dragging_enabled = true;

		windowEl.style.opacity = '';
		windowEl.style.transition = '';
		windowEl.style.width = remembered_width || `${+width / remModifier}rem`;
		windowEl.style.height = remembered_height || `${+height / remModifier}rem`;
		windowEl.style.borderRadius = '0.75rem';
	}

	function closeApp() {
		apps.open[app_id] = false;
		apps.fullscreen[app_id] = false;
		apps.minimized[app_id] = false;
		apps.restoring[app_id] = false;
	}

	function onWindowIntroEnd() {
		if (apps.restoring[app_id]) apps.restoring[app_id] = false;
	}

	function onAppDragStart() {
		focusApp();
		apps.is_being_dragged = true;
	}

	function onAppDragEnd() {
		apps.is_being_dragged = false;
	}

	onMount(() => windowEl?.focus());
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
	role="application"
	class="container"
	class:dark={preferences.theme.scheme === 'dark'}
	class:active={apps.active === app_id}
	style:width="{+width / remModifier}rem"
	style:height="{+height / remModifier}rem"
	style:resize={resizable && !is_maximized ? 'both' : 'none'}
	style:min-width="18rem"
	style:min-height="12rem"
	style:z-index={apps.z_indices[app_id]}
	tabindex="-1"
	bind:this={windowEl}
	{@attach draggable(() => [
		controls({ allow: ControlFrom.selector('.app-window-drag-handle') }),
		bounds(BoundsFrom.viewport({ bottom: -6000, top: 27.2, left: -6000, right: -6000 })),
		disabled(!dragging_enabled),
		position({ default: defaultPosition }),
		events({ onDragStart: onAppDragStart, onDragEnd: onAppDragEnd }),
	])}
	onclick={focusApp}
	onkeydown={() => {}}
	onintroend={onWindowIntroEnd}
	in:windowOpenTransition
	out:windowCloseTransition
>
	<div class="tl-container {app_id}" use:elevation={'window-traffic-lights'}>
		<TrafficLights
			{app_id}
			on_maximize_click={maximizeApp}
			on_minimize_click={minimizeApp}
			on_close_app={closeApp}
		/>
	</div>

	<AppNexus {app_id} is_being_dragged={apps.is_being_dragged} />
</section>

<style>
	.container {
		--elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.115), 0px 68px 80px rgba(0, 0, 0, 0.23);

		width: 100%;
		height: 100%;

		display: grid;
		grid-template-rows: 1fr;

		position: absolute;

		will-change: width, height;

		border-radius: 0.75rem;
		box-shadow: var(--elevated-shadow);

		cursor: var(--system-cursor-default), auto;
		overflow: auto;

		&.active {
			/* // --elevated-shadow: 0px 6.7px 12px rgba(0, 0, 0, 0.218), 0px 22.3px 40.2px rgba(0, 0, 0, 0.322),
      //   0px 100px 180px rgba(0, 0, 0, 0.54); */
			--elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.28), 0px 68px 80px rgba(0, 0, 0, 0.56);
		}

		&.dark {
			& > :global(section),
			& > :global(div) {
				border-radius: inherit;
				box-shadow:
					inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
					0 0 0 1px hsla(var(--system-color-light-hsl), 0.5),
					var(--elevated-shadow);
			}
		}
	}

	.tl-container {
		position: absolute;
		top: 1rem;
		left: 1rem;

		/* // Necessary, as `.container` tries to apply shadow on it */
		box-shadow: none !important;
	}
</style>
