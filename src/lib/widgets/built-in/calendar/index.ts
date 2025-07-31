import type { WidgetDefinition } from '$lib/types/widget.js';
import CalendarWidget from './CalendarWidget.svelte';

export const calendarWidgetDefinition: WidgetDefinition = {
	config: {
		id: 'calendar',
		name: 'Calendar',
		description: 'Display upcoming calendar events from your iCal files',
		version: '1.0.0',
		author: 'Dash It All',
		category: 'calendar',
		settings: {
			calendarSource: {
				type: 'select',
				label: 'Calendar Source',
				description: 'Select which calendar to display',
				default: 'all',
				required: true,
				options: [
					{ value: 'all', label: 'All Calendars' }
					// TODO: Dynamically populate from config
				]
			},
			maxEvents: {
				type: 'number',
				label: 'Max Events',
				description: 'Maximum number of events to display',
				default: 10,
				min: 1,
				max: 50
			},
			showPastEvents: {
				type: 'boolean',
				label: 'Show Past Events',
				description: 'Include events that have already passed',
				default: false
			}
		}
	},
	component: CalendarWidget as any
};
