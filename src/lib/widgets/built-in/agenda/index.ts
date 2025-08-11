import type { WidgetDefinition } from '$lib/types/widget.js';
import type { ComponentType, SvelteComponent } from 'svelte';
import AgendaWidget from './AgendaWidget.svelte';

export const agendaWidgetDefinition: WidgetDefinition = {
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
  component: AgendaWidget as unknown as ComponentType<SvelteComponent>
};
