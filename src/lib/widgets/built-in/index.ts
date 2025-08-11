import { widgetRegistry } from '../registry.js';
import { calendarWidgetDefinition } from './calendar/index.js';
import { clockWidgetDefinition } from './clock/index.js';
import { agendaWidgetDefinition } from './agenda/index.js';

// Auto-register built-in widgets
export function registerBuiltInWidgets(): void {
	widgetRegistry.register(calendarWidgetDefinition);
	widgetRegistry.register(clockWidgetDefinition);
	widgetRegistry.register(agendaWidgetDefinition);
}

// Export for direct access if needed
export { calendarWidgetDefinition, clockWidgetDefinition, agendaWidgetDefinition };
