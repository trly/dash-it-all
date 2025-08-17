<script lang="ts">
	import type { WidgetInstance } from '$lib/types/widget.js';
	import { widgetRegistry } from '$lib/widgets/registry.js';
	import { showGrid } from '$lib/stores/grid-visibility.js';

	interface Props {
		widgets: WidgetInstance[];
	}

	let { widgets }: Props = $props();

	function renderWidget(instance: WidgetInstance) {
		const definition = widgetRegistry.get(instance.widgetId);
		if (!definition) {
			console.warn(`Widget definition not found for: ${instance.widgetId}`);
			return null;
		}

		// Apply maxSize constraints to the widget's position
		const maxSize = definition.config.maxSize;
		const effectiveWidth = maxSize?.width 
			? Math.min(instance.position.width, maxSize.width)
			: instance.position.width;
		const effectiveHeight = maxSize?.height 
			? Math.min(instance.position.height, maxSize.height)
			: instance.position.height;

		return {
			component: definition.component,
			effectivePosition: {
				...instance.position,
				width: effectiveWidth,
				height: effectiveHeight
			},
			props: {
				instance,
				settings: instance.settings
			}
		};
	}
</script>

<div class="dashboard-grid" class:show-grid={$showGrid}>
	{#if $showGrid}
		<div class="grid-overlay">
			{#each Array(96) as _, i}
				<div class="grid-cell"></div>
			{/each}
		</div>
	{/if}
	{#each widgets as widget (widget.id)}
		{@const rendered = renderWidget(widget)}
		{#if rendered && widget.enabled}
			{@const Component = rendered.component}
			{@const pos = rendered.effectivePosition}
			<div
				class="widget-container"
				style="
					grid-column: {pos.x + 1} / {pos.x + pos.width + 1};
					grid-row: {pos.y + 1} / {pos.y + pos.height + 1};
				"
			>
				<Component {...rendered.props} />
			</div>
		{/if}
	{/each}
</div>

<style>
	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		grid-template-rows: repeat(8, 1fr);
		gap: 1rem;
		height: calc(100vh - 2rem);
		padding: 1rem;
		box-sizing: border-box;
		overflow: hidden;
	}

	.widget-container {
		position: relative;
		display: flex;
		flex-direction: column;
		min-height: 120px;
	}

	.widget-container > :global(*) {
		flex: 1;
		min-height: 0;
	}

	.grid-overlay {
		grid-column: 1 / -1;
		grid-row: 1 / -1;
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		grid-template-rows: repeat(8, 1fr);
		gap: 1rem;
		pointer-events: none;
		z-index: 1;
	}

	.grid-cell {
		border: 1px solid var(--oc-blue-3);
		border-right: 1px solid var(--oc-blue-1);
		border-bottom: 1px solid var(--oc-blue-1);
	}

	.grid-cell:nth-child(12n) {
		border-right: 1px solid var(--oc-blue-4);
	}

	.grid-cell:nth-child(n+85) {
		border-bottom: 1px solid var(--oc-blue-4);
	}

	.show-grid .widget-container {
		z-index: 2;
		position: relative;
	}

	/* Adjust grid for smaller screens */
	@media (max-height: 600px) {
		.dashboard-grid {
			grid-template-rows: repeat(6, 1fr);
		}
		
		.grid-overlay {
			grid-template-rows: repeat(6, 1fr);
		}
	}

	@media (max-width: 768px) {
		.dashboard-grid {
			grid-template-columns: 1fr;
			grid-template-rows: auto;
			height: auto;
			overflow: visible;
		}

		.widget-container {
			grid-column: 1 !important;
			grid-row: auto !important;
			min-height: 200px;
		}

		.grid-overlay {
			display: none;
		}
	}
</style>
