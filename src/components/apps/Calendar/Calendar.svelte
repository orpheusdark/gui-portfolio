<script lang="ts">
	import { preferences } from '🍎/state/preferences.svelte.ts';

	const milestones = [
		{
			range: '2022-2025',
			title: 'Diploma - Parul Polytechnic Institute',
			detail: 'CGPA 9.04',
		},
		{
			range: '2025-2028',
			title: 'BTech - Parul Institute of Engineering and Technology',
			detail: 'Computer Engineering',
		},
	];
</script>

<section class="container" class:dark={preferences.theme.scheme === 'dark'}>
	<header class="app-window-drag-handle titlebar"></header>

	<section class="main-area">
		<div class="calendar-header">
			<h1>Academic Timeline</h1>
			<span>Nirant Chavda</span>
		</div>

		<div class="timeline">
			{#each milestones as milestone, index}
				<article>
					<div class="dot" aria-hidden="true"></div>
					<div class="card">
						<p class="range">{milestone.range}</p>
						<h2>{milestone.title}</h2>
						<p>{milestone.detail}</p>
					</div>
				</article>
				{#if index < milestones.length - 1}
					<div class="line" aria-hidden="true"></div>
				{/if}
			{/each}
		</div>
	</section>
</section>

<style>
	.container {
		--title-bar-height: 2.5rem;

		background-color: var(--system-color-light);

		border-radius: inherit;

		overflow: hidden;

		&.dark {
			box-shadow:
				inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.2),
				0 0 0 1.5px hsla(var(--system-color-light-hsl), 0.5);
		}
	}

	.titlebar {
		padding: 1rem 1rem;

		width: 100%;
		height: var(--title-bar-height);

		position: absolute;
		top: 0;
		left: 0;
	}

	.main-area {
		color: var(--system-color-light-contrast);

		margin-top: var(--title-bar-height);

		height: calc(100% - var(--title-bar-height));
		width: 100%;

		overflow: hidden;

		display: flex;
		flex-direction: column;
	}

	.calendar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		padding: 1rem 1rem 0.5rem;
	}

	h1 {
		font-size: 1.4rem;
		font-weight: 700;
	}

	.calendar-header span {
		font-size: 0.9rem;
		color: hsla(var(--system-color-dark-hsl), 0.75);
	}

	.timeline {
		padding: 0.8rem 1rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		overflow: auto;
	}

	article {
		display: flex;
		gap: 0.65rem;
		align-items: flex-start;
	}

	.dot {
		margin-top: 0.2rem;
		height: 0.75rem;
		width: 0.75rem;
		border-radius: 50%;
		background-color: hsl(212deg 85% 53%);
		box-shadow: 0 0 0 3px hsla(212, 85%, 53%, 0.2);
	}

	.line {
		height: 1.2rem;
		width: 2px;
		margin-left: 0.34rem;
		background-color: hsla(var(--system-color-dark-hsl), 0.2);
	}

	.card {
		flex: 1;
		border-radius: 0.65rem;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.15);
		background-color: hsla(var(--system-color-dark-hsl), 0.04);
		padding: 0.7rem;

		h2 {
			font-size: 0.98rem;
			margin-bottom: 0.25rem;
		}

		p {
			line-height: 1.4;
		}
	}

	.range {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.5px;
		text-transform: uppercase;
		color: hsl(212deg 73% 42%);
	}
</style>
