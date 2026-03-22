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

	const { height, width, resizable, title } = apps_config[app_id];

	const remModifier = +height * 1.2 >= window.innerHeight ? 24 : 16;

	const randX = rand_int(-600, 600);
	const randY = rand_int(-100, 100);

	let defaultPosition = {
		x: (document.body.clientWidth / 2 + randX) / 2,
		y: (100 + randY) / 2,
	};

	let remembered_width = $state<string>();
	let remembered_height = $state<string>();

	type ResizeDirection =
		| 'top'
		| 'right'
		| 'bottom'
		| 'left'
		| 'top-left'
		| 'top-right'
		| 'bottom-right'
		| 'bottom-left';

	const MIN_WIDTH = 288;
	const MIN_HEIGHT = 192;
	const TOP_BAR_HEIGHT_REM = 1.8;
	const DOCK_HEIGHT_REM = 5.2;

	let is_resizing = $state(false);
	let resize_direction = $state<ResizeDirection>();
	let resize_start_x = $state(0);
	let resize_start_y = $state(0);
	let resize_start_width = $state(0);
	let resize_start_height = $state(0);
	let resize_start_left = $state(0);
	let resize_start_top = $state(0);
	let resize_start_tx = $state(0);
	let resize_start_ty = $state(0);

	let is_sidebar_collapsed = $state(false);
	let sidebar_width = $state(220);
	let is_sidebar_resizing = $state(false);
	let sidebar_resize_start_x = $state(0);
	let sidebar_resize_start_width = $state(0);

	const is_chrome_minimal = $derived(
		app_id === 'finder' || app_id === 'wallpapers' || app_id === 'calculator',
	);
	const show_toolbar = $derived(!is_chrome_minimal);
	const show_sidebar = $derived(!is_chrome_minimal && (app_id === 'appstore' || app_id === 'vscode'));

	$effect(() => {
		apps.active_z_index;

		if (apps.active === app_id) {
			untrack(() => (apps.z_indices[app_id] = apps.active_z_index));
		}
	});

	function focusApp() {
		apps.active = app_id;
	}

	function clamp(value: number, min: number, max: number) {
		return Math.max(min, Math.min(max, value));
	}

	function syncRememberedSize() {
		if (!windowEl) return;

		const computed = getComputedStyle(windowEl);
		remembered_width = computed.width;
		remembered_height = computed.height;
	}

	function getTranslateValue() {
		if (!windowEl) return { x: 0, y: 0 };

		const transform = getComputedStyle(windowEl).transform;
		if (transform === 'none') return { x: 0, y: 0 };

		const matrix = new DOMMatrixReadOnly(transform);
		return { x: matrix.m41, y: matrix.m42 };
	}

	function startResize(event: PointerEvent, direction: ResizeDirection) {
		if (!windowEl || !resizable || is_maximized) return;

		focusApp();

		const rect = windowEl.getBoundingClientRect();

		resize_direction = direction;
		is_resizing = true;
		dragging_enabled = false;

		resize_start_x = event.clientX;
		resize_start_y = event.clientY;
		resize_start_width = rect.width;
		resize_start_height = rect.height;
		resize_start_left = rect.left;
		resize_start_top = rect.top;

		const { x, y } = getTranslateValue();
		resize_start_tx = x;
		resize_start_ty = y;

		window.addEventListener('pointermove', onResizeMove);
		window.addEventListener('pointerup', stopResize);
		window.addEventListener('pointercancel', stopResize);

		event.preventDefault();
		event.stopPropagation();
	}

	function onResizeMove(event: PointerEvent) {
		if (!windowEl || !is_resizing || !resize_direction) return;

		const delta_x = event.clientX - resize_start_x;
		const delta_y = event.clientY - resize_start_y;

		const from_left = resize_direction.includes('left');
		const from_right = resize_direction.includes('right');
		const from_top = resize_direction.includes('top');
		const from_bottom = resize_direction.includes('bottom');

		let next_tx = resize_start_tx;
		let next_ty = resize_start_ty;

		if (from_right) {
			const max_width = Math.max(MIN_WIDTH, window.innerWidth - resize_start_left);
			const next_width = clamp(resize_start_width + delta_x, MIN_WIDTH, max_width);
			windowEl.style.width = `${next_width}px`;
		}

		if (from_left) {
			const min_left = 0;
			const max_left = resize_start_left + resize_start_width - MIN_WIDTH;
			const next_left = clamp(resize_start_left + delta_x, min_left, max_left);
			const next_width = resize_start_width + (resize_start_left - next_left);
			next_tx = resize_start_tx + (next_left - resize_start_left);
			windowEl.style.width = `${next_width}px`;
		}

		if (from_bottom) {
			const max_height = Math.max(MIN_HEIGHT, window.innerHeight - resize_start_top);
			const next_height = clamp(resize_start_height + delta_y, MIN_HEIGHT, max_height);
			windowEl.style.height = `${next_height}px`;
		}

		if (from_top) {
			const min_top = 27.2;
			const max_top = resize_start_top + resize_start_height - MIN_HEIGHT;
			const next_top = clamp(resize_start_top + delta_y, min_top, max_top);
			const next_height = resize_start_height + (resize_start_top - next_top);
			next_ty = resize_start_ty + (next_top - resize_start_top);
			windowEl.style.height = `${next_height}px`;
		}

		if (from_left || from_top) {
			windowEl.style.transform = `translate(${next_tx}px, ${next_ty}px)`;
		}
	}

	function stopResize() {
		if (!is_resizing) return;

		is_resizing = false;
		resize_direction = undefined;
		dragging_enabled = !is_maximized;

		syncRememberedSize();

		window.removeEventListener('pointermove', onResizeMove);
		window.removeEventListener('pointerup', stopResize);
		window.removeEventListener('pointercancel', stopResize);
	}

	function startSidebarResize(event: PointerEvent) {
		if (!show_sidebar || is_sidebar_collapsed) return;

		is_sidebar_resizing = true;
		sidebar_resize_start_x = event.clientX;
		sidebar_resize_start_width = sidebar_width;

		window.addEventListener('pointermove', onSidebarResizeMove);
		window.addEventListener('pointerup', stopSidebarResize);
		window.addEventListener('pointercancel', stopSidebarResize);

		event.preventDefault();
		event.stopPropagation();
	}

	function onSidebarResizeMove(event: PointerEvent) {
		if (!is_sidebar_resizing) return;

		const delta = event.clientX - sidebar_resize_start_x;
		sidebar_width = clamp(sidebar_resize_start_width + delta, 160, 360);
	}

	function stopSidebarResize() {
		if (!is_sidebar_resizing) return;

		is_sidebar_resizing = false;

		window.removeEventListener('pointermove', onSidebarResizeMove);
		window.removeEventListener('pointerup', stopSidebarResize);
		window.removeEventListener('pointercancel', stopSidebarResize);
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
			syncRememberedSize();

			minimized_transform = windowEl.style.transform || '';
			windowEl.style.transform = `translate(0px, ${TOP_BAR_HEIGHT_REM}rem)`;

			windowEl.style.width = `100vw`;
			windowEl.style.height = `calc(100vh - ${TOP_BAR_HEIGHT_REM}rem - ${DOCK_HEIGHT_REM}rem)`;
			windowEl.style.borderRadius = '0.75rem';
		} else {
			dragging_enabled = true;
			windowEl.style.transform = minimized_transform;

			windowEl.style.width = remembered_width || `${+width / remModifier}rem`;
			windowEl.style.height = remembered_height || `${+height / remModifier}rem`;
			windowEl.style.borderRadius = '0.75rem';
		}

		is_maximized = !is_maximized;

		// Keep dock visible when a window is maximized (zoomed) rather than true fullscreen.
		apps.fullscreen[app_id] = false;

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

	onMount(() => {
		windowEl?.focus();

		return () => {
			stopResize();
			stopSidebarResize();
		};
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
	role="application"
	class="container"
	class:dark={preferences.theme.scheme === 'dark'}
	class:active={apps.active === app_id}
	class:resizing={is_resizing}
	style:width="{+width / remModifier}rem"
	style:height="{+height / remModifier}rem"
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
	<header class="titlebar app-window-drag-handle">
		<div class="traffic-lights" use:elevation={'window-traffic-lights'}>
			<TrafficLights
				{app_id}
				on_maximize_click={maximizeApp}
				on_minimize_click={minimizeApp}
				on_close_app={closeApp}
			/>
		</div>

		<p class="window-title">{title}</p>

		<div class="title-actions">
			{#if show_toolbar}
				<button
					type="button"
					class="toolbar-icon"
					onclick={() => (is_sidebar_collapsed = !is_sidebar_collapsed)}
					disabled={!show_sidebar}
				>
					Sidebar
				</button>
				<button type="button" class="toolbar-icon">View</button>
				<button type="button" class="toolbar-icon">Sort</button>
			{/if}
		</div>
	</header>

	{#if show_toolbar}
		<div class="toolbar">
			<div class="segmented" role="group" aria-label="Window view mode">
				<button type="button" class="active">Files</button>
				<button type="button">Recent</button>
			</div>

			<input class="toolbar-search" type="search" placeholder="Search" aria-label="Search" />
		</div>
	{/if}

	<section class="window-body" class:sidebar-visible={show_sidebar && !is_sidebar_collapsed}>
		{#if show_sidebar && !is_sidebar_collapsed}
			<aside class="sidebar" style:width={`${sidebar_width}px`}>
				<h3>Navigation</h3>
				<button type="button">Recents</button>
				<button type="button">Desktop</button>
				<button type="button">Documents</button>
				<button type="button">Downloads</button>
			</aside>

			<button
				type="button"
				class="sidebar-resizer"
				aria-label="Resize sidebar"
				onpointerdown={startSidebarResize}
			></button>
		{/if}

		<div class="content-shell">
			<AppNexus {app_id} is_being_dragged={apps.is_being_dragged} />
		</div>
	</section>

	{#if resizable && !is_maximized}
		<button
			type="button"
			class="resize-handle top"
			aria-label="Resize window from top"
			onpointerdown={(e) => startResize(e, 'top')}
		></button>
		<button
			type="button"
			class="resize-handle right"
			aria-label="Resize window from right"
			onpointerdown={(e) => startResize(e, 'right')}
		></button>
		<button
			type="button"
			class="resize-handle bottom"
			aria-label="Resize window from bottom"
			onpointerdown={(e) => startResize(e, 'bottom')}
		></button>
		<button
			type="button"
			class="resize-handle left"
			aria-label="Resize window from left"
			onpointerdown={(e) => startResize(e, 'left')}
		></button>
		<button
			type="button"
			class="resize-handle top-left"
			aria-label="Resize window from top left"
			onpointerdown={(e) => startResize(e, 'top-left')}
		></button>
		<button
			type="button"
			class="resize-handle top-right"
			aria-label="Resize window from top right"
			onpointerdown={(e) => startResize(e, 'top-right')}
		></button>
		<button
			type="button"
			class="resize-handle bottom-right"
			aria-label="Resize window from bottom right"
			onpointerdown={(e) => startResize(e, 'bottom-right')}
		></button>
		<button
			type="button"
			class="resize-handle bottom-left"
			aria-label="Resize window from bottom left"
			onpointerdown={(e) => startResize(e, 'bottom-left')}
		></button>
	{/if}
</section>

<style>
	.container {
		--elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.115), 0px 68px 80px rgba(0, 0, 0, 0.23);
		--window-border: hsla(var(--system-color-dark-hsl), 0.15);

		width: 100%;
		height: 100%;

		display: grid;
		grid-template-rows: auto auto minmax(0, 1fr);

		position: absolute;

		will-change: width, height;

		border-radius: 0.75rem;
		box-shadow: var(--elevated-shadow);
		border: 1px solid var(--window-border);
		background: hsla(var(--system-color-light-hsl), 0.78);
		backdrop-filter: blur(14px);

		cursor: var(--system-cursor-default), auto;
		overflow: hidden;

		transition:
			filter 120ms ease,
			box-shadow 160ms ease;

		&.resizing {
			user-select: none;
		}

		&:not(.active) {
			filter: saturate(0.82) contrast(0.95) brightness(0.96);
		}

		&.active {
			--elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.28), 0px 68px 80px rgba(0, 0, 0, 0.56);
		}

		&.dark {
			--window-border: hsla(var(--system-color-light-hsl), 0.2);
			background: hsla(var(--system-color-dark-hsl), 0.4);
		}
	}

	.titlebar {
		display: grid;
		grid-template-columns: 9.2rem 1fr 11rem;
		align-items: center;
		height: 2.4rem;
		padding: 0 0.7rem;
		border-bottom: 1px solid hsla(var(--system-color-dark-hsl), 0.09);
		user-select: none;
		background: linear-gradient(
			to bottom,
			hsla(var(--system-color-light-hsl), 0.35),
			hsla(var(--system-color-light-hsl), 0.2)
		);
	}

	.traffic-lights {
		display: flex;
		align-items: center;
		height: 100%;
	}

	.window-title {
		text-align: center;
		font-size: 0.88rem;
		font-weight: 550;
		letter-spacing: 0.2px;
		color: hsla(var(--system-color-dark-hsl), 0.85);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.title-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.35rem;
	}

	.toolbar-icon {
		height: 1.4rem;
		padding: 0 0.45rem;
		font-size: 0.68rem;
		border-radius: 0.35rem;
		background: hsla(var(--system-color-light-hsl), 0.5);
		color: hsla(var(--system-color-dark-hsl), 0.82);
		transition: background-color 120ms ease;

		&:hover:enabled {
			background: hsla(var(--system-color-dark-hsl), 0.1);
		}

		&:disabled {
			opacity: 0.45;
		}
	}

	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		height: 2rem;
		padding: 0 0.7rem;
		border-bottom: 1px solid hsla(var(--system-color-dark-hsl), 0.08);
		background-color: hsla(var(--system-color-light-hsl), 0.24);
	}

	.segmented {
		display: flex;
		align-items: center;
		border-radius: 0.45rem;
		overflow: hidden;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.16);

		button {
			height: 1.4rem;
			padding: 0 0.55rem;
			font-size: 0.68rem;
			font-weight: 500;
			background: transparent;
			color: hsla(var(--system-color-dark-hsl), 0.8);

			&.active {
				background: hsla(var(--system-color-dark-hsl), 0.14);
			}
		}
	}

	.toolbar-search {
		height: 1.45rem;
		padding: 0 0.55rem;
		width: 9rem;
		border-radius: 0.45rem;
		font-size: 0.72rem;
		background: hsla(var(--system-color-light-hsl), 0.6);
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.18);
		color: hsla(var(--system-color-dark-hsl), 0.85);

		&:focus-visible {
			outline: 2px solid hsla(var(--system-color-primary-hsl), 0.35);
			outline-offset: 1px;
		}
	}

	.window-body {
		display: flex;
		min-height: 0;
		height: 100%;
	}

	.sidebar {
		flex-shrink: 0;
		padding: 0.7rem 0.55rem;
		border-right: 1px solid hsla(var(--system-color-dark-hsl), 0.11);
		background: hsla(var(--system-color-light-hsl), 0.28);
		backdrop-filter: blur(10px);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;

		h3 {
			font-size: 0.72rem;
			font-weight: 600;
			margin-bottom: 0.25rem;
			color: hsla(var(--system-color-dark-hsl), 0.64);
		}

		button {
			height: 1.6rem;
			padding: 0 0.5rem;
			font-size: 0.78rem;
			text-align: left;
			border-radius: 0.38rem;
			color: hsla(var(--system-color-dark-hsl), 0.84);

			&:hover,
			&:focus-visible {
				background: hsla(var(--system-color-dark-hsl), 0.1);
			}
		}
	}

	.sidebar-resizer {
		width: 6px;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: e-resize;
		touch-action: none;
	}

	.content-shell {
		flex: 1;
		min-width: 0;
		min-height: 0;
		height: 100%;
		overflow: auto;
	}

	.content-shell :global(.app-window-drag-handle) {
		display: none !important;
	}

	.content-shell :global(section.container) {
		height: 100%;
	}

	.resize-handle {
		position: absolute;
		padding: 0;
		margin: 0;
		border: 0;
		background: transparent;
		z-index: 3;
		touch-action: none;
	}

	.resize-handle.top {
		top: 0;
		left: 7px;
		width: calc(100% - 14px);
		height: 7px;
		cursor: url('/cursors/vertical-resize.svg') 12 12, n-resize;
	}

	.resize-handle.right {
		top: 7px;
		right: 0;
		width: 7px;
		height: calc(100% - 14px);
		cursor: e-resize;
	}

	.resize-handle.bottom {
		left: 7px;
		bottom: 0;
		width: calc(100% - 14px);
		height: 7px;
		cursor: url('/cursors/vertical-resize.svg') 12 12, s-resize;
	}

	.resize-handle.left {
		top: 7px;
		left: 0;
		width: 7px;
		height: calc(100% - 14px);
		cursor: w-resize;
	}

	.resize-handle.top-left {
		top: 0;
		left: 0;
		width: 14px;
		height: 14px;
		cursor: url('/cursors/diagonal-resize-1.svg') 10 10, nw-resize;
	}

	.resize-handle.top-right {
		top: 0;
		right: 0;
		width: 14px;
		height: 14px;
		cursor: url('/cursors/diagonal-resize-2.svg') 10 10, ne-resize;
	}

	.resize-handle.bottom-right {
		right: 0;
		bottom: 0;
		width: 14px;
		height: 14px;
		cursor: url('/cursors/diagonal-resize-1.svg') 10 10, se-resize;
	}

	.resize-handle.bottom-left {
		left: 0;
		bottom: 0;
		width: 14px;
		height: 14px;
		cursor: url('/cursors/diagonal-resize-2.svg') 10 10, sw-resize;
	}
</style>
