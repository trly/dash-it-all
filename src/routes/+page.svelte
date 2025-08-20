<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import DashboardGrid from '$lib/components/dashboard-grid.svelte';
	import { dashboardPlugins } from '$lib/stores/dashboard.js';
	import { startEventRefresh } from '$lib/stores/calendar-client.js';
	import { showGrid } from '$lib/stores/grid-visibility.js';
	import { Grid3x3, Grid2x2X } from 'lucide-svelte';
	import '$lib/plugins/index.js'; // Initialize plugin registry
	import '../app.css';

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
		on:click={() => showGrid.update((v) => !v)}
		title="Toggle grid visibility"
	>
		{#if $showGrid}
			<Grid2x2X size={20} />
		{:else}
			<Grid3x3 size={20} />
		{/if}
	</button>
	<DashboardGrid plugins={$dashboardPlugins} />
</div>

<style>
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
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-medium);
		padding: 0.75rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		backdrop-filter: blur(8px);
		box-shadow: var(--shadow-light);
		color: var(--text-secondary);
	}

	.grid-toggle:hover {
		background: var(--bg-hover);
		color: var(--color-primary);
		transform: translateY(-1px);
		box-shadow: var(--shadow-medium);
	}
</style>
