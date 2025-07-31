<script lang="ts">
	import type { WidgetProps } from '$lib/types/widget.js';
	import { Calendar } from 'lucide-svelte';

	interface Props extends WidgetProps {}

	let { instance, settings }: Props = $props();

	// TODO: Implement actual calendar event loading and display
	const mockEvents = [
		{ title: 'Meeting with team', time: '10:00 AM', date: 'Today' },
		{ title: 'Project deadline', time: '5:00 PM', date: 'Tomorrow' },
		{ title: 'Doctor appointment', time: '2:00 PM', date: 'Friday' }
	];
</script>

<div class="calendar-widget">
	<div class="widget-header">
		<Calendar size={20} />
		<h3>{instance.name}</h3>
	</div>

	<div class="events-list">
		{#each mockEvents as event}
			<div class="event-item">
				<div class="event-time">{event.time}</div>
				<div class="event-details">
					<div class="event-title">{event.title}</div>
					<div class="event-date">{event.date}</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.calendar-widget {
		padding: 1rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.widget-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.widget-header h3 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.events-list {
		flex: 1;
		overflow-y: auto;
	}

	.event-item {
		display: flex;
		gap: 0.75rem;
		padding: 0.5rem 0;
		border-bottom: 1px solid #f3f4f6;
	}

	.event-item:last-child {
		border-bottom: none;
	}

	.event-time {
		font-size: 0.875rem;
		color: #6b7280;
		min-width: 4rem;
	}

	.event-details {
		flex: 1;
	}

	.event-title {
		font-weight: 500;
		margin-bottom: 0.125rem;
	}

	.event-date {
		font-size: 0.75rem;
		color: #9ca3af;
	}
</style>
