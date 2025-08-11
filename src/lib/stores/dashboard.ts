import { writable } from 'svelte/store';
import type { WidgetInstance } from '$lib/types/widget.js';

// Default widget layout demonstrating the 12x8 grid system
// Grid coordinates: x,y are 0-based, width/height specify span
// Full grid: x: 0-11 (12 columns), y: 0-7 (8 rows)
const defaultWidgets: WidgetInstance[] = [
  {
    id: 'header-clock',
    widgetId: 'clock',
    name: 'Header Clock',
    settings: {
      timeFormat: '12h',
      showSeconds: false,
      showDate: false
    },
    position: { x: 8, y: 0, width: 2, height: 1 }, // Top-right: cols 9-12, row 1
    enabled: true
  },
  {
    id: 'main-calendar',
    widgetId: 'calendar',
    name: 'Weekly Calendar',
    settings: {
      viewType: 'week',
      daysToShow: 7,
      showWeekends: true
    },
    position: { x: 0, y: 0, width: 8, height: 8 }, // Left side: cols 1-8, rows 2-7
    enabled: true
  },
  {
    id: 'daily-agenda',
    widgetId: 'agenda',
    name: 'Today\'s Agenda',
    settings: {
      showLocation: true,
      showCollection: true
    },
    position: { x: 8, y: 1, width: 4, height: 8 }, // Right side: cols 9-12, rows 2-7
    enabled: true
  },
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
