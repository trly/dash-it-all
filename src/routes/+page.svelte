<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import DashboardGrid from '$lib/components/dashboard-grid.svelte';
	import { dashboardWidgets } from '$lib/stores/dashboard.js';
	import { startEventRefresh } from '$lib/stores/calendar-client.js';
	import '$lib/widgets/index.js'; // Initialize widget registry

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
	<DashboardGrid widgets={$dashboardWidgets} />
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
		overflow: hidden;
	}
</style>
