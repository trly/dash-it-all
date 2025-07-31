import { writable, derived } from 'svelte/store';
import { fileWatcher } from '../file-watcher.js';
import type { CalendarEvent, FileWatcherEvent, VdirMetadata } from '../types.js';

// Store for all calendar events
export const calendarEvents = writable<CalendarEvent[]>([]);

// Store for calendar metadata (vdir metadata)
export const calendarMetadata = writable<Map<string, VdirMetadata>>(new Map());

// Store for file watcher events (for debugging/monitoring)
export const fileWatcherEvents = writable<FileWatcherEvent[]>([]);

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

// Initialize file watcher and connect to stores
let unsubscribeEvents: (() => void) | null = null;
let unsubscribeFiles: (() => void) | null = null;

export async function initializeCalendarStores(): Promise<void> {
	try {
		// Clean up existing subscriptions
		if (unsubscribeEvents) unsubscribeEvents();
		if (unsubscribeFiles) unsubscribeFiles();

		// Initialize file watcher
		await fileWatcher.init();

		// Subscribe to event changes
		unsubscribeEvents = fileWatcher.onEventsChanged((events) => {
			calendarEvents.set(events);
			// Also update metadata when events change
			calendarMetadata.set(fileWatcher.getAllCollectionMetadata());
		});

		// Subscribe to file changes (for debugging/monitoring)
		unsubscribeFiles = fileWatcher.onFileChanged((event) => {
			fileWatcherEvents.update((events) => {
				const newEvents = [...events, event];
				// Keep only last 100 file events to prevent memory issues
				return newEvents.slice(-100);
			});
		});

		console.log('Calendar stores initialized');
	} catch (error) {
		console.error('Failed to initialize calendar stores:', error);
	}
}

export function cleanupCalendarStores(): void {
	if (unsubscribeEvents) {
		unsubscribeEvents();
		unsubscribeEvents = null;
	}
	if (unsubscribeFiles) {
		unsubscribeFiles();
		unsubscribeFiles = null;
	}
	fileWatcher.stop();
	console.log('Calendar stores cleaned up');
}
