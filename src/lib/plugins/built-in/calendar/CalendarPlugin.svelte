<script lang="ts">
	import type { PluginProps } from '$lib/types/plugin.js';
	import type { CalendarEvent } from '$lib/types';
	import { calendarEvents, currentDate } from '$lib/stores/calendar-client';
	import { SvelteDate } from 'svelte/reactivity';
	import EventItem from '$lib/components/events/EventItem.svelte';
	import { isAllDayEvent, getEventKey } from '$lib/components/events/event-utils.js';

	type Props = PluginProps;

	let { settings }: Props = $props();

	// Use reactive currentDate from store for midnight updates
	const reactiveCurrentDate = $derived($currentDate);

	// Scroll container reference for "Today" button functionality
	let scrollContainer: HTMLDivElement;

	function getMonthStart(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth(), 1);
	}

	function getDaysToDisplay(): Date[] {
		const days: Date[] = [];
		const viewType = (settings.viewType as string) || 'week';

		if (viewType === 'week') {
			// For scrollable view, always show 14 days starting from today
			const startDate = new SvelteDate(reactiveCurrentDate);
			const totalDays = 14; // Always show 14 days for scrollable view

			for (let i = 0; i < totalDays; i++) {
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
	const viewType = $derived((settings.viewType as string) || 'week');
	const daysToShow = $derived((settings.daysToShow as number) || 7);

	function scrollToToday() {
		// Force regeneration of the day display starting from today
		const today = new SvelteDate();
		today.setHours(0, 0, 0, 0);

		// Find the index of today in the current display
		const todayIndex = displayDays.findIndex((day) => {
			const displayDay = new SvelteDate(day);
			displayDay.setHours(0, 0, 0, 0);
			return displayDay.getTime() === today.getTime();
		});

		if (scrollContainer) {
			if (todayIndex >= 0) {
				// Today is visible, scroll to it
				const dayWidth = scrollContainer.scrollWidth / displayDays.length;
				scrollContainer.scrollTo({
					left: todayIndex * dayWidth,
					behavior: 'smooth'
				});
			} else {
				// Today is not visible, scroll to the beginning (which should be today or close to it)
				scrollContainer.scrollTo({
					left: 0,
					behavior: 'smooth'
				});
			}
		}
	}
</script>

<div class="calendar-widget">
	<div
		class="calendar-view"
		style="--days-to-show: {daysToShow}"
		class:week-view={viewType === 'week'}
		class:month-view={viewType === 'month'}
		class:scrollable-week={viewType === 'week'}
		bind:this={scrollContainer}
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
									<EventItem {event} mode="calendar" showLocation={false} showCollection={false} />
								{/each}
							</div>
						{/if}

						<!-- Timed Events Section -->
						{#each getTimedEventsForDay(day) as event (getEventKey(event))}
							<EventItem {event} mode="calendar" showLocation={false} showCollection={false} />
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
	{#if viewType === 'week'}
		<div class="calendar-footer">
			<button class="today-button" onclick={scrollToToday}>Today</button>
		</div>
	{/if}
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

	.calendar-footer {
		display: flex;
		justify-content: flex-end;
		margin-top: 0.5rem;
	}

	.today-button {
		padding: 0.5rem 1rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-small);
		color: var(--text-primary);
		font-size: 0.875rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.today-button:hover {
		background: var(--bg-tertiary);
	}

	.calendar-view {
		flex: 1;
		overflow-y: auto;
	}

	.scrollable-week {
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* Internet Explorer 10+ */
	}

	.scrollable-week::-webkit-scrollbar {
		display: none; /* WebKit */
	}

	.calendar-grid {
		display: grid;
		gap: 1px;
		background-color: var(--border-color);
		height: 100%;
		width: 100%;
	}

	.week-view .calendar-grid {
		grid-template-columns: repeat(14, 1fr);
		width: calc(100% * 14 / 3);
		min-width: 100%;
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
		scroll-snap-align: start;
		scroll-snap-stop: always;
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
		text-align: left;
	}
</style>
