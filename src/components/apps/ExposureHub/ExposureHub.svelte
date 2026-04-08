<script lang="ts">
	type ExposureEvent = {
		id: string;
		date: string;
		event_name: string;
		short_tag: string;
		description: string;
		work_done: string[];
		outcome: string;
		team: string;
		team_details: string;
		github_repo: string;
		live_project?: string;
		certificate_link: string;
		visual_proof: {
			image: string;
			alt: string;
			caption: string;
		};
	};

	const events: ExposureEvent[] = [
		{
			id: 'greenigma-2024',
			date: '2024-03-15',
			event_name: 'Greenigma Sustainability Sprint',
			short_tag: 'Hackathon',
			description:
				'A sustainability-focused build challenge where teams designed digital tools that help people track personal and community environmental impact.',
			work_done: [
				'Designed the project structure and implementation priorities for a 48-hour sprint.',
				'Built front-end components for impact tracking and daily habit visualization.',
				'Aligned security and data-integrity assumptions for user-submitted entries.',
			],
			outcome:
				'Shipped a working prototype and demonstrated measurable progress tracking logic to judges.',
			team: '3 members',
			team_details: 'Team included one UI developer, one systems contributor, and one research contributor.',
			github_repo: 'https://github.com/orpheusdark/Greenigma',
			live_project: 'https://dev.to/orpheusdark',
			certificate_link: '/certificates/greenigma-hackathon.svg',
			visual_proof: {
				image: '/exposure/screenshots/greenigma.png',
				alt: 'Greenigma repository visual preview',
				caption: 'Repository snapshot used as project evidence and demo backing.',
			},
		},
		{
			id: 'smart-helmet-2025',
			date: '2025-01-27',
			event_name: 'Smart Mobility Safety Challenge',
			short_tag: 'Prototype Event',
			description:
				'An engineering event focused on reducing emergency response delay through connected safety devices.',
			work_done: [
				'Worked on incident flow logic from sensor trigger to emergency notification path.',
				'Contributed to integration points between hardware event assumptions and software action rules.',
				'Helped prepare technical walkthrough for final presentation and Q&A.',
			],
			outcome: 'Delivered a clear proof-of-concept that emphasized actionable alerting and reliability trade-offs.',
			team: '4 members',
			team_details: 'Mixed team of embedded, software, and presentation contributors.',
			github_repo: 'https://github.com/orpheusdark/Smart-Helmet',
			live_project: 'https://dev.to/orpheusdark',
			certificate_link: '/certificates/smart-helmet-exposure.svg',
			visual_proof: {
				image: '/exposure/screenshots/smart-helmet.png',
				alt: 'Smart Helmet repository preview image',
				caption: 'GitHub preview confirms architecture and implementation scope.',
			},
		},
		{
			id: 'rift-26-2026',
			date: '2026-02-17',
			event_name: 'RIFT-26 Fraud Intelligence Hackathon',
			short_tag: 'Cybersecurity Hackathon',
			description:
				'Problem statement centered on identifying potential money-muling behavior using transaction networks and linked identity signals.',
			work_done: [
				'Defined graph-based risk indicators for circular flows and shared digital footprints.',
				'Implemented data processing and scoring concepts for suspicious cluster detection.',
				'Prepared explainable output format so judges could inspect why an entity was flagged.',
			],
			outcome:
				'Built a demonstrable anti-fraud concept with clear engineering narrative, security relevance, and reproducible repository artifacts.',
			team: '5 members',
			team_details: 'Cross-functional team spanning data modeling, backend logic, and presentation strategy.',
			github_repo: 'https://github.com/orpheusdark/RIFT-26',
			live_project: 'https://dev.to/orpheusdark',
			certificate_link: '/certificates/rift-26-hackathon.svg',
			visual_proof: {
				image: '/exposure/screenshots/rift-26.png',
				alt: 'RIFT-26 repository preview for proof',
				caption: 'Repository evidence and challenge-focused implementation details.',
			},
		},
	];

	const timelineEvents = [...events].sort((a, b) =>
		new Date(a.date).getTime() - new Date(b.date).getTime(),
	);
	const timelineTags = ['All', ...new Set(timelineEvents.map((event) => event.short_tag))];

	let timelineSearch = $state('');
	let timelineTag = $state('All');

	const normalize = (value: string) => value.trim().toLowerCase();

	const filteredTimelineEvents = $derived(
		timelineEvents.filter((event) => {
			const matchesTag = timelineTag === 'All' || event.short_tag === timelineTag;
			const q = normalize(timelineSearch);
			const matchesSearch =
				q.length === 0 ||
				normalize(event.event_name).includes(q) ||
				normalize(event.description).includes(q) ||
				normalize(event.team_details).includes(q);

			return matchesTag && matchesSearch;
		}),
	);

	let selectedEventId = $state(timelineEvents[timelineEvents.length - 1]?.id ?? '');

	$effect(() => {
		if (filteredTimelineEvents.length === 0) return;
		if (!filteredTimelineEvents.some((event) => event.id === selectedEventId)) {
			selectedEventId = filteredTimelineEvents[filteredTimelineEvents.length - 1].id;
		}
	});

	const activeEvent = $derived(filteredTimelineEvents.find((event) => event.id === selectedEventId));

	const formatDate = (date: string) =>
		new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(date));

	function openExternal(link: string) {
		window.open(link, '_blank', 'noopener,noreferrer');
	}
