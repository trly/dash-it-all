<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import DashboardGrid from '$lib/components/dashboard-grid.svelte';
	import { dashboardWidgets } from '$lib/stores/dashboard.js';
	import { startEventRefresh } from '$lib/stores/calendar-client.js';
	import { showGrid } from '$lib/stores/grid-visibility.js';
	import { Grid3x3, Grid2x2X } from 'lucide-svelte';
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
	<button 
		class="grid-toggle"
		on:click={() => showGrid.update(v => !v)}
		title="Toggle grid visibility"
	>
		{#if $showGrid}
			<Grid2x2X size={20} />
		{:else}
			<Grid3x3 size={20} />
		{/if}
	</button>
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
		position: relative;
	}

	.grid-toggle {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 1000;
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid var(--border-color, #e1e5e9);
		border-radius: 8px;
		padding: 0.75rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		backdrop-filter: blur(8px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.grid-toggle:hover {
		background: rgba(255, 255, 255, 1);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}
</style>
