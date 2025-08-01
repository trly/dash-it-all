import { writable, derived } from 'svelte/store';
import type { CalendarEvent, VdirMetadata } from '../types.js';

// Store for all calendar events
export const calendarEvents = writable<CalendarEvent[]>([]);

// Store for calendar metadata (vdir metadata)
export const calendarMetadata = writable<Map<string, VdirMetadata>>(new Map());

// Derived store for events grouped by collection
export const eventsByCollection = derived(calendarEvents, ($events) => {
	const grouped = new Map<string, CalendarEvent[]>();

	for (const event of $events) {
		if (!grouped.has(event.collection)) {
			grouped.set(event.collection, []);
		}
		grouped.get(event.collection)!.push(event);
	}

	return grouped;
});

// Derived store for today's events
export const todaysEvents = derived(calendarEvents, ($events) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	return $events
		.filter((event) => {
			const eventDate = new Date(event.start);
			return eventDate >= today && eventDate < tomorrow;
		})
		.sort((a, b) => a.start.getTime() - b.start.getTime());
});

// Derived store for upcoming events (next 7 days)
export const upcomingEvents = derived(calendarEvents, ($events) => {
	const now = new Date();
	const weekFromNow = new Date();
	weekFromNow.setDate(weekFromNow.getDate() + 7);

	return $events
		.filter((event) => {
			const eventDate = new Date(event.start);
			return eventDate >= now && eventDate <= weekFromNow;
		})
		.sort((a, b) => a.start.getTime() - b.start.getTime());
});

// Fetch events from server API
export async function loadCalendarEvents(): Promise<void> {
	try {
		const response = await fetch('/api/events');
		if (response.ok) {
			const events = await response.json();
			// Convert date strings back to Date objects
			const parsedEvents = events.map((event: Partial<CalendarEvent> & { start: string; end?: string }) => ({
				...event,
				start: new Date(event.start),
				end: event.end ? new Date(event.end) : undefined
			}));
			calendarEvents.set(parsedEvents);
		} else {
			console.error('Failed to load calendar events:', response.statusText);
		}
	} catch (error) {
		console.error('Failed to load calendar events:', error);
	}
}

// Fetch metadata from server API
export async function loadCalendarMetadata(): Promise<void> {
	try {
		const response = await fetch('/api/metadata');
		if (response.ok) {
			const metadataObj = await response.json();
			// Convert object back to Map with proper typing
			const metadataMap = new Map<string, VdirMetadata>(
				Object.entries(metadataObj).map(([key, value]) => [key, value as VdirMetadata])
			);
			calendarMetadata.set(metadataMap);
		} else {
			console.error('Failed to load calendar metadata:', response.statusText);
		}
	} catch (error) {
		console.error('Failed to load calendar metadata:', error);
	}
}

// Load both events and metadata
export async function loadCalendarData(): Promise<void> {
	await Promise.all([loadCalendarEvents(), loadCalendarMetadata()]);
}

// Periodically refresh events and metadata
export function startEventRefresh(intervalMs: number = 30000): () => void {
	const interval = setInterval(loadCalendarData, intervalMs);

	// Initial load
	loadCalendarData();

	// Return cleanup function
	return () => clearInterval(interval);
}
