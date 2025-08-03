<script lang="ts">
	import type { CalendarEvent } from '$lib/types';
	import { calendarMetadata, currentDate } from '$lib/stores/calendar-client';
	import { SvelteDate } from 'svelte/reactivity';

	interface Props {
		events: CalendarEvent[];
		viewType: 'week' | 'month';
		daysToShow?: number;
		currentDate?: Date;
	}

	let {
		events = [],
		viewType = 'week',
		daysToShow = 7,
		currentDate: propCurrentDate = new SvelteDate()
	}: Props = $props();

	// Use reactive currentDate from store for midnight updates, fallback to prop
	const reactiveCurrentDate = $derived($currentDate || propCurrentDate);

	function getWeekStart(date: Date): Date {
		const d = new SvelteDate(date);
		const day = d.getDay();
		const diff = d.getDate() - day;
		return new SvelteDate(d.setDate(diff));
	}

	function getMonthStart(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth(), 1);
	}

	function getDaysToDisplay(): Date[] {
		const days: Date[] = [];

		if (viewType === 'week') {
			// If showing less than 7 days, start from today; otherwise start from week beginning
			const startDate =
				daysToShow < 7 ? new SvelteDate(reactiveCurrentDate) : getWeekStart(reactiveCurrentDate);
			for (let i = 0; i < daysToShow; i++) {
				const day = new SvelteDate(startDate);
				day.setDate(startDate.getDate() + i);
				days.push(day);
			}
		} else {
			const startDate = getMonthStart(reactiveCurrentDate);
			const daysInMonth = new SvelteDate(
				reactiveCurrentDate.getFullYear(),
				reactiveCurrentDate.getMonth() + 1,
				0
			).getDate();

			for (let i = 0; i < daysInMonth; i++) {
				const day = new SvelteDate(startDate);
				day.setDate(startDate.getDate() + i);
				days.push(day);
			}
		}

		return days;
	}

	function getEventsForDay(day: Date): CalendarEvent[] {
		return events.filter((event) => {
			const eventDate = new Date(event.start);
			return eventDate.toDateString() === day.toDateString();
		});
	}

	function getAllDayEventsForDay(day: Date): CalendarEvent[] {
		return getEventsForDay(day).filter((event) => isAllDayEvent(event));
	}

	function getTimedEventsForDay(day: Date): CalendarEvent[] {
		return getEventsForDay(day).filter((event) => !isAllDayEvent(event));
	}

	function isAllDayEvent(event: CalendarEvent): boolean {
		// node-ical marks all day events with dateOnly property
		return (event.start as Date & { dateOnly?: boolean })?.dateOnly === true;
	}

	function formatDayHeader(date: Date): string {
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatTimeRange(event: CalendarEvent): string {
		const start = new Date(event.start);
		const end = event.end ? new Date(event.end) : null;

		const startTime = start.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});

		if (end) {
			const endTime = end.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true
			});
			return `${startTime} - ${endTime}`;
		}

		return startTime;
	}

	function getCollectionColor(collectionName: string): string {
		const metadata = $calendarMetadata.get(collectionName);
		return metadata?.color || '#4285f4';
	}

	const displayDays = $derived(getDaysToDisplay());
</script>

<div
	class="calendar-view"
	style="--days-to-show: {daysToShow}"
	class:week-view={viewType === 'week'}
	class:month-view={viewType === 'month'}
>
	<div class="calendar-grid">
		{#each displayDays as day (day.toISOString())}
			<div class="day-column">
				<div class="day-header">
					{formatDayHeader(day)}
				</div>
				<div class="day-content">
					<!-- All Day Events Section -->
					{#if getAllDayEventsForDay(day).length > 0}
						<div class="all-day-section">
							{#each getAllDayEventsForDay(day) as event (event.id || `${event.collection}-${event.summary}-${event.start}`)}
								<div
									class="event all-day-event"
									style="border-left-color: {getCollectionColor(event.collection)}"
								>
									<div class="event-title">{event.summary}</div>
									{#if event.location}
										<div class="event-location">{event.location}</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}

					<!-- Timed Events Section -->
					{#each getTimedEventsForDay(day) as event (event.id || `${event.collection}-${event.summary}-${event.start}`)}
						<div class="event" style="border-left-color: {getCollectionColor(event.collection)}">
							<div class="event-time">{formatTimeRange(event)}</div>
							<div class="event-title">{event.summary}</div>
							{#if event.location}
								<div class="event-location">{event.location}</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.calendar-view {
		height: 100%;
		width: 100%;
		overflow-y: auto;
	}

	.calendar-grid {
		display: grid;
		gap: 1px;
		background-color: var(--border-color, #e1e5e9);
		height: 100%;
		width: 100%;
	}

	.week-view .calendar-grid {
		grid-template-columns: repeat(var(--days-to-show, 7), 1fr);
	}

	.month-view .calendar-grid {
		grid-template-columns: repeat(7, 1fr);
		grid-auto-rows: minmax(120px, 1fr);
	}

	.day-column {
		background-color: white;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.day-header {
		padding: 0.75rem 0.5rem;
		font-weight: 600;
		font-size: 0.875rem;
		border-bottom: 1px solid var(--border-color, #e1e5e9);
		text-align: center;
		background-color: var(--bg-secondary, #f8f9fa);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.day-content {
		padding: 0.5rem;
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.event {
		background-color: var(--bg-event, #f1f3f4);
		border-radius: 4px;
		padding: 0.5rem;
		border-left: 3px solid var(--color-primary, #4285f4);
		font-size: 0.875rem;
		line-height: 1.2;
	}

	.event-time {
		font-weight: 600;
		color: var(--text-primary, #1a1a1a);
		font-size: 0.75rem;
		margin-bottom: 0.25rem;
	}

	.event-title {
		color: var(--text-primary, #1a1a1a);
		margin-bottom: 0.125rem;
	}

	.event-location {
		color: var(--text-secondary, #666);
		font-size: 0.75rem;
	}

	.all-day-section {
		border-bottom: 1px solid var(--border-color, #e1e5e9);
		margin-bottom: 0.5rem;
		padding-bottom: 0.5rem;
	}

	.all-day-event {
		background-color: var(--bg-all-day, #fff5e6);
		border-left-width: 4px;
	}

	.all-day-event .event-title {
		font-weight: 600;
	}
</style>
