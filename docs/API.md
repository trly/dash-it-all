# API Reference

## Core Types

### CalendarEvent

Represents a calendar event parsed from an .ics file.

```typescript
interface CalendarEvent {
	uid: string; // Unique event identifier
	summary: string; // Event title/summary
	description?: string; // Event description
	start: Date; // Start date/time
	end?: Date; // End date/time (optional for all-day events)
	location?: string; // Event location
	organizer?: string; // Event organizer
	attendees?: string[]; // List of attendee email addresses
	categories?: string[]; // Event categories/tags
	status?: string; // Event status (CONFIRMED, TENTATIVE, etc.)
	rrule?: string; // Recurrence rule (RFC 5545 format)
	collection: string; // Collection name this event belongs to
	filePath: string; // Absolute path to the .ics file
}
```

### VdirCollectionConfig

Configuration for a vdir calendar collection.

```typescript
interface VdirCollectionConfig {
	name: string; // Collection identifier
	path: string; // Absolute path to collection directory
	color?: string; // Display color (hex format)
	displayname?: string; // Human-readable name
	description?: string; // Collection description
	order?: number; // Sort order for display
	enabled?: boolean; // Whether collection is active
}
```

### AppConfig

Main application configuration structure.

```typescript
interface AppConfig {
	collections: Record<string, string>; // name -> path mapping
	refreshInterval: number; // Refresh interval in milliseconds
	watchFiles: boolean; // Enable file system watching
}
```

### VdirMetadata

Metadata parsed from vdir collection files.

```typescript
interface VdirMetadata {
	color?: string; // From 'color' file
	displayname?: string; // From 'displayname' file
	description?: string; // From 'description' file
	order?: number; // From 'order' file
}
```

### FileWatcherEvent

Event emitted by the file watcher system.

```typescript
interface FileWatcherEvent {
	type: 'add' | 'change' | 'unlink'; // File operation type
	filePath: string; // Absolute path to changed file
	collection: string; // Collection name
}
```

## Plugin System

### PluginConfig

Configuration for a dashboard plugin.

```typescript
interface PluginConfig {
	id: string; // Unique plugin identifier
	name: string; // Display name
	category: string; // Plugin category for grouping
	description: string; // Plugin description
}
```

### PluginDefinition

Complete plugin definition including component.

```typescript
interface PluginDefinition {
	config: PluginConfig; // Plugin configuration
	component: ComponentType; // Svelte component
}
```

### PluginRegistry

Central registry for managing plugins.

```typescript
class PluginRegistry {
	register(definition: PluginDefinition): void;
	unregister(id: string): boolean;
	get(id: string): PluginDefinition | undefined;
	getAll(): PluginDefinition[];
	getByCategory(category: string): PluginDefinition[];
	exists(id: string): boolean;
}
```

## Core Modules

### Configuration Loader

**File:** `src/lib/config.ts`

```typescript
// Load application configuration
function loadConfig(): Promise<AppConfig>;

// Load collection metadata
function loadCollectionMetadata(collectionPath: string): Promise<VdirMetadata>;
```

### Vdir Parser

**File:** `src/lib/vdir-parser.ts`

```typescript
// Parse all events from a vdir collection
function parseVdirCollection(
	collectionPath: string,
	collectionName: string
): Promise<CalendarEvent[]>;

// Parse a single .ics file
function parseIcsFile(filePath: string, collectionName: string): Promise<CalendarEvent | null>;
```

### File Watcher

**File:** `src/lib/file-watcher.ts`

```typescript
// Initialize file watching for collections
function initializeFileWatcher(collections: Record<string, string>): void;

// Start watching for file changes
function startWatching(): void;

// Stop watching
function stopWatching(): void;

// Event emitter for file changes
const fileWatcherEvents: EventEmitter<FileWatcherEvent>;
```

### Plugin Registry

**File:** `src/lib/plugins/registry.ts`

```typescript
// Global plugin registry instance
export const pluginRegistry: PluginRegistry;

// Register a new plugin
pluginRegistry.register(definition: PluginDefinition): void;

// Get all registered plugins
pluginRegistry.getAll(): PluginDefinition[];

// Get plugins by category
pluginRegistry.getByCategory(category: string): PluginDefinition[];
```

## Built-in Plugins

### Clock Plugin

**ID:** `clock`  
**Category:** `time`  
**File:** `src/lib/plugins/built-in/clock/ClockPlugin.svelte`

Displays current time and date with automatic updates.

**Props:** None

**Features:**

- Real-time clock updates
- Date display
- Configurable time format

### Calendar Plugin

**ID:** `calendar`  
**Category:** `calendar`  
**File:** `src/lib/plugins/built-in/calendar/CalendarPlugin.svelte`

Shows upcoming events from configured calendar collections.

**Props:**

```typescript
interface CalendarPluginProps {
	collections?: string[]; // Specific collections to display
	maxEvents?: number; // Maximum events to show
	timeRange?: string; // Time range filter ('day', 'week', 'month')
}
```

**Features:**

- Multi-collection support
- Event filtering and sorting
- Responsive layout
- Real-time updates via file watching

## Error Handling

All async operations return Promises and should be handled with try/catch blocks:

```typescript
try {
	const events = await parseVdirCollection(path, name);
	// Handle events
} catch (error) {
	console.error('Failed to parse collection:', error);
	// Handle error appropriately
}
```

Common error scenarios:

- Invalid .ics file format
- Missing collection directories
- File permission issues
- Invalid configuration format

## Event Emitters

### File Watcher Events

```typescript
import { fileWatcherEvents } from '$lib/file-watcher.js';

fileWatcherEvents.on('change', (event: FileWatcherEvent) => {
	console.log(`File ${event.type}: ${event.filePath}`);
});
```

### Plugin Events

Plugins can emit custom events through the Svelte component event system:

```svelte
<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('plugin-action', { action: 'clicked' });
	}
</script>
```

## Stores

Svelte stores are used for reactive state management:

```typescript
// Calendar events store
export const calendarEvents: Writable<CalendarEvent[]>;

// Collection configuration store
export const collections: Writable<VdirCollectionConfig[]>;

// Application configuration store
export const appConfig: Writable<AppConfig>;
```

## Utils

### Date Formatting

```typescript
// Format date for display
function formatDate(date: Date, format: 'short' | 'long'): string;

// Check if date is today
function isToday(date: Date): boolean;

// Get date range
function getDateRange(start: Date, end: Date): Date[];
```

### File System

```typescript
// Check if path exists
function pathExists(path: string): Promise<boolean>;

// Read file content
function readFile(path: string): Promise<string>;

// List directory contents
function listDirectory(path: string): Promise<string[]>;
```
