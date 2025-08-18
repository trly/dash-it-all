<script lang="ts">
	import type { PluginProps } from '$lib/types/plugin.js';
	import type { CalendarEvent } from '$lib/types';
	import { Calendar } from 'lucide-svelte';
	import { calendarEvents, calendarMetadata, currentDate } from '$lib/stores/calendar-client';
	import { SvelteDate } from 'svelte/reactivity';
	import EventItem from '$lib/components/events/EventItem.svelte';
	import { isAllDayEvent, getEventKey } from '$lib/components/events/event-utils.js';

	type Props = PluginProps;

	let { instance, settings }: Props = $props();

	// Use reactive currentDate from store for midnight updates
	const reactiveCurrentDate = $derived($currentDate);

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
		const viewType = settings.viewType as string || 'week';
		const daysToShow = settings.daysToShow as number || 7;

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
		return $calendarEvents
			.filter((event) => {
				const eventDate = new Date(event.start);
				return eventDate.toDateString() === day.toDateString();
			})
			.sort((a, b) => {
				try {
					return new Date(a.start).getTime() - new Date(b.start).getTime();
				} catch {
					return 0;
				}
			});
	}

	function getAllDayEventsForDay(day: Date): CalendarEvent[] {
		return getEventsForDay(day).filter((event) => isAllDayEvent(event));
	}

	function getTimedEventsForDay(day: Date): CalendarEvent[] {
		return getEventsForDay(day).filter((event) => !isAllDayEvent(event));
	}



	function formatDayHeader(date: Date): string {
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	}



	const displayDays = $derived(getDaysToDisplay());
	const viewType = $derived(settings.viewType as string || 'week');
	const daysToShow = $derived(settings.daysToShow as number || 7);
</script>

<div class="calendar-widget">
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
								<div class="all-day-label">All Day</div>
								{#each getAllDayEventsForDay(day) as event (getEventKey(event))}
									<EventItem
										{event}
										mode="calendar"
										showLocation={false}
										showCollection={false}
									/>
								{/each}
							</div>
						{/if}

						<!-- Timed Events Section -->
						{#each getTimedEventsForDay(day) as event (getEventKey(event))}
							<EventItem
								{event}
								mode="calendar"
								showLocation={false}
								showCollection={false}
							/>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.calendar-widget {
		padding: 1rem;
		background: var(--bg-primary);
		border-radius: var(--radius-medium);
		box-shadow: var(--shadow-light);
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
		border-bottom: 1px solid var(--border-color);
		color: var(--text-secondary);
	}

	.widget-header h3 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.calendar-view {
		flex: 1;
		overflow-y: auto;
	}

	.calendar-grid {
		display: grid;
		gap: 1px;
		background-color: var(--border-color);
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
		background-color: var(--bg-primary);
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.day-header {
		padding: 0.5rem 0.25rem;
		font-weight: 600;
		font-size: 2rem;
		border-bottom: 1px solid var(--border-color);
		text-align: center;
		background-color: var(--bg-secondary);
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.day-content {
		padding: 0.25rem;
		flex: 1;
		overflow-y: auto;
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
		font-size: 0.6rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		margin-bottom: 0.25rem;
		letter-spacing: 0.5px;
	}


</style>
