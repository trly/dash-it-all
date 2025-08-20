import type { CalendarEvent } from '$lib/types';

/**
 * Check if an event is an all-day event
 */
export function isAllDayEvent(event: CalendarEvent): boolean {
	// node-ical marks all day events with dateOnly property
	const startDate = new Date(event.start);
	const endDate = event.end ? new Date(event.end) : null;

	// Check for dateOnly property first
	if ((event.start as Date & { dateOnly?: boolean })?.dateOnly === true) {
		return true;
	}

	// Fallback: check if times are exactly midnight to midnight (indicating all-day)
	if (endDate) {
		const isStartMidnight = startDate.getHours() === 0 && startDate.getMinutes() === 0;
		const isEndMidnight = endDate.getHours() === 0 && endDate.getMinutes() === 0;
		const isMultipleDays = endDate.getTime() - startDate.getTime() >= 24 * 60 * 60 * 1000;
		return isStartMidnight && isEndMidnight && isMultipleDays;
	}

	return false;
}

/**
 * Format a single time
 */
export function formatTime(date: Date): string {
	return date.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

/**
 * Format a time range for an event
 */
export function formatTimeRange(event: CalendarEvent): string {
	if (!event.start) return 'Invalid time';

	try {
		const start = new Date(event.start);
		const end = event.end ? new Date(event.end) : null;

		const startTime = formatTime(start);

		if (end && end.toDateString() === start.toDateString()) {
			const endTime = formatTime(end);
			return `${startTime} - ${endTime}`;
		}

		return startTime;
	} catch {
		return 'Invalid time';
	}
}

/**
 * Check if an event is currently happening
 */
export function isEventNow(event: CalendarEvent, currentDate: Date): boolean {
	const start = new Date(event.start);
	const end = event.end ? new Date(event.end) : new Date(start.getTime() + 60 * 60 * 1000);

	return currentDate >= start && currentDate <= end;
}

/**
 * Check if an event is upcoming (within 30 minutes)
 */
export function isEventUpcoming(event: CalendarEvent, currentDate: Date): boolean {
	const start = new Date(event.start);
	const timeDiff = start.getTime() - currentDate.getTime();

	return timeDiff > 0 && timeDiff <= 30 * 60 * 1000;
}

/**
 * Get a unique key for an event
 */
export function getEventKey(event: CalendarEvent): string {
	return event.id || `${event.collection}-${event.summary}-${event.start}`;
}
