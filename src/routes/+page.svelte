<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Clock from '$lib/components/clock.svelte';
	import CalendarView from '$lib/components/calendar-view.svelte';
	import DailyAgenda from '$lib/components/daily-agenda.svelte';
	import { calendarEvents, startEventRefresh } from '$lib/stores/calendar-client.js';

	let cleanup: (() => void) | null = null;

	// Initialize calendar data loading on mount
	onMount(() => {
		cleanup = startEventRefresh(30000); // Refresh every 30 seconds
	});

	onDestroy(() => {
		if (cleanup) {
			cleanup();
		}
	});
</script>

<svelte:head>
	<title>Dash It All - Dashboard</title>
</svelte:head>

<div class="dashboard">
	<header class="dashboard-header">
		<div class="header-content">
			<h1>Dash It All</h1>
			<Clock />
		</div>
	</header>

	<main class="dashboard-main">
		<section class="calendar-section">
			<CalendarView events={$calendarEvents} viewType="week" daysToShow={7} />
		</section>

		<aside class="agenda-section">
			<DailyAgenda events={$calendarEvents} />
		</aside>
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background-color: #f5f5f5;
	}

	:global(:root) {
		--text-primary: #1a1a1a;
		--text-secondary: #666;
		--bg-primary: #ffffff;
		--bg-secondary: #f8f9fa;
		--bg-event: #f1f3f4;
		--bg-event-hover: #e8f0fe;
		--bg-current: #e8f5e8;
		--bg-upcoming: #fff3e0;
		--border-color: #e1e5e9;
		--color-primary: #4285f4;
		--color-success: #34a853;
		--color-warning: #fbbc04;
	}

	.dashboard {
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.dashboard-header {
		background-color: var(--bg-primary);
		border-bottom: 1px solid var(--border-color);
		flex-shrink: 0;
		padding: 0 1rem;
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 100%;
	}

	.header-content h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.dashboard-main {
		flex: 1;
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 1rem;
		padding: 1rem;
		min-height: 0;
	}

	.calendar-section {
		background-color: var(--bg-primary);
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.agenda-section {
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	@media (max-width: 768px) {
		.dashboard-main {
			grid-template-columns: 1fr;
			grid-template-rows: 2fr 1fr;
		}
	}
</style>
