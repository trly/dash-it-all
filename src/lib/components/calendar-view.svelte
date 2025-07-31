<script lang="ts">
	import type { CalendarEvent } from '$lib/types';

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
		currentDate = new Date()
	}: Props = $props();

	function getWeekStart(date: Date): Date {
		const d = new Date(date);
		const day = d.getDay();
		const diff = d.getDate() - day;
		return new Date(d.setDate(diff));
	}

	function getMonthStart(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth(), 1);
	}

	function getDaysToDisplay(): Date[] {
		const days: Date[] = [];

		if (viewType === 'week') {
			const startDate = getWeekStart(currentDate);
			for (let i = 0; i < daysToShow; i++) {
				const day = new Date(startDate);
				day.setDate(startDate.getDate() + i);
				days.push(day);
			}
		} else {
			const startDate = getMonthStart(currentDate);
			const daysInMonth = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth() + 1,
				0
			).getDate();

			for (let i = 0; i < daysInMonth; i++) {
				const day = new Date(startDate);
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

	const displayDays = $derived(getDaysToDisplay());
</script>

<div
	class="calendar-view"
	class:week-view={viewType === 'week'}
	class:month-view={viewType === 'month'}
>
	<div class="calendar-grid">
		{#each displayDays as day}
			<div class="day-column">
				<div class="day-header">
					{formatDayHeader(day)}
				</div>
				<div class="day-content">
					{#each getEventsForDay(day) as event}
						<div class="event" style="border-left-color: {event.collection}">
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
		overflow-y: auto;
	}

	.calendar-grid {
		display: grid;
		gap: 1px;
		background-color: var(--border-color, #e1e5e9);
		height: 100%;
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
		padding: 0.75rem;
		font-weight: 600;
		font-size: 0.875rem;
		border-bottom: 1px solid var(--border-color, #e1e5e9);
		text-align: center;
		background-color: var(--bg-secondary, #f8f9fa);
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
</style>
