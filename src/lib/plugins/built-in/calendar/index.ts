import type { PluginDefinition } from '$lib/types/plugin.js';
import type { ComponentType, SvelteComponent } from 'svelte';
import CalendarPlugin from './CalendarPlugin.svelte';

export const calendarPluginDefinition: PluginDefinition = {
	config: {
		id: 'calendar',
		name: 'Calendar',
		description: 'Display upcoming calendar events from your iCal files',
		version: '1.0.0',
		author: 'Dash It All',
		category: 'calendar',
		settings: {
			viewType: {
				type: 'select',
				label: 'View Type',
				description: 'Calendar view layout',
				default: 'week',
				required: true,
				options: [
					{ value: 'week', label: 'Week View' },
					{ value: 'month', label: 'Month View' }
				]
			},
			daysToShow: {
				type: 'number',
				label: 'Days to Show',
				description: 'Number of days to display (for week view)',
				default: 3,
				min: 1,
				max: 7
			},
			showWeekends: {
				type: 'boolean',
				label: 'Show Weekends',
				description: 'Include weekends in the calendar view',
				default: true
			}
		}
	},
	component: CalendarPlugin as unknown as ComponentType<SvelteComponent>
};
