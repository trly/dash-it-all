<script lang="ts">
	import type { WidgetInstance } from '$lib/types/widget.js';
	import { widgetRegistry } from '$lib/widgets/registry.js';

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

		return {
			component: definition.component,
			props: {
				instance,
				settings: instance.settings
			}
		};
	}
</script>

<div class="dashboard-grid">
	{#each widgets as widget (widget.id)}
		{@const rendered = renderWidget(widget)}
		{#if rendered && widget.enabled}
			{@const Component = rendered.component}
			<div
				class="widget-container"
				style="
					grid-column: {widget.position.x + 1} / {widget.position.x + widget.position.width + 1};
					grid-row: {widget.position.y + 1} / {widget.position.y + widget.position.height + 1};
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
		grid-template-columns: repeat(12, 1fr);
		grid-template-rows: repeat(8, 1fr);
		gap: 1rem;
		height: 100%;
		padding: 1rem;
	}

	.widget-container {
		min-height: 200px;
		position: relative;
	}

	@media (max-width: 768px) {
		.dashboard-grid {
			grid-template-columns: 1fr;
			grid-template-rows: auto;
		}

		.widget-container {
			grid-column: 1 !important;
			grid-row: auto !important;
		}
	}
</style>
