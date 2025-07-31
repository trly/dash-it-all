# User Widgets

This directory is for user-created custom widgets. Each widget should be in its own subdirectory.

## Creating a Custom Widget

To create a custom widget:

1. Create a new directory with your widget name (e.g., `my-widget`)
2. Create an `index.ts` file that exports a `WidgetDefinition`
3. Create a Svelte component file for your widget
4. Register your widget in your main application

### Example Structure

```
src/lib/widgets/user/
├── my-widget/
│   ├── index.ts
│   ├── MyWidget.svelte
│   └── README.md (optional)
```

### Example Widget Definition

```typescript
// src/lib/widgets/user/my-widget/index.ts
import type { WidgetDefinition } from '$lib/types/widget.js';
import MyWidget from './MyWidget.svelte';

export const myWidgetDefinition: WidgetDefinition = {
	config: {
		id: 'my-widget',
		name: 'My Custom Widget',
		description: 'A description of what my widget does',
		version: '1.0.0',
		author: 'Your Name',
		category: 'custom',
		settings: {
			// Define your widget's configurable settings here
			backgroundColor: {
				type: 'string',
				label: 'Background Color',
				description: 'Set the widget background color',
				default: '#ffffff'
			}
		}
	},
	component: MyWidget
};
```

### Example Widget Component

```svelte
<!-- src/lib/widgets/user/my-widget/MyWidget.svelte -->
<script lang="ts">
	import type { WidgetProps } from '$lib/types/widget.js';

	interface Props extends WidgetProps {}

	let { instance, settings }: Props = $props();
</script>

<div class="my-widget" style="background-color: {settings.backgroundColor}">
	<h3>{instance.name}</h3>
	<!-- Your widget content here -->
</div>

<style>
	.my-widget {
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		height: 100%;
	}
</style>
```

### Registering Your Widget

In your application startup code:

```typescript
import { widgetRegistry } from '$lib/widgets/registry.js';
import { myWidgetDefinition } from '$lib/widgets/user/my-widget/index.js';

// Register your custom widget
widgetRegistry.register(myWidgetDefinition);
```

## Widget API Reference

See the TypeScript definitions in `$lib/types/widget.ts` for the complete API reference.

### Key Interfaces

- `WidgetDefinition`: The main widget definition including config and component
- `WidgetConfig`: Metadata and settings schema for your widget
- `WidgetProps`: Props passed to your widget component
- `WidgetInstance`: Runtime instance data for a widget on the dashboard
