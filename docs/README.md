# Dash It All

A modular calendar dashboard application built with SvelteKit that displays events from vdir format calendar collections.

## Overview

Dash It All is a display-only dashboard designed to show calendar events from vdir format collections. It integrates seamlessly with [pimsync](https://pimsync.whynothugo.nl/) and other tools that produce vdir format calendars.

## Features

- **Vdir Format Support**: Read calendars from vdir collections (one .ics file per event)
- **Modular Plugin System**: Extensible architecture with built-in clock and calendar plugins
- **Real-time File Watching**: Automatically updates when calendar files change
- **Multiple Collections**: Support for multiple calendar collections with custom styling
- **TypeScript**: Full TypeScript support for type safety

## Architecture

### Core Components

- **Plugin Registry**: Manages dashboard plugins with a pluggable architecture
- **Vdir Parser**: Handles parsing of vdir format calendar collections
- **File Watcher**: Monitors filesystem changes for real-time updates
- **Configuration System**: JSON-based configuration for collections and settings

### Built-in Plugins

- **Clock Plugin**: Displays current time and date
- **Calendar Plugin**: Shows upcoming events from configured collections

## Data Format

### Vdir Structure

Each calendar collection is a directory containing:

```
collection-name/
├── event1.ics          # Individual event files
├── event2.ics
├── color               # Hex color (e.g., #FF0000)
├── displayname         # Human-readable name
├── description         # Optional description
└── order               # Numeric sort order
```

### Supported Tools

- **Primary**: [pimsync](https://pimsync.whynothugo.nl/) - syncs calendars to vdir format
- **Compatible**: Any tool producing vdir format (one .ics file per event)
- **NOT supported**: Direct iCal imports or custom calendar formats

## Configuration

Configuration is managed through `/static/config.json`:

```json
{
	"collections": {
		"personal": "/path/to/personal/calendar",
		"work": "/path/to/work/calendar"
	},
	"refreshInterval": 5000,
	"watchFiles": true
}
```

## Development

### Commands

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Type checking
bun run check

# Preview production build
bun run preview
```

### Dependencies

- **SvelteKit**: Framework with TypeScript support
- **bits-ui**: UI component library
- **lucide-svelte**: Icon library
- **node-ical**: iCal parsing
- **chokidar**: File system watching

### Project Structure

```
src/
├── lib/
│   ├── plugins/           # Plugin system
│   │   ├── built-in/      # Built-in plugins
│   │   └── registry.ts    # Plugin registry
│   ├── types/             # TypeScript definitions
│   ├── config.ts          # Configuration loader
│   ├── vdir-parser.ts     # Calendar parsing
│   └── file-watcher.ts    # File watching
├── routes/
│   └── +page.svelte       # Main dashboard page
└── app.html               # Application shell
```

## Plugin Development

### Creating Custom Plugins

1. Define plugin configuration:

```typescript
const pluginConfig: PluginConfig = {
	id: 'my-plugin',
	name: 'My Plugin',
	category: 'utility',
	description: 'My custom plugin'
};
```

2. Create Svelte component implementing the plugin interface

3. Register with the plugin registry:

```typescript
import { pluginRegistry } from '$lib/plugins/registry.js';

pluginRegistry.register({
	config: pluginConfig,
	component: MyPluginComponent
});
```

## Deployment

The application builds to static files suitable for any web server. No special server requirements beyond serving static content.

## License

See [LICENSE](../LICENSE)