</script>

<section class="exposure-hub-container">
	<header class="titlebar app-window-drag-handle">
		<span>Exposure Hub Timeline</span>
	</header>

	<section class="timeline-layout">
		<aside class="timeline-scroll panel" aria-label="Hackathon timeline">
			<div class="timeline-controls">
				<input
					type="search"
					class="search-input"
					placeholder="Search events, work, teams"
					bind:value={timelineSearch}
				/>
				<div class="tag-list" role="group" aria-label="Event category filters">
					{#each timelineTags as tag}
						<button
							type="button"
							class="tag-button"
							class:active={timelineTag === tag}
							onclick={() => (timelineTag = tag)}
						>
							{tag}
						</button>
					{/each}
				</div>
			</div>
			<div class="timeline-rail" aria-hidden="true"></div>
			{#if filteredTimelineEvents.length === 0}
				<p class="empty-state">No events match your current search/filter.</p>
			{:else}
				{#each filteredTimelineEvents as event}
					<button
						type="button"
						class="timeline-node"
						class:active={selectedEventId === event.id}
						onclick={() => (selectedEventId = event.id)}
					>
						<span class="dot" aria-hidden="true"></span>
						<span class="node-content">
							<span class="date">{formatDate(event.date)}</span>
							<strong>{event.event_name}</strong>
							<small>{event.short_tag}</small>
						</span>
					</button>
				{/each}
			{/if}
		</aside>

		{#if activeEvent}
			<section class="event-detail panel">
				<section class="hero">
					<div>
						<p class="eyebrow">{activeEvent.short_tag} • {formatDate(activeEvent.date)}</p>
						<h1>{activeEvent.event_name}</h1>
						<p>{activeEvent.description}</p>
					</div>
					<figure>
						<img src={activeEvent.visual_proof.image} alt={activeEvent.visual_proof.alt} loading="lazy" />
						<figcaption>{activeEvent.visual_proof.caption}</figcaption>
					</figure>
				</section>

				<section class="facts-grid">
					<article>
						<h2>Work Done</h2>
						<ul>
							{#each activeEvent.work_done as task}
								<li>{task}</li>
							{/each}
						</ul>
					</article>
					<article>
						<h2>Team</h2>
						<p><strong>{activeEvent.team}</strong></p>
						<p>{activeEvent.team_details}</p>
						<h2>Outcome</h2>
						<p>{activeEvent.outcome}</p>
					</article>
				</section>

				<section class="actions">
					<button onclick={() => openExternal(activeEvent.github_repo)}>GitHub Repository</button>
					{#if activeEvent.live_project}
						<button class="secondary" onclick={() => openExternal(activeEvent.live_project)}>
							Live Project
						</button>
					{/if}
					<button class="ghost" onclick={() => openExternal(activeEvent.certificate_link)}>
						Certificate or Validation
					</button>
				</section>
			</section>
		{:else}
			<section class="event-detail panel">
				<p class="empty-state">Select or search a timeline event to view details.</p>
			</section>
		{/if}
	</section>
</section>

<style>
	.exposure-hub-container {
		display: grid;
		grid-template-rows: 2.8rem 1fr;
		height: 100%;
		min-height: 0;
		background: linear-gradient(
			125deg,
			hsl(208deg 38% 95%),
			hsl(200deg 52% 92%) 44%,
			hsl(182deg 36% 90%)
		);
		border-radius: inherit;
		color: hsl(217deg 28% 17%);
	}

	.titlebar {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.85rem;
		font-size: 0.86rem;
		font-weight: 500;
		letter-spacing: 0.45px;
	}

	.timeline-layout {
		display: grid;
		grid-template-columns: 18rem 1fr;
		gap: 0.8rem;
		padding: 0.8rem;
		height: 100%;
		min-height: 0;
	}

	.panel {
		border-radius: 0.8rem;
		border: 1px solid hsla(214, 24%, 18%, 0.14);
		background: hsla(0, 0%, 100%, 0.58);
		backdrop-filter: blur(8px);
	}

	.timeline-scroll {
		position: relative;
		overflow: auto;
		padding: 0.8rem 0.7rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		min-height: 0;
	}

	.timeline-controls {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		z-index: 1;
	}

	.search-input {
		width: 100%;
		border: 1px solid hsla(214, 24%, 18%, 0.2);
		border-radius: 0.5rem;
		padding: 0.4rem 0.55rem;
		background: hsla(0, 0%, 100%, 0.85);
		color: inherit;
	}

	.tag-list {
		display: flex;
		gap: 0.35rem;
		flex-wrap: wrap;
	}

	.tag-button {
		padding: 0.25rem 0.45rem;
		font-size: 0.74rem;
		border-radius: 999px;
		border: 1px solid hsla(214, 24%, 18%, 0.2);
		background: hsla(0, 0%, 100%, 0.9);
		color: hsl(214deg 32% 24%);
	}

	.tag-button.active {
		background: hsl(205deg 72% 46%);
		border-color: hsl(205deg 72% 46%);
		color: white;
	}

	.timeline-rail {
		position: absolute;
		left: 1.25rem;
		top: 0.8rem;
		bottom: 0.8rem;
		width: 2px;
		background: linear-gradient(hsl(205deg 70% 63%), hsla(205, 70%, 63%, 0.2));
	}

	.timeline-node {
		display: grid;
		grid-template-columns: 1rem 1fr;
		gap: 0.6rem;
		align-items: flex-start;
		text-align: left;
		padding: 0.45rem 0.4rem;
		border-radius: 0.6rem;
		z-index: 1;
	}

	.timeline-node:hover,
	.timeline-node.active {
		background: hsla(206, 76%, 48%, 0.12);
	}

	.dot {
		width: 0.76rem;
		height: 0.76rem;
		margin-top: 0.35rem;
		border-radius: 50%;
		background: hsl(205deg 72% 46%);
		box-shadow: 0 0 0 3px hsla(205, 72%, 46%, 0.17);
	}

	.timeline-node .node-content {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.date {
		font-size: 0.74rem;
		color: hsla(217, 22%, 20%, 0.7);
	}

	.timeline-node strong {
		font-size: 0.9rem;
		line-height: 1.35;
	}

	.timeline-node small {
		font-size: 0.75rem;
		color: hsla(217, 22%, 20%, 0.72);
	}

	.empty-state {
		font-size: 0.88rem;
		color: hsla(217, 22%, 20%, 0.75);
		padding: 0.4rem;
	}

	.event-detail {
		overflow: auto;
		padding: 0.8rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		min-height: 0;
	}

	.hero {
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: 0.8rem;

		.eyebrow {
			font-size: 0.78rem;
			color: hsla(217, 20%, 20%, 0.7);
			margin-bottom: 0.3rem;
		}

		h1 {
			font-size: 1.26rem;
			line-height: 1.3;
			margin-bottom: 0.45rem;
		}

		p {
			line-height: 1.45;
		}
	}

	figure {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;

		img {
			width: 100%;
			height: 11rem;
			object-fit: cover;
			border-radius: 0.65rem;
			border: 1px solid hsla(217, 18%, 20%, 0.16);
		}

		figcaption {
			font-size: 0.78rem;
			line-height: 1.4;
			color: hsla(217, 20%, 20%, 0.72);
		}
	}

	.facts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 0.7rem;

		article {
			background: hsla(0, 0%, 100%, 0.58);
			border: 1px solid hsla(214, 24%, 18%, 0.1);
			border-radius: 0.65rem;
			padding: 0.65rem;
			display: flex;
			flex-direction: column;
			gap: 0.35rem;
		}

		h2 {
			font-size: 0.94rem;
		}

		p,
		li {
			font-size: 0.88rem;
			line-height: 1.42;
		}

		ul {
			padding-left: 1.1rem;
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
		}
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.48rem;

		button {
			padding: 0.4rem 0.68rem;
			border-radius: 0.48rem;
			font-size: 0.82rem;
			font-weight: 600;
			background: hsl(205deg 77% 44%);
			color: white;
			cursor: var(--system-cursor-pointer), pointer;
		}

		button.secondary {
			background: hsl(162deg 62% 38%);
		}

		button.ghost {
			background: hsla(0, 0%, 100%, 0.85);
			color: hsl(214deg 36% 20%);
			border: 1px solid hsla(214, 24%, 18%, 0.15);
		}
	}

	@media (max-width: 980px) {
		.timeline-layout {
			grid-template-columns: 1fr;
			grid-template-rows: 13rem 1fr;
		}

		.hero {
			grid-template-columns: 1fr;
		}
	}
</style>
