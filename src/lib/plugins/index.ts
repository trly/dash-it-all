// Re-export everything from the plugin system
export * from './registry.js';
export * from './built-in/index.js';

// Initialize built-in plugins when this module is imported
import { registerBuiltInPlugins } from './built-in/index.js';

// Auto-register built-in plugins
registerBuiltInPlugins();
