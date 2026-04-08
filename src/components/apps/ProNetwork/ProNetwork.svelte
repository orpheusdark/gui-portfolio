<script lang="ts">
	type Post = {
		title: string;
		date: string;
		category: string;
		summary: string;
		impact: string;
		link: string;
		pinned?: boolean;
	};

	type Education = {
		institution: string;
		program: string;
		period: string;
		highlights: string[];
	};

	type Achievement = {
		title: string;
		detail: string;
		time: string;
	};

	type Certification = {
		title: string;
		issuer: string;
		year: string;
		proof: string;
	};

	type Course = {
		title: string;
		provider: string;
		focus: string;
	};

	const profile = {
		name: 'Nirant Chavda',
		headline: 'Cybersecurity-focused Computer Engineering Student | Builder of practical, secure systems',
		summary:
			'I build portfolio-grade software and hackathon projects that combine cybersecurity thinking with product execution. My focus is turning complex real-world problems into systems that are secure, understandable, and useful.',
		location: 'Gujarat, India',
		openTo: 'Open to cybersecurity internships, product engineering internships, and collaborative builds.',
	};

	const posts: Post[] = [
		{
			title: 'RIFT-26: Detecting suspicious transaction rings with graph signals',
			date: '2026-02-17',
			category: 'Project Deep Dive',
			summary:
				'Shared the architecture used to detect money-muling patterns from linked devices, IP overlap, and circular transaction paths.',
			impact: 'Improved project clarity for judges and helped communicate model assumptions to non-technical reviewers.',
			link: 'https://github.com/orpheusdark/RIFT-26',
			pinned: true,
		},
		{
			title: 'Hardening client-side portfolio experiences without breaking UX',
			date: '2025-11-08',
			category: 'Engineering Notes',
			summary:
				'Documented practical steps for balancing front-end polish with safe external-link handling and predictable interaction behavior.',
			impact: 'Converted portfolio pages into reusable engineering patterns for future projects.',
			link: 'https://github.com/orpheusdark/gui-portfolio',
			pinned: true,
		},
		{
			title: 'Smart Helmet incident-response flow: from sensor event to emergency alert',
			date: '2025-08-02',
			category: 'Build Log',
			summary:
				'Published how IoT telemetry and threshold rules were translated into alerts with lower false-positive noise.',
			impact: 'Made technical design trade-offs and safety assumptions transparent to stakeholders.',
			link: 'https://github.com/orpheusdark/Smart-Helmet',
		},
		{
			title: 'From dashboard idea to shipped prototype in 48 hours',
			date: '2025-05-21',
			category: 'Hackathon Reflection',
			summary:
				'Shared a repeatable sprint model for ideation, implementation, and final presentation under a hard deadline.',
			impact: 'Improved team alignment and reduced scope drift across rapid hackathon cycles.',
			link: 'https://dev.to/orpheusdark',
		},
	];

	const education: Education[] = [
		{
			institution: 'Silver Oak University',
			program: 'B.E. in Computer Engineering',
			period: '2022 - Present',
			highlights: [
				'Built applied projects across cybersecurity, automation, and data-driven interfaces.',
				'Regularly participated in hackathons with cross-functional teams under time constraints.',
				'Focused on secure software practices, system design basics, and practical deployment.',
			],
		},
	];

	const achievements: Achievement[] = [
		{
			title: 'Built and published an OS-style interactive portfolio',
			detail: 'Shipped a production-ready, PWA-capable personal portfolio with windowed app UX and modular architecture.',
			time: '2026',
		},
		{
			title: 'Consistent multi-project delivery in hackathon settings',
			detail: 'Contributed to ideation, engineering, and demo quality across projects including RIFT-26, Smart Helmet, and Greenigma.',
			time: '2024 - 2026',
		},
		{
			title: 'Public technical footprint across coding platforms',
			detail: 'Maintained active coding and learning presence through GitHub, LeetCode, Unstop, and technical writing platforms.',
			time: 'Ongoing',
		},
	];

	const certifications: Certification[] = [
		{ title: 'CNSP', issuer: 'The SecOps Group', year: '2025', proof: '/certificates/cnsp-2025.svg' },
		{ title: 'CAP', issuer: 'The SecOps Group', year: '2024', proof: '/certificates/cap-2024.svg' },
		{
			title: 'Google Cybersecurity Professional Certificate',
			issuer: 'Google',
			year: '2024',
			proof: '/certificates/google-cybersecurity-2024.svg',
		},
		{
			title: 'Advent of Cyber',
			issuer: 'TryHackMe',
			year: '2024',
			proof: '/certificates/advent-of-cyber-2024.svg',
		},
	];

	const courses: Course[] = [
		{ title: 'Security and Ethical Hacking Modules', provider: 'EC-Council', focus: 'Threat modeling and secure operations' },
		{ title: 'C# Development Path', provider: 'Microsoft', focus: 'Language foundations and app development workflow' },
		{ title: 'Digital Marketing', provider: 'Google', focus: 'User reach, positioning, and communication strategy' },
		{ title: 'Practical Web Development', provider: 'Project-led learning', focus: 'Building responsive and maintainable front-end systems' },
	];

	const postCategories = ['All', ...new Set(posts.map((post) => post.category))];
	let postSearch = $state('');
	let postCategory = $state('All');

	const normalize = (value: string) => value.trim().toLowerCase();

	const filteredPosts = $derived(
		posts.filter((post) => {
			const byCategory = postCategory === 'All' || post.category === postCategory;
			const q = normalize(postSearch);
			const bySearch =
				q.length === 0 ||
				normalize(post.title).includes(q) ||
				normalize(post.summary).includes(q) ||
				normalize(post.impact).includes(q);

			return byCategory && bySearch;
		}),
	);

	const pinnedPosts = $derived(filteredPosts.filter((post) => post.pinned));
	const recentPosts = $derived(filteredPosts.filter((post) => !post.pinned));

	function openExternal(link: string) {
		window.open(link, '_blank', 'noopener,noreferrer');
	}

	const formatDate = (date: string) =>
		new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
			new Date(date),
		);
