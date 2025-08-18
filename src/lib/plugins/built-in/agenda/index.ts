import type { PluginDefinition } from '$lib/types/plugin.js';
import type { ComponentType, SvelteComponent } from 'svelte';
import AgendaPlugin from './AgendaPlugin.svelte';

export const agendaPluginDefinition: PluginDefinition = {
  config: {
    id: 'agenda',
    name: 'Daily Agenda',
    description: 'Display today\'s upcoming events',
    version: '1.0.0',
    author: 'Dash It All',
    category: 'calendar',
    maxSize: {
      width: 6,
      height: 7
    },
    settings: {
      showLocation: {
        type: 'boolean',
        label: 'Show Location',
        description: 'Display event locations',
        default: true
      },
      showCollection: {
        type: 'boolean',
        label: 'Show Collection',
        description: 'Display which calendar collection the event is from',
        default: true
      }
    }
  },
  component: AgendaPlugin as unknown as ComponentType<SvelteComponent>
};
