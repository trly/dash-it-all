import type { PluginDefinition } from '$lib/types/plugin.js';
import type { ComponentType, SvelteComponent } from 'svelte';
import ClockWidget from './ClockWidget.svelte';

export const clockPluginDefinition: PluginDefinition = {
	config: {
		id: 'clock',
		name: 'Clock',
		description: 'Display current time and date',
		version: '1.0.0',
		author: 'Dash It All',
		category: 'time',
		maxSize: {
			width: 4,
			height: 1
		},
		settings: {
			timeFormat: {
				type: 'select',
				label: 'Time Format',
				description: 'Choose between 12-hour and 24-hour format',
				default: '12h',
				required: true,
				options: [
					{ value: '12h', label: '12 Hour (AM/PM)' },
					{ value: '24h', label: '24 Hour' }
				]
			},
			showSeconds: {
				type: 'boolean',
				label: 'Show Seconds',
				description: 'Display seconds in the time',
				default: true
			},
			showDate: {
				type: 'boolean',
				label: 'Show Date',
				description: 'Display the current date below the time',
				default: true
			}
		}
	},
	component: ClockWidget as unknown as ComponentType<SvelteComponent>
};
