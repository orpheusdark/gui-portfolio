<script lang="ts">
	const achievements = [
		'2nd Prize - Creato Hackathon',
		'Social Impact Idea Award - CREATO 2023',
		"Participant - RIFT '26",
	];
</script>

<section class="container">
	<header class="app-window-drag-handle"></header>

	<section class="terminal" aria-label="Achievements terminal">
		<p><span class="prompt">nirant@developer-os</span>:<span class="path">~/achievements</span>$ cat milestones.txt</p>
		{#each achievements as achievement}
			<p><span class="ok">[ok]</span> {achievement}</p>
		{/each}
		<p><span class="prompt">nirant@developer-os</span>:<span class="path">~/achievements</span>$ _</p>
	</section>
</section>

<style>
	header {
		padding: 1rem;
	}

	.container {
		height: 100%;
		width: 100%;

		background-color: hsla(240, 5%, 12%, 0.7);
		backdrop-filter: blur(15px);

		border-radius: inherit;

		display: grid;
		grid-template-rows: auto 1fr;

		font-family: var(--system-font-family) !important;
	}

	.terminal {
		margin: 0.4rem;
		border-radius: 0.65rem;
		padding: 0.85rem;
		background-color: hsla(0, 0%, 6%, 0.55);
		color: hsl(128deg 57% 80%);
		font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
		overflow: auto;

		p {
			font-size: 0.85rem;
			line-height: 1.6;
			white-space: nowrap;
		}
	}

	.prompt {
		color: hsl(211deg 100% 76%);
	}

	.path {
		color: hsl(42deg 98% 65%);
	}

	.ok {
		color: hsl(118deg 95% 70%);
	}

	:global(.tl-container.calculator) {
		top: 0.7rem;
		left: 0.7rem;
	}
</style>
