<script lang="ts">
	import type { PluginProps } from '$lib/types/plugin.js';
	import type { CalendarEvent } from '$lib/types';
	import { Calendar } from 'lucide-svelte';
	import { calendarEvents, calendarMetadata, currentDate } from '$lib/stores/calendar-client';
	import EventItem from '$lib/components/events/EventItem.svelte';
	import { getEventKey, isAllDayEvent } from '$lib/components/events/event-utils.js';

	type Props = PluginProps;

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

	function getAllDayEventsForToday(): CalendarEvent[] {
		return getTodaysEvents().filter((event) => isAllDayEvent(event));
	}

	function getTimedEventsForToday(): CalendarEvent[] {
		return getTodaysEvents().filter((event) => !isAllDayEvent(event));
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
</script>

<div class="agenda-widget">
	<div class="agenda-header">
		<h2>{formatDateHeader(new Date())}</h2>
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
</style>
