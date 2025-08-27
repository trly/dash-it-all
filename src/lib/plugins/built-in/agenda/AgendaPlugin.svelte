<script lang="ts">
	import type { PluginProps } from '$lib/types/plugin.js';
	import type { CalendarEvent } from '$lib/types';
	import { calendarEvents, currentDate } from '$lib/stores/calendar-client';
	import EventItem from '$lib/components/events/EventItem.svelte';
	import { getEventKey, isAllDayEvent, isEventNow } from '$lib/components/events/event-utils.js';
	import { appConfig, loadAppConfig } from '$lib/stores/config.js';
	import { onMount } from 'svelte';

	type Props = PluginProps;

	// Props interface for compatibility but not used in this component
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const props: Props = $props();

	onMount(async () => {
		await loadAppConfig();
	});

	function getTodaysEvents(): CalendarEvent[] {
		const now = $currentDate;
		const targetDate = $currentDate;

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

	function getAllDayEventsForToday(): CalendarEvent[] {
		return getTodaysEvents().filter((event) => isAllDayEvent(event));
	}

	function getTimedEventsForToday(): CalendarEvent[] {
		return getTodaysEvents().filter((event) => !isAllDayEvent(event));
	}

	function getInProgressNotificationEvents(): CalendarEvent[] {
		const notificationCollections = $appConfig?.notificationCollections || [];

		if (notificationCollections.length === 0) return [];

		return $calendarEvents.filter((event) => {
			if (!event || !event.start || isAllDayEvent(event)) return false;
			if (!notificationCollections.includes(event.collection)) return false;
			return isEventNow(event, $currentDate);
		});
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
	const allDayEvents = $derived(getAllDayEventsForToday());
	const timedEvents = $derived(getTimedEventsForToday());
	const inProgressNotifications = $derived(getInProgressNotificationEvents());
</script>

<div class="agenda-widget">
	<div class="agenda-header">
		<h2>{formatDateHeader($currentDate)}</h2>
		{#if inProgressNotifications.length > 0}
			<div class="notification-pill pulse">
				<span>
					{$appConfig?.notificationMessage || 'Meeting in progress'}
				</span>
			</div>
		{/if}
	</div>

	<div class="agenda-content">
		{#if todaysEvents.length === 0}
			<div class="no-events">
				<p>No events scheduled for today</p>
			</div>
		{:else}
			<div class="events-list">
				<!-- All Day Events Section -->
				{#if allDayEvents.length > 0}
					<div class="all-day-section">
						<div class="all-day-label">All Day</div>
						{#each allDayEvents as event (getEventKey(event))}
							<EventItem
								{event}
								mode="agenda"
								showLocation={false}
								showDescription={false}
								showCollection={false}
								showStatusIndicators={false}
							/>
						{/each}
					</div>
				{/if}

				<!-- Timed Events Section -->
				{#each timedEvents as event (getEventKey(event))}
					<EventItem
						{event}
						mode="agenda"
						showLocation={false}
						showDescription={false}
						showCollection={false}
						showStatusIndicators={false}
					/>
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
		background-color: var(--bg-primary);
		border-radius: var(--radius-medium);
		overflow: hidden;
		box-shadow: var(--shadow-light);
	}

	.agenda-header {
		padding: 1.5rem;
		background-color: var(--bg-secondary);
		border-bottom: 1px solid var(--border-color);
	}

	.agenda-header h2 {
		margin: 0 0 0.5rem 0;
		font-size: 3rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.agenda-content {
		flex: 1;
		overflow-y: auto;
		padding: 0.25rem;
	}

	.no-events {
		text-align: center;
		padding: 2rem;
		color: var(--text-secondary);
	}

	.events-list {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.all-day-section {
		border-bottom: 1px solid var(--border-color);
		margin-bottom: 0.25rem;
		padding-bottom: 0.25rem;
	}

	.all-day-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		margin-bottom: 0.25rem;
		letter-spacing: 0.5px;
	}

	.notification-pill {
		background-color: #ffe3e3; /* light red background */
		color: #c92a2a; /* open-color red-9 for text */
		padding: 0.5rem 1rem;
		border-radius: 9999px; /* full rounded pill */
		display: block;
		width: 100%;
		text-align: center;
		font-weight: 600;
		font-size: 3rem; /* match header font size */
		border: 2px solid #c92a2a;
		margin-top: 0.5rem;
		box-sizing: border-box;
	}

	.pulse {
		animation: pulse 4s infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
		100% {
			opacity: 1;
		}
	}
</style>
