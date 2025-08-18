import { writable } from 'svelte/store';
import type { PluginInstance } from '$lib/types/plugin.js';

// Default plugin layout demonstrating the 12x8 grid system
// Grid coordinates: x,y are 0-based, width/height specify span
// Full grid: x: 0-11 (12 columns), y: 0-7 (8 rows)
const defaultPlugins: PluginInstance[] = [
  {
    id: 'header-clock',
    pluginId: 'clock',
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
    pluginId: 'calendar',
    name: 'Weekly Calendar',
    settings: {
      viewType: 'week',
      daysToShow: 3,
      showWeekends: true
    },
    position: { x: 0, y: 0, width: 8, height: 8 }, // Left side: cols 1-8, rows 2-7
    enabled: true
  },
  {
    id: 'daily-agenda',
    pluginId: 'agenda',
    name: 'Today\'s Agenda',
    settings: {
      showLocation: true,
      showCollection: true
    },
    position: { x: 8, y: 1, width: 4, height: 8 }, // Right side: cols 9-12, rows 2-7
    enabled: true
  },
];

export const dashboardPlugins = writable<PluginInstance[]>(defaultPlugins);

export function addPlugin(plugin: PluginInstance) {
  dashboardPlugins.update(plugins => [...plugins, plugin]);
}

export function removePlugin(pluginId: string) {
  dashboardPlugins.update(plugins => plugins.filter(p => p.id !== pluginId));
}

export function updatePlugin(pluginId: string, updates: Partial<PluginInstance>) {
  dashboardPlugins.update(plugins =>
    plugins.map(p => p.id === pluginId ? { ...p, ...updates } : p)
  );
}
