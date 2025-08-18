# Development Guide

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) - Package manager and runtime
- Node.js 18+ (for compatibility)

### Setup

1. Clone the repository
2. Install dependencies: `bun install`
3. Configure calendar collections in `static/config.json`
4. Start development server: `bun run dev`

## Development Workflow

### Available Commands

| Command               | Description                  |
| --------------------- | ---------------------------- |
| `bun run dev`         | Start development server     |
| `bun run build`       | Build for production         |
| `bun run check`       | Run TypeScript type checking |
| `bun run check:watch` | Continuous type checking     |
| `bun run preview`     | Preview production build     |
| `bun run format`      | Format code with Prettier    |
| `bun run lint`        | Check formatting and types   |

### File Structure

```
src/
├── lib/
│   ├── plugins/
│   │   ├── built-in/
│   │   │   ├── clock/           # Clock plugin
│   │   │   ├── calendar/        # Calendar plugin
│   │   │   └── index.ts         # Built-in plugin registration
│   │   ├── types/
│   │   │   └── plugin.ts        # Plugin type definitions
│   │   ├── registry.ts          # Plugin registry system
│   │   └── index.ts             # Plugin system exports
│   ├── stores/                  # Svelte stores
│   ├── types.ts                 # Core type definitions
│   ├── config.ts                # Configuration management
│   ├── vdir-parser.ts           # Calendar parsing logic
│   ├── vdir-metadata.ts         # Metadata handling
│   └── file-watcher.ts          # File system monitoring
├── routes/
│   └── +page.svelte             # Main dashboard page
├── app.html                     # HTML template
└── app.d.ts                     # App type declarations
```

## Plugin Development

### Plugin Architecture

Plugins are self-contained components that can be added to the dashboard. The system uses a registry pattern for plugin management.

### Creating a Plugin

1. **Define Plugin Types** (`src/lib/types/plugin.ts`):

```typescript
export interface PluginConfig {
	id: string;
	name: string;
	category: string;
	description: string;
}

export interface PluginDefinition {
	config: PluginConfig;
	component: ComponentType;
}
```

2. **Create Plugin Component**:

```svelte
<!-- MyPlugin.svelte -->
<script lang="ts">
	// Plugin logic here
</script>

<div class="plugin">
	<!-- Plugin UI here -->
</div>

<style>
	.plugin {
		/* Plugin styling */
	}
</style>
```

3. **Register Plugin**:

```typescript
import { pluginRegistry } from '$lib/plugins/registry.js';
import MyPlugin from './MyPlugin.svelte';

const config: PluginConfig = {
	id: 'my-plugin',
	name: 'My Plugin',
	category: 'utility',
	description: 'Custom plugin description'
};

pluginRegistry.register({
	config,
	component: MyPlugin
});
```

### Built-in Plugins

#### Clock Plugin

- Displays current time and date
- Auto-updates every second
- Located in `src/lib/plugins/built-in/clock/`

#### Calendar Plugin

- Shows upcoming events from vdir collections
- Supports multiple calendar sources
- Located in `src/lib/plugins/built-in/calendar/`

## Calendar System

### Vdir Format

The application works with vdir format calendar collections:

```
calendar-collection/
├── event-1.ics         # Individual event files
├── event-2.ics
├── color               # Collection color (#RRGGBB)
├── displayname         # Human-readable name
├── description         # Optional description
└── order               # Sort order (numeric)
```

### Event Parsing

Events are parsed using the `node-ical` library and transformed into:

```typescript
interface CalendarEvent {
	uid: string;
	summary: string;
	description?: string;
	start: Date;
	end?: Date;
	location?: string;
	organizer?: string;
	attendees?: string[];
	categories?: string[];
	status?: string;
	rrule?: string;
	collection: string;
	filePath: string;
}
```

### File Watching

The file watcher monitors changes to calendar collections and emits events:

```typescript
interface FileWatcherEvent {
	type: 'add' | 'change' | 'unlink';
	filePath: string;
	collection: string;
}
```

## Configuration

### App Configuration

Configuration is loaded from `static/config.json`:

```typescript
interface AppConfig {
	collections: Record<string, string>; // name -> path mapping
	refreshInterval: number; // milliseconds
	watchFiles: boolean; // enable file watching
}
```

### Collection Metadata

Each collection can have metadata files:

```typescript
interface VdirMetadata {
	color?: string; // from 'color' file
	displayname?: string; // from 'displayname' file
	description?: string; // from 'description' file
	order?: number; // from 'order' file
}
```

## Testing

### Test Calendar Setup

Test calendars are provided in `test-calendars/`:

```
test-calendars/
├── personal/
│   ├── color
│   ├── displayname
│   └── *.ics files
└── work/
    ├── color
    ├── displayname
    └── *.ics files
```

### Adding Test Events

Create `.ics` files in test calendar directories:

```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
BEGIN:VEVENT
UID:test-event-1
DTSTART:20240101T100000Z
DTEND:20240101T110000Z
SUMMARY:Test Event
DESCRIPTION:A test calendar event
END:VEVENT
END:VCALENDAR
```

## Code Style

### TypeScript

- Use strict mode with explicit types
- Define interfaces for all data structures
- Use `$lib/` path alias for internal imports
- Export types from dedicated type files

### Svelte

- Use `<script lang="ts">` for TypeScript support
- Follow component naming conventions (PascalCase)
- Use reactive statements for derived values
- Prefer composition over inheritance

### Formatting

- Prettier for code formatting
- Run `bun run format` before committing
- Use `bun run lint` to check formatting and types

## Building and Deployment

### Production Build

```bash
bun run build
```

Builds the application to the `build/` directory as static files.

### Preview

```bash
bun run preview
```

Serves the production build locally for testing.

### Deployment

The application is a static site that can be deployed to any web server. No special server-side requirements.
