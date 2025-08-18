# User Plugins

This directory is for user-created custom plugins. Each plugin should be in its own subdirectory.

## Creating a Custom Plugin

To create a custom plugin:

1. Create a new directory with your plugin name (e.g., `my-plugin`)
2. Create an `index.ts` file that exports a `PluginDefinition`
3. Create a Svelte component file for your plugin
4. Register your plugin in your main application

### Example Structure

```
src/lib/plugins/user/
├── my-plugin/
│   ├── index.ts
│   ├── MyPlugin.svelte
│   └── README.md (optional)
```

### Example Plugin Definition

```typescript
// src/lib/plugins/user/my-plugin/index.ts
import type { PluginDefinition } from '$lib/types/plugin.js';
import MyPlugin from './MyPlugin.svelte';

export const myPluginDefinition: PluginDefinition = {
	config: {
		id: 'my-plugin',
		name: 'My Custom Plugin',
		description: 'A description of what my plugin does',
		version: '1.0.0',
		author: 'Your Name',
		category: 'custom',
		settings: {
			// Define your plugin's configurable settings here
			backgroundColor: {
				type: 'string',
				label: 'Background Color',
				description: 'Set the plugin background color',
				default: '#ffffff'
			}
		}
	},
	component: MyPlugin
};
```

### Example Plugin Component

```svelte
<!-- src/lib/plugins/user/my-plugin/MyPlugin.svelte -->
<script lang="ts">
	import type { PluginProps } from '$lib/types/plugin.js';

	interface Props extends PluginProps {}

	let { instance, settings }: Props = $props();
</script>

<div class="my-plugin" style="background-color: {settings.backgroundColor}">
	<h3>{instance.name}</h3>
	<!-- Your plugin content here -->
</div>

<style>
	.my-plugin {
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		height: 100%;
	}
</style>
```

### Registering Your Plugin

In your application startup code:

```typescript
import { pluginRegistry } from '$lib/plugins/registry.js';
import { myPluginDefinition } from '$lib/plugins/user/my-plugin/index.js';

// Register your custom plugin
pluginRegistry.register(myPluginDefinition);
```

## Plugin API Reference

See the TypeScript definitions in `$lib/types/plugin.ts` for the complete API reference.

### Key Interfaces

- `PluginDefinition`: The main plugin definition including config and component
- `PluginConfig`: Metadata and settings schema for your plugin
- `PluginProps`: Props passed to your plugin component
- `PluginInstance`: Runtime instance data for a plugin on the dashboard
