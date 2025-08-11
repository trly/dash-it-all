<script lang="ts">
	import type { WidgetProps } from '$lib/types/widget.js';
	import type { CalendarEvent } from '$lib/types';
	import { Calendar } from 'lucide-svelte';
	import { calendarEvents, calendarMetadata, currentDate } from '$lib/stores/calendar-client';

	type Props = WidgetProps;

	let { instance, settings }: Props = $props();

	function getTodaysEvents(): CalendarEvent[] {
		const now = $currentDate;
		const targetDate = new Date();
		
		return $calendarEvents
			.filter((event) => {
				if (!event || !event.start) return false;
				try {
					const eventDate = new Date(event.start);

					// Check if event is on the target date
					if (eventDate.toDateString() !== targetDate.toDateString()) {
						return false;
					}

					// Filter out events that have ended
					if (event.end) {
						const eventEnd = new Date(event.end);
						return eventEnd > now;
					}

					return true;
				} catch {
					return false;
				}
			})
			.sort((a, b) => {
				try {
					return new Date(a.start).getTime() - new Date(b.start).getTime();
				} catch {
					return 0;
				}
			});
	}

	function formatTime(date: Date): string {
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	}

	function formatTimeRange(event: CalendarEvent): string {
		if (!event.start) return 'Invalid time';

		try {
			const start = new Date(event.start);
			const end = event.end ? new Date(event.end) : null;

			if (end && end.toDateString() === start.toDateString()) {
				return `${formatTime(start)} - ${formatTime(end)}`;
			}

			return formatTime(start);
		} catch {
			return 'Invalid time';
		}
	}

	function isEventNow(event: CalendarEvent): boolean {
		const now = $currentDate;
		const start = new Date(event.start);
		const end = event.end ? new Date(event.end) : new Date(start.getTime() + 60 * 60 * 1000);

		return now >= start && now <= end;
	}

	function isEventUpcoming(event: CalendarEvent): boolean {
		const now = $currentDate;
		const start = new Date(event.start);
		const timeDiff = start.getTime() - now.getTime();

		return timeDiff > 0 && timeDiff <= 30 * 60 * 1000;
	}

	function getCollectionColor(collectionName: string): string {
		const metadata = $calendarMetadata.get(collectionName);
		return metadata?.color || '#4285f4';
	}

	function formatDateHeader(date: Date): string {
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	const todaysEvents = $derived(getTodaysEvents());
</script>

<div class="agenda-widget">
	<div class="agenda-header">
		<h2>{formatDateHeader(new Date())}</h2>
		<div class="event-count">
			{todaysEvents.length}
			{todaysEvents.length === 1 ? 'event' : 'events'}
		</div>
	</div>

	<div class="agenda-content">
		{#if todaysEvents.length === 0}
			<div class="no-events">
				<p>No events scheduled for today</p>
			</div>
		{:else}
			<div class="events-list">
				{#each todaysEvents as event (event.id || `${event.collection}-${event.summary}-${event.start}`)}
					<div
						class="event-item"
						class:current={isEventNow(event)}
						class:upcoming={isEventUpcoming(event)}
						style="border-left-color: {getCollectionColor(event.collection)}"
					>
						<div class="event-time">
							{formatTimeRange(event)}
						</div>
						<div class="event-details">
							<div class="event-title">{event.summary || 'Untitled Event'}</div>
							{#if settings.showLocation && event.location}
								<div class="event-location">📍 {event.location}</div>
							{/if}
							{#if event.description}
								<div class="event-description">{event.description}</div>
							{/if}
							{#if settings.showCollection}
								<div class="event-collection">{event.collection}</div>
							{/if}
						</div>
						{#if isEventNow(event)}
							<div class="status-indicator current-indicator">NOW</div>
						{:else if isEventUpcoming(event)}
							<div class="status-indicator upcoming-indicator">SOON</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.agenda-widget {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: white;
		border-radius: 8px;
		overflow: hidden;
	}

	.agenda-header {
		padding: 1.5rem;
		background-color: var(--bg-secondary, #f8f9fa);
		border-bottom: 1px solid var(--border-color, #e1e5e9);
	}

	.agenda-header h2 {
		margin: 0 0 0.5rem 0;
		font-size: 3rem;
		font-weight: 600;
		color: var(--text-primary, #1a1a1a);
	}

	.event-count {
		font-size: 2rem;
		color: var(--text-secondary, #666);
	}

	.agenda-content {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
	}

	.no-events {
		text-align: center;
		padding: 2rem;
		color: var(--text-secondary, #666);
	}

	.events-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.event-item {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem;
		background-color: var(--bg-event, #f8f9fa);
		border-radius: 8px;
		border-left: 4px solid var(--color-primary, #4285f4);
		position: relative;
		transition: all 0.2s ease;
	}

	.event-item:hover {
		background-color: var(--bg-event-hover, #e8f0fe);
	}

	.event-item.current {
		background-color: var(--bg-current, #e8f5e8);
		border-left-color: var(--color-success, #34a853);
	}

	.event-item.upcoming {
		background-color: var(--bg-upcoming, #fff3e0);
		border-left-color: var(--color-warning, #fbbc04);
	}

	.event-time {
		font-weight: 600;
		font-size: 1.125rem;
		color: var(--text-primary, #1a1a1a);
		white-space: nowrap;
	}

	.event-details {
		flex: 1;
		min-width: 0;
	}

	.event-title {
		font-weight: 500;
		font-size: 1.25rem;
		color: var(--text-primary, #1a1a1a);
		margin-bottom: 0.25rem;
	}

	.event-location {
		font-size: 1rem;
		color: var(--text-secondary, #666);
		margin-bottom: 0.25rem;
	}

	.event-description {
		font-size: 1rem;
		color: var(--text-secondary, #666);
		line-height: 1.4;
		margin-bottom: 0.25rem;
	}

	.event-collection {
		font-size: 0.875rem;
		color: var(--text-secondary, #666);
		font-weight: 500;
		margin-top: 0.25rem;
		opacity: 0.8;
	}

	.status-indicator {
		font-size: 0.75rem;
		font-weight: 700;
		padding: 0.25rem 0.5rem;
		border-radius: 12px;
		text-align: center;
		white-space: nowrap;
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	.current-indicator {
		background-color: var(--color-success, #34a853);
		color: white;
	}

	.upcoming-indicator {
		background-color: var(--color-warning, #fbbc04);
		color: var(--text-primary, #1a1a1a);
	}
</style>
