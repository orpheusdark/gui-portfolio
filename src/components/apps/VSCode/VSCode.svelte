<script lang="ts">
	const { is_being_dragged: _is_being_dragged }: { is_being_dragged: boolean } = $props();

	type Project = {
		title: string;
		description: string;
		tech_focus: string;
		live_link: string;
		github_link: string;
	};

	const projects: Project[] = [
		{
			title: 'RIFT-26 - Money Muling Detection System',
			description:
				'Fraud detection using network-based relationship analysis to identify clusters through shared IPs, devices, and circular transactions.',
			tech_focus: 'Cybersecurity, Graph Analysis, Fraud Detection',
			live_link: 'https://dev.to/orpheusdark',
			github_link: 'https://github.com/orpheusdark/RIFT-26',
		},
		{
			title: 'Smart Helmet',
			description: 'IoT-based accident detection and emergency alert system for rapid incident response.',
			tech_focus: 'IoT, Embedded Systems, Safety Engineering',
			live_link: 'https://dev.to/orpheusdark',
			github_link: 'https://github.com/orpheusdark/Smart-Helmet',
		},
		{
			title: 'GovTrack',
			description: 'Government data tracking and accessibility platform for transparent public insights.',
			tech_focus: 'Data Platforms, Public Tech, Web Development',
			live_link: 'https://dev.to/orpheusdark',
			github_link: 'https://github.com/orpheusdark/GovTrack',
		},
		{
			title: 'Greenigma',
			description: 'Sustainability awareness and tracking platform designed to monitor impact and habits.',
			tech_focus: 'Sustainability Tech, Analytics, Web Apps',
			live_link: 'https://dev.to/orpheusdark',
			github_link: 'https://github.com/orpheusdark/Greenigma',
		},
		{
			title: 'MediReach',
			description: 'Healthcare accessibility platform connecting users to essential medical resources.',
			tech_focus: 'HealthTech, Accessibility, Service Design',
			live_link: 'https://dev.to/orpheusdark',
			github_link: 'https://github.com/orpheusdark/MediReach',
		},
		{
			title: 'HealthAxis',
			description: 'Health tracking and visualization system for personal wellness insights.',
			tech_focus: 'Data Visualization, Health Tracking, Dashboards',
			live_link: 'https://dev.to/orpheusdark',
			github_link: 'https://github.com/orpheusdark/HealthAxis',
		},
		{
			title: 'PeerMindHub',
			description: 'Peer-to-peer knowledge and support platform for collaborative growth.',
			tech_focus: 'Community Systems, Collaboration, Product Engineering',
			live_link: 'https://dev.to/orpheusdark',
			github_link: 'https://github.com/orpheusdark/PeerMindHub',
		},
		{
			title: 'Receipt Lens',
			description: 'Receipt data extraction system that outputs structured and usable records.',
			tech_focus: 'OCR, Data Extraction, Automation',
			live_link: 'https://dev.to/orpheusdark',
			github_link: 'https://github.com/orpheusdark/Receipt-Lens',
		},
		{
			title: 'Pramana-AI',
			description: 'AI-powered decision support system for practical and explainable recommendations.',
			tech_focus: 'Applied AI, Decision Support, Responsible Systems',
			live_link: 'https://dev.to/orpheusdark',
			github_link: 'https://github.com/orpheusdark/Pramana-AI',
		},
	];
</script>

<section class="container">
	<header class="app-window-drag-handle titlebar">
		<span>Projects Portfolio</span>
	</header>

	<section class="workspace">
		{#each projects as project}
			<article class="card">
				<h2>{project.title}</h2>
				<p>{project.description}</p>
				<p class="focus"><strong>Tech focus:</strong> {project.tech_focus}</p>
				<div class="links">
					<a href={project.live_link} target="_blank" rel="noopener noreferrer">Live link</a>
					<a href={project.github_link} target="_blank" rel="noopener noreferrer">GitHub link</a>
				</div>
			</article>
		{/each}
	</section>
</section>

<style>
	.container {
		background-color: #1f2128;
		padding: 1px;

		border-radius: inherit;

		display: grid;
		grid-template-rows: auto 1fr;
	}

	.titlebar {
		padding: 0.9rem;
		display: flex;
		justify-content: center;

		span {
			font-size: 0.9rem;
			color: hsl(220deg 12% 82%);
			letter-spacing: 0.4px;
		}
	}

	.workspace {
		overflow: auto;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16.5rem, 1fr));
		gap: 0.8rem;
		padding: 0.9rem;
	}

	.card {
		background: linear-gradient(180deg, hsl(224deg 15% 22%), hsl(224deg 18% 17%));
		border: 1px solid hsl(220deg 14% 30%);
		border-radius: 0.55rem;
		padding: 0.8rem;
		color: hsl(220deg 18% 88%);
		display: flex;
		flex-direction: column;
		gap: 0.55rem;

		h2 {
			font-size: 1rem;
			line-height: 1.3;
		}

		p {
			line-height: 1.4;
			color: hsl(220deg 17% 78%);
		}
	}

	.focus {
		font-size: 0.9rem;
	}

	.links {
		display: flex;
		gap: 0.5rem;
		margin-top: auto;

		a {
			background-color: hsl(214deg 79% 56%);
			color: white;
			text-decoration: none;
			font-size: 0.8rem;
			padding: 0.35rem 0.5rem;
			border-radius: 0.35rem;
		}

		a:last-child {
			background-color: hsl(270deg 44% 44%);
		}
	}

	header {
		padding: 0.9rem;
 	}

	:global(.tl-container.vscode) {
		top: 0.6rem;
		left: 0.6rem;
	}

	:global(body.dark) .card {
		box-shadow: 0 1px 0 hsla(0, 0%, 100%, 0.04) inset;
 	}

	:global(body:not(.dark)) .container {
		background-color: #242831;
	}

	.workspace::-webkit-scrollbar {
		width: 12px;
	}

	.workspace::-webkit-scrollbar-thumb {
		background-color: hsla(0, 0%, 100%, 0.17);
		border: 3px solid transparent;
		border-radius: 10px;
		background-clip: content-box;
	}

	.workspace::-webkit-scrollbar-track {
		background-color: transparent;
	}

	.workspace {
		width: 100%;
		height: 100%;
		border-radius: 0 0 0.75rem 0.75rem;
	}
</style>