</script>

<section class="pro-network-container">
	<header class="titlebar app-window-drag-handle">
		<span>Pro Network</span>
	</header>

	<section class="surface">
		<section class="profile-card panel">
			<div class="identity-row">
				<div class="avatar" aria-hidden="true">NC</div>
				<div>
					<h1>{profile.name}</h1>
					<p class="headline">{profile.headline}</p>
				</div>
			</div>
			<p>{profile.summary}</p>
			<div class="meta-row">
				<span>{profile.location}</span>
				<span>{profile.openTo}</span>
			</div>
		</section>

		<section class="panel post-controls">
			<div class="controls-grid">
				<input
					type="search"
					class="search-input"
					placeholder="Search post title, summary, impact"
					bind:value={postSearch}
				/>
				<div class="chip-list" role="group" aria-label="Post category filters">
					{#each postCategories as category}
						<button
							type="button"
							class="chip-button"
							class:active={postCategory === category}
							onclick={() => (postCategory = category)}
						>
							{category}
						</button>
					{/each}
				</div>
			</div>
		</section>

		<section class="posts-grid">
			<section class="panel">
				<div class="section-head">
					<h2>Pinned Posts</h2>
				</div>
				<div class="post-list">
					{#if pinnedPosts.length === 0}
						<p class="empty-state">No pinned posts match your filter.</p>
					{:else}
						{#each pinnedPosts as post}
							<article class="post pinned">
								<p class="meta">{formatDate(post.date)} • {post.category}</p>
								<h3>{post.title}</h3>
								<p>{post.summary}</p>
								<p class="impact"><strong>Impact:</strong> {post.impact}</p>
								<button onclick={() => openExternal(post.link)}>Open post evidence</button>
							</article>
						{/each}
					{/if}
				</div>
			</section>

			<section class="panel">
				<div class="section-head">
					<h2>Recent Activity</h2>
				</div>
				<div class="post-list">
					{#if recentPosts.length === 0}
						<p class="empty-state">No recent posts match your filter.</p>
					{:else}
						{#each recentPosts as post}
							<article class="post">
								<p class="meta">{formatDate(post.date)} • {post.category}</p>
								<h3>{post.title}</h3>
								<p>{post.summary}</p>
								<p class="impact"><strong>Outcome:</strong> {post.impact}</p>
								<button onclick={() => openExternal(post.link)}>View source</button>
							</article>
						{/each}
					{/if}
				</div>
			</section>
		</section>

		<section class="detail-grid">
			<section class="panel">
				<h2>Education</h2>
				{#each education as item}
					<article class="info-card">
						<h3>{item.institution}</h3>
						<p class="program">{item.program}</p>
						<p class="meta">{item.period}</p>
						<ul>
							{#each item.highlights as point}
								<li>{point}</li>
							{/each}
						</ul>
					</article>
				{/each}
			</section>

			<section class="panel">
				<h2>Achievements</h2>
				<ul class="stack-list">
					{#each achievements as item}
						<li>
							<h3>{item.title}</h3>
							<p>{item.detail}</p>
							<span>{item.time}</span>
						</li>
					{/each}
				</ul>
			</section>

			<section class="panel">
				<h2>Certifications</h2>
				<ul class="stack-list">
					{#each certifications as item}
						<li>
							<h3>{item.title}</h3>
							<p>{item.issuer}</p>
							<div class="row-between">
								<span>{item.year}</span>
								<button onclick={() => openExternal(item.proof)}>Validation</button>
							</div>
						</li>
					{/each}
				</ul>
			</section>

			<section class="panel">
				<h2>Courses</h2>
				<ul class="stack-list compact">
					{#each courses as item}
						<li>
							<h3>{item.title}</h3>
							<p>{item.provider}</p>
							<span>{item.focus}</span>
						</li>
					{/each}
				</ul>
			</section>
		</section>
	</section>
</section>

<style>
	.pro-network-container {
		display: grid;
		grid-template-rows: auto 1fr;
		height: 100%;
		min-height: 0;

		background: linear-gradient(
			150deg,
			hsla(var(--system-color-light-hsl), 0.98),
			hsla(var(--system-color-light-hsl), 0.9) 35%,
			hsla(var(--system-color-primary-hsl), 0.08)
		);

		border-radius: inherit;
		color: var(--system-color-light-contrast);
	}

	.titlebar {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.85rem;
		font-size: 0.86rem;
		font-weight: 500;
		letter-spacing: 0.4px;
	}

	.surface {
		overflow: auto;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		padding: 0.9rem;
		min-height: 0;
	}

	.panel {
		background: hsla(var(--system-color-light-hsl), 0.6);
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.12);
		border-radius: 0.8rem;
		padding: 0.85rem;
		box-shadow: 0 1px 0 hsla(var(--system-color-light-hsl), 0.45) inset;
	}

	.profile-card {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.identity-row {
		display: flex;
		gap: 0.7rem;
		align-items: center;
	}

	.avatar {
		width: 3.7rem;
		height: 3.7rem;
		border-radius: 0.9rem;
		display: grid;
		place-items: center;
		font-weight: 800;
		font-size: 1.25rem;
		color: white;
		background: linear-gradient(145deg, hsl(213deg 88% 43%), hsl(184deg 72% 39%));
	}

	h1 {
		font-size: 1.35rem;
	}

	.headline {
		font-size: 0.92rem;
		line-height: 1.4;
		color: hsla(var(--system-color-dark-hsl), 0.7);
	}

	.meta-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
		gap: 0.45rem;

		span {
			font-size: 0.84rem;
			color: hsla(var(--system-color-dark-hsl), 0.76);
		}
	}

	.posts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
		gap: 0.8rem;
	}

	.post-controls {
		padding: 0.75rem;
	}

	.controls-grid {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.search-input {
		width: 100%;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.2);
		border-radius: 0.5rem;
		padding: 0.42rem 0.58rem;
		background: hsla(var(--system-color-light-hsl), 0.9);
		color: var(--system-color-light-contrast);
	}

	.chip-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.chip-button {
		padding: 0.24rem 0.5rem;
		font-size: 0.74rem;
		border-radius: 999px;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.22);
		background: hsla(var(--system-color-light-hsl), 0.93);
		color: var(--system-color-light-contrast);
	}

	.chip-button.active {
		background: hsl(211deg 78% 45%);
		border-color: hsl(211deg 78% 45%);
		color: white;
	}

	.section-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.55rem;
	}

	h2 {
		font-size: 1rem;
		line-height: 1.2;
	}

	.post-list {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.post {
		border-radius: 0.6rem;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.12);
		background: hsla(var(--system-color-light-hsl), 0.66);
		padding: 0.7rem;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.post.pinned {
		border-color: hsla(var(--system-color-primary-hsl), 0.45);
		box-shadow: 0 0 0 1px hsla(var(--system-color-primary-hsl), 0.16) inset;
	}

	.post .meta {
		font-size: 0.78rem;
		color: hsla(var(--system-color-dark-hsl), 0.62);
	}

	.post h3 {
		font-size: 0.95rem;
	}

	.post p {
		line-height: 1.45;
		font-size: 0.9rem;
	}

	.empty-state {
		font-size: 0.86rem;
		color: hsla(var(--system-color-dark-hsl), 0.72);
	}

	.impact {
		font-size: 0.86rem;
	}

	button {
		align-self: flex-start;
		background: hsl(211deg 78% 45%);
		color: white;
		border-radius: 0.45rem;
		padding: 0.35rem 0.58rem;
		font-size: 0.78rem;
		font-weight: 600;
		cursor: var(--system-cursor-pointer), pointer;
	}

	.detail-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 0.8rem;
	}

	.info-card {
		display: flex;
		flex-direction: column;
		gap: 0.32rem;

		.program {
			font-weight: 600;
		}

		.meta {
			font-size: 0.84rem;
			color: hsla(var(--system-color-dark-hsl), 0.7);
		}

		ul {
			padding-left: 1.1rem;
			display: flex;
			flex-direction: column;
			gap: 0.2rem;
		}

		li {
			line-height: 1.4;
			font-size: 0.88rem;
		}
	}

	.stack-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.48rem;

		li {
			padding: 0.6rem;
			border-radius: 0.58rem;
			background-color: hsla(var(--system-color-dark-hsl), 0.04);
			display: flex;
			flex-direction: column;
			gap: 0.26rem;
		}

		h3 {
			font-size: 0.9rem;
		}

		p {
			font-size: 0.86rem;
			line-height: 1.4;
		}

		span {
			font-size: 0.79rem;
			color: hsla(var(--system-color-dark-hsl), 0.7);
		}
	}

	.stack-list.compact li {
		gap: 0.16rem;
	}

	.row-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.6rem;
	}

	@media (max-width: 840px) {
		.surface {
			padding: 0.7rem;
		}

		.posts-grid,
		.detail-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
