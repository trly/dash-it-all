<script lang="ts">
	import type { WidgetProps } from '$lib/types/widget.js';
	import type { CalendarEvent } from '$lib/types';
	import { Calendar } from 'lucide-svelte';
	import { calendarEvents, calendarMetadata } from '$lib/stores/calendar-client';
	import { SvelteDate } from 'svelte/reactivity';

	interface Props extends WidgetProps {
		// Calendar widget specific props can be added here
	}

	let { instance }: Props = $props();

	function getUpcomingEvents(): CalendarEvent[] {
		const now = new SvelteDate();
		const weekFromNow = new SvelteDate();
		weekFromNow.setDate(weekFromNow.getDate() + 7);

		return $calendarEvents
			.filter((event) => {
				const eventDate = new Date(event.start);
				return eventDate >= now && eventDate <= weekFromNow;
			})
			.sort((a, b) => a.start.getTime() - b.start.getTime())
			.slice(0, 5); // Show only next 5 events
	}

	function formatEventTime(event: CalendarEvent): string {
		const start = new Date(event.start);
		return start.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	}

	function formatEventDate(event: CalendarEvent): string {
		const start = new SvelteDate(event.start);
		const today = new SvelteDate();
		const tomorrow = new SvelteDate(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (start.toDateString() === today.toDateString()) {
			return 'Today';
		} else if (start.toDateString() === tomorrow.toDateString()) {
			return 'Tomorrow';
		} else {
			return start.toLocaleDateString('en-US', { weekday: 'short' });
		}
	}

	function getCollectionColor(collectionName: string): string {
		const metadata = $calendarMetadata.get(collectionName);
		return metadata?.color || '#4285f4';
	}

	const upcomingEvents = $derived(getUpcomingEvents());
</script>

<div class="calendar-widget">
	<div class="widget-header">
		<Calendar size={20} />
		<h3>{instance.name}</h3>
	</div>

	<div class="events-list">
		{#if upcomingEvents.length === 0}
			<div class="no-events">No upcoming events</div>
		{:else}
			{#each upcomingEvents as event (event.uid)}
				<div class="event-item" style="border-left-color: {getCollectionColor(event.collection)}">
					<div class="event-time">{formatEventTime(event)}</div>
					<div class="event-details">
						<div class="event-title">{event.summary}</div>
						<div class="event-date">{formatEventDate(event)}</div>
					</div>
				</div>
			{/each}
		{/if}
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
		border-left: 3px solid #4285f4;
		padding-left: 0.75rem;
		margin-left: -0.75rem;
	}

	.event-item:last-child {
		border-bottom: none;
	}

	.no-events {
		text-align: center;
		color: #6b7280;
		font-style: italic;
		padding: 2rem 0;
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
