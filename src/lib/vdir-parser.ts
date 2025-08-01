import ical from 'node-ical';
import { readFileSync } from 'fs';
import type { CalendarEvent } from './types.js';

export class VdirParser {
	/**
	 * Parse a single .ics file from a vdir collection and return calendar events
	 */
	static async parseFile(filePath: string, collectionName: string): Promise<CalendarEvent[]> {
		try {
			const fileContent = readFileSync(filePath, 'utf8');
			const parsed = ical.parseICS(fileContent);
			const events: CalendarEvent[] = [];

			for (const [, component] of Object.entries(parsed)) {
				if (component.type === 'VEVENT') {
					const event = this.transformEvent(component, collectionName, filePath);
					if (event) {
						events.push(event);
					}
				}
			}

			return events;
		} catch (error) {
			console.error(`Error parsing vdir item ${filePath}:`, error);
			return [];
		}
	}

	/**
	 * Transform a node-ical event to our CalendarEvent interface
	 */
	private static transformEvent(
		component: any,
		collectionName: string,
		filePath: string
	): CalendarEvent | null {
		try {
			// Ensure we have required fields
			if (!component.uid || !component.summary || !component.start) {
				return null;
			}

			const event: CalendarEvent = {
				uid: component.uid,
				summary: component.summary,
				description: component.description || undefined,
				start: new Date(component.start),
				end: component.end ? new Date(component.end) : undefined,
				location: component.location || undefined,
				organizer: component.organizer?.val || component.organizer || undefined,
				attendees: component.attendee
					? Array.isArray(component.attendee)
						? component.attendee.map((a: any) => a.val || a)
						: [component.attendee.val || component.attendee]
					: undefined,
				categories: component.categories
					? Array.isArray(component.categories)
						? component.categories
						: [component.categories]
					: undefined,
				status: component.status || undefined,
				rrule: component.rrule ? component.rrule.toString() : undefined,
				collection: collectionName,
				filePath
			};

			return event;
		} catch (error) {
			console.error(`Error transforming event from ${filePath}:`, error);
			return null;
		}
	}

	/**
	 * Validate if a file appears to be a valid vdir item (.ics file)
	 */
	static isValidVdirItem(filePath: string): boolean {
		try {
			const fileContent = readFileSync(filePath, 'utf8');
			return fileContent.includes('BEGIN:VCALENDAR') && fileContent.includes('END:VCALENDAR');
		} catch {
			return false;
		}
	}
}
