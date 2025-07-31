// Re-export everything from the widget system
export * from './registry.js';
export * from './built-in/index.js';

// Initialize built-in widgets when this module is imported
import { registerBuiltInWidgets } from './built-in/index.js';

// Auto-register built-in widgets
registerBuiltInWidgets();
