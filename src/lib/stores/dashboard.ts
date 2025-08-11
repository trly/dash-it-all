import { writable } from 'svelte/store';
import type { WidgetInstance } from '$lib/types/widget.js';

// Default widget layout
const defaultWidgets: WidgetInstance[] = [
	{
		id: 'header-clock',
		widgetId: 'clock',
		name: 'Clock',
		settings: {
			timeFormat: '12h',
			showSeconds: false,
			showDate: false
		},
		position: { x: 8, y: 0, width: 4, height: 1 },
		enabled: true
	},
	{
		id: 'main-calendar',
		widgetId: 'calendar',
		name: 'Calendar',
		settings: {
			viewType: 'week',
			daysToShow: 3,
			showWeekends: true
		},
		position: { x: 0, y: 1, width: 8, height: 6 },
		enabled: true
	},
	{
		id: 'daily-agenda',
		widgetId: 'agenda',
		name: 'Today\'s Events',
		settings: {
			showLocation: true,
			showCollection: true
		},
		position: { x: 8, y: 1, width: 4, height: 6 },
		enabled: true
	}
];

export const dashboardWidgets = writable<WidgetInstance[]>(defaultWidgets);

export function addWidget(widget: WidgetInstance) {
	dashboardWidgets.update(widgets => [...widgets, widget]);
}

export function removeWidget(widgetId: string) {
	dashboardWidgets.update(widgets => widgets.filter(w => w.id !== widgetId));
}

export function updateWidget(widgetId: string, updates: Partial<WidgetInstance>) {
	dashboardWidgets.update(widgets =>
		widgets.map(w => w.id === widgetId ? { ...w, ...updates } : w)
	);
}
