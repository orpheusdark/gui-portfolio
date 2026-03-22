<script lang="ts">
	import type { AppID } from '🍎/state/apps.svelte.ts';

	const { app_id }: { app_id: AppID } = $props();

	type LinkItem = {
		label: string;
		url: string;
	};

	type Certification = {
		title: string;
		source: string;
		year?: string;
	};

	const contact_links: LinkItem[] = [
		{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/orpheusdark/' },
		{ label: 'GitHub', url: 'https://github.com/orpheusdark' },
		{ label: 'LeetCode', url: 'https://leetcode.com/u/nirantchavda/' },
		{ label: 'Unstop', url: 'https://unstop.com/u/nirancha9563' },
		{ label: 'CodeChef', url: 'https://www.codechef.com/users/orpheusdark' },
		{ label: 'CodeForces', url: 'https://codeforces.com/profile/orpheusdark' },
		{ label: 'dev.io', url: 'https://dev.to/orpheusdark' },
	];

	const certifications: Certification[] = [
		{ title: 'CNSP', source: 'The SecOps Group', year: '2025' },
		{ title: 'CAP', source: 'The SecOps Group', year: '2024' },
		{ title: 'Google Cybersecurity', source: 'Google', year: '2024' },
		{ title: 'Advent of Cyber', source: 'TryHackMe' },
		{ title: 'Security and Ethical Hacking Modules', source: 'EC-Council' },
		{ title: 'C# Development Path', source: 'Microsoft' },
		{ title: 'Digital Marketing', source: 'Google' },
	];
</script>

<section class="container">
	<header class="titlebar app-window-drag-handle"></header>

	{#if app_id === 'finder'}
		<section class="main-area finder">
			<h1>Contact System</h1>
			<p>Open any endpoint to connect with Nirant Chavda.</p>
			<ul>
				{#each contact_links as link}
					<li>
						<a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
					</li>
				{/each}
			</ul>
		</section>
	{:else if app_id === 'appstore'}
		<section class="main-area appstore">
			<h1>Certifications and Courses</h1>
			<div class="grid">
				{#each certifications as certification}
					<article>
						<h2>{certification.title}</h2>
						<p>{certification.source}</p>
						{#if certification.year}
							<span>{certification.year}</span>
						{/if}
					</article>
				{/each}
			</div>
			<p class="summary">
				Additional courses summary: continuous learning in secure coding, system design,
				problem-solving workflows, and modern software development practices.
			</p>
		</section>
	{:else}
		<section class="main-area placeholder">
			<img src="/app-icons/{app_id}/256.webp" alt="Placeholder App" />
			<h1>Nothing here yet</h1>
		</section>
	{/if}
</section>

<style>
	.container {
		background-color: var(--system-color-light);

		border-radius: inherit;
	}

	.titlebar {
		padding: 1rem 1rem;

		width: 100%;

		position: absolute;
		top: 0;
		left: 0;
	}

	.main-area {
		font-size: 1rem;
		color: var(--system-color-light-contrast);

		height: 100%;
		width: 100%;

		display: flex;
		flex-direction: column;
		padding: 1.2rem;
		overflow: auto;
	}

	h1 {
		font-size: 1.4rem;
		margin-bottom: 0.25rem;
	}

	p {
		line-height: 1.45;
	}

	.finder ul {
		list-style: none;
		padding: 0;
		margin-top: 1rem;
		display: grid;
		gap: 0.5rem;

		li {
			border: 1px solid hsla(var(--system-color-dark-hsl), 0.12);
			background-color: hsla(var(--system-color-dark-hsl), 0.04);
			border-radius: 0.5rem;
		}

		a {
			display: block;
			padding: 0.6rem 0.7rem;
			text-decoration: none;
			color: hsl(211deg 84% 37%);
			font-weight: 500;
		}
	}

	.appstore .grid {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: 0.7rem;

		article {
			border: 1px solid hsla(var(--system-color-dark-hsl), 0.14);
			border-radius: 0.55rem;
			padding: 0.75rem;
			background-color: hsla(var(--system-color-dark-hsl), 0.03);
			display: flex;
			flex-direction: column;
			gap: 0.3rem;
		}

		h2 {
			font-size: 0.95rem;
		}

		span {
			margin-top: auto;
			font-size: 0.8rem;
			font-weight: 600;
			color: hsla(var(--system-color-dark-hsl), 0.65);
		}
	}

	.summary {
		margin-top: 0.9rem;
		font-size: 0.9rem;
		padding: 0.7rem;
		border-radius: 0.5rem;
		background-color: hsla(var(--system-color-dark-hsl), 0.06);
	}

	.placeholder {
		justify-content: center;
		align-items: center;
		gap: 0.7rem;
	}

	.placeholder img {
		max-width: 8rem;
		aspect-ratio: 1 / 1;
	}
</style>
