<script lang="ts">
	import { preferences } from '🍎/state/preferences.svelte.ts';

	const skills = [
		'Cybersecurity',
		'Network Security',
		'Application Security',
		'Ethical Hacking',
		'C#',
		'Web Development',
		'Problem Solving',
	];

	const languages = [
		{ name: 'English', level: 'Professional' },
		{ name: 'Gujarati', level: 'Native' },
		{ name: 'Hindi', level: 'Native' },
	];

	function external(node: HTMLAnchorElement) {
		node.rel = 'noopener noreferrer';
		node.target = '_blank';
	}
</script>

<section class="container">
	<header class="titlebar app-window-drag-handle">
		<span>About the Developer</span>
	</header>

	<aside class:light={preferences.theme.scheme === 'light'}>
		<nav>
			<a href="#profile">Profile</a>
			<a href="#skills">Skills</a>
			<a href="#languages">Languages</a>

			<hr />

			<a href="https://www.linkedin.com/in/orpheusdark/" use:external>LinkedIn</a>
			<a href="https://github.com/orpheusdark" use:external>GitHub</a>
			<a href="https://dev.to/orpheusdark" use:external>dev.to</a>
		</nav>
	</aside>

	<section class="content">
		<section id="profile" class="panel">
			<div class="avatar" aria-hidden="true">NC</div>
			<h1>Nirant Chavda</h1>
			<h2>Computer Engineering Student</h2>
			<p>
				Building secure systems and exploring real-world challenges. Cybersecurity enthusiast focused
				on practical problem solving and resilient software design.
			</p>
		</section>

		<section id="skills" class="panel">
			<h3>Core Skills</h3>
			<ul class="chips">
				{#each skills as skill}
					<li>{skill}</li>
				{/each}
			</ul>
		</section>

		<section id="languages" class="panel">
			<h3>Languages</h3>
			<ul class="language-list">
				{#each languages as language}
					<li>
						<span>{language.name}</span>
						<strong>{language.level}</strong>
					</li>
				{/each}
			</ul>
		</section>
	</section>
</section>

<style>
	.container {
		--color: var(--system-color-light-hsl);

		display: grid;
		grid-template-columns: 12rem 1fr;
		grid-template-rows: 3rem 1fr;

		border-radius: inherit;

		background-image: linear-gradient(
			to right,
			hsla(var(--color), 0.7) 12rem,
			hsla(var(--color), 1) 12rem 100%
		);

		transition: --color 200ms ease-in;

		color: var(--system-color-dark);
	}

	.titlebar {
		grid-area: 1 / 1 / span 1 / span 2;

		display: flex;
		justify-content: center;

		z-index: 1;

		padding: 0.9rem 1rem;

		width: 100%;

		border-top-left-radius: inherit;
		border-top-right-radius: inherit;

		user-select: none;

		span {
			color: hsla(var(--system-color-dark-hsl), 0.8);
			font-weight: 500;
			font-size: 0.9rem;
			letter-spacing: 0.5px;
		}
	}

	aside {
		grid-area: 1 / 1 / span 2 / span 1;

		transform: translateZ(0);

		height: calc(100% - 2.7px);
		width: calc(12rem - 2.27px);

		margin: 1.8px 0 0px 1.8px;

		border-top-left-radius: 0.5rem;
		border-bottom-left-radius: inherit;

		&::before {
			content: '';

			width: inherit;
			height: inherit;

			border-radius: inherit;

			position: fixed;
			left: 0;
			top: 0;

			z-index: -1;
			backdrop-filter: blur(12px);
		}

		&.light {
			height: calc(100% - 3px);
			width: calc(12rem - 2.5px);

			margin: 1.7px 0 0px 1.7px;

			border-top-left-radius: 0.5rem;
			border-bottom-left-radius: 0.5rem;
		}

		nav {
			display: flex;
			flex-direction: column;
			gap: 0.2rem;

			margin: 4rem 0.6rem;

			hr {
				display: block;

				width: 100%;
				height: 1px;

				background-color: hsla(var(--system-color-dark-hsl), 0.2);

				border: none;
			}

			a {
				display: flex;
				gap: 0.4rem;
				align-items: center;

				color: hsla(var(--system-color-dark-hsl), 0.9);
				text-decoration: none;
				font-weight: 400;

				padding: 0.5rem 0.5rem;

				border-radius: 0.4rem;

				transition: background-color 100ms ease;

				&:hover {
					background-color: hsla(var(--system-color-dark-hsl), 0.2);
				}
			}
		}
	}

	.content {
		grid-area: 2 / 2 / span 1 / span 1;

		display: flex;
		flex-direction: column;
		gap: 0.8rem;

		padding: 1rem;
		overflow: auto;
	}

	.panel {
		background: hsla(var(--system-color-light-hsl), 0.45);
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.15);
		border-radius: 0.75rem;
		padding: 1rem;
	}

	.avatar {
		height: 4.5rem;
		width: 4.5rem;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-size: 1.3rem;
		font-weight: 700;
		color: white;
		background: linear-gradient(135deg, hsl(203, 80%, 45%), hsl(262, 76%, 42%));
		margin-bottom: 0.6rem;
	}

	h1 {
		font-size: 2rem;
		line-height: 1.2;
	}

	h2 {
		font-size: 1.1rem;
		line-height: 1.2;
		margin-top: 0.2rem;
	}

	h3 {
		font-size: 1rem;
		margin-bottom: 0.7rem;
	}

	p {
		line-height: 1.5;
		margin-top: 0.6rem;
	}

	.chips {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0;
		margin: 0;

		li {
			padding: 0.35rem 0.65rem;
			border-radius: 999px;
			background-color: hsla(var(--system-color-dark-hsl), 0.1);
			font-size: 0.9rem;
		}
	}

	.language-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;

		li {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0.4rem 0.5rem;
			border-radius: 0.45rem;
			background-color: hsla(var(--system-color-dark-hsl), 0.08);
		}

		strong {
			font-size: 0.85rem;
			color: hsla(var(--system-color-dark-hsl), 0.8);
		}
	}
</style>
