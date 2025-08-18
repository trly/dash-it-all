<script lang="ts">
	import type { CalendarEvent } from '$lib/types';
	import { calendarMetadata, currentDate } from '$lib/stores/calendar-client';
	import { formatTimeRange, isEventNow, isEventUpcoming, isAllDayEvent } from './event-utils.js';

	interface Props {
		event: CalendarEvent;
		mode?: 'calendar' | 'agenda';
		showLocation?: boolean;
		showDescription?: boolean;
		showCollection?: boolean;
		showStatusIndicators?: boolean;
	}

	let {
		event,
		mode = 'calendar',
		showLocation = true,
		showDescription = false,
		showCollection = false,
		showStatusIndicators = false
	}: Props = $props();

	function getCollectionColor(collectionName: string): string {
		const metadata = $calendarMetadata.get(collectionName);
		return metadata?.color || '#4285f4';
	}

	const isAllDay = $derived(isAllDayEvent(event));
	const isCurrentEvent = $derived(isEventNow(event, $currentDate));
	const isUpcomingEvent = $derived(isEventUpcoming(event, $currentDate));
</script>

<div
	class="event-item"
	class:calendar-mode={mode === 'calendar'}
	class:agenda-mode={mode === 'agenda'}
	class:all-day={isAllDay}
	class:current={isCurrentEvent && !isAllDay}
	class:upcoming={isUpcomingEvent && !isAllDay}
	style="border-left-color: {getCollectionColor(event.collection)}"
>
	{#if mode === 'agenda'}
		{#if !isAllDay}
			<div class="event-time">
				{formatTimeRange(event)}
			</div>
		{/if}
		<div class="event-details">
			<div class="event-title">{event.summary || 'Untitled Event'}</div>
			{#if showLocation && event.location}
				<div class="event-location">📍 {event.location}</div>
			{/if}
			{#if showDescription && event.description}
				<div class="event-description">{event.description}</div>
			{/if}
			{#if showCollection}
				<div class="event-collection">{event.collection}</div>
			{/if}
		</div>
		{#if showStatusIndicators && !isAllDay}
			{#if isCurrentEvent}
				<div class="status-indicator current-indicator">NOW</div>
			{:else if isUpcomingEvent}
				<div class="status-indicator upcoming-indicator">SOON</div>
			{/if}
		{/if}
	{:else}
		<!-- Calendar mode -->
		{#if !isAllDay}
			<div class="event-time">{formatTimeRange(event)}</div>
		{/if}
		<div class="event-title">{event.summary}</div>
		{#if showLocation && event.location}
			<div class="event-location">{event.location}</div>
		{/if}
	{/if}
</div>

<style>
	.event-item {
		background-color: var(--bg-event);
		border-radius: var(--radius-small);
		border-left: 2px solid var(--color-primary);
		transition: all 0.2s ease;
	}

	/* Calendar mode styles */
	.calendar-mode {
		padding: 0.25rem;
		font-size: 0.75rem;
		line-height: 1.1;
	}

	.calendar-mode .event-time {
		font-weight: 600;
		color: var(--text-primary);
		font-size: 0.65rem;
		margin-bottom: 0.125rem;
	}

	.calendar-mode .event-title {
		color: var(--text-primary);
		margin-bottom: 0.0625rem;
		font-weight: 500;
	}

	.calendar-mode .event-location {
		color: var(--text-secondary);
		font-size: 0.65rem;
	}

	.calendar-mode.all-day {
		border-left-width: 3px;
	}

	.calendar-mode.all-day .event-title {
		font-weight: 600;
	}

	/* Agenda mode styles */
	.agenda-mode {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem;
		border-left-width: 4px;
		position: relative;
	}

	.agenda-mode:hover {
		background-color: var(--bg-event-hover);
	}

	.agenda-mode.current {
		background-color: var(--bg-current);
		border-left-color: var(--color-success);
	}

	.agenda-mode.upcoming {
		background-color: var(--bg-upcoming);
		border-left-color: var(--color-warning);
	}

	.agenda-mode .event-time {
		font-weight: 600;
		font-size: 1.125rem;
		color: var(--text-primary);
		white-space: nowrap;
	}

	.event-details {
		flex: 1;
		min-width: 0;
	}

	.agenda-mode .event-title {
		font-weight: 500;
		font-size: 1.25rem;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
	}

	.agenda-mode .event-location {
		font-size: 1rem;
		color: var(--text-secondary);
		margin-bottom: 0.25rem;
	}

	.event-description {
		font-size: 1rem;
		color: var(--text-secondary);
		line-height: 1.4;
		margin-bottom: 0.25rem;
	}

	.event-collection {
		font-size: 0.875rem;
		color: var(--text-tertiary);
		font-weight: 500;
		margin-top: 0.25rem;
		opacity: 0.8;
	}

	.status-indicator {
		font-size: 0.75rem;
		font-weight: 700;
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-large);
		text-align: center;
		white-space: nowrap;
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	.current-indicator {
		background-color: var(--color-success);
		color: var(--oc-white);
	}

	.upcoming-indicator {
		background-color: var(--color-warning);
		color: var(--oc-gray-8);
	}
</style>
