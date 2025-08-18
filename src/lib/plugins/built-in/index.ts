import { pluginRegistry } from '../registry.js';
import { calendarPluginDefinition } from './calendar/index.js';
import { clockPluginDefinition } from './clock/index.js';
import { agendaPluginDefinition } from './agenda/index.js';

// Auto-register built-in plugins
export function registerBuiltInPlugins(): void {
	pluginRegistry.register(calendarPluginDefinition);
	pluginRegistry.register(clockPluginDefinition);
	pluginRegistry.register(agendaPluginDefinition);
}

// Export for direct access if needed
export { calendarPluginDefinition, clockPluginDefinition, agendaPluginDefinition };
