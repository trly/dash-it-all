# Dash It All

A modular calendar dashboard application built with SvelteKit that displays events from vdir format calendar collections.

## Overview

Dash It All is a display-only dashboard designed to show calendar events from vdir format collections. It integrates seamlessly with [pimsync](https://pimsync.whynothugo.nl/) and other tools that produce vdir format calendars.

## Features

- **Vdir Format Support**: Read calendars from vdir collections (one .ics file per event)
- **Modular Widget System**: Extensible architecture with built-in clock and calendar widgets
- **Real-time File Watching**: Automatically updates when calendar files change
- **Multiple Collections**: Support for multiple calendar collections with custom styling
- **TypeScript**: Full TypeScript support for type safety

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) - Package manager and runtime
- Calendar collections in vdir format (e.g., from pimsync)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dash-it-all

# Install dependencies
bun install

# Configure calendar collections
cp static/config.json.example static/config.json
# Edit static/config.json with your calendar paths

# Start development server
bun run dev
```

### Configuration

Edit `static/config.json` to point to your calendar collections:

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

## Commands

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `bun install`     | Install dependencies         |
| `bun run dev`     | Start development server     |
| `bun run build`   | Build for production         |
| `bun run check`   | Run TypeScript type checking |
| `bun run preview` | Preview production build     |

## Documentation

- [Development Guide](docs/DEVELOPMENT.md) - Detailed development setup and workflow
- [Configuration Guide](docs/CONFIGURATION.md) - Configuration options and setup
- [API Reference](docs/API.md) - Complete API documentation

## Supported Calendar Sources

- **Primary**: [pimsync](https://pimsync.whynothugo.nl/) - syncs calendars to vdir format
- **Compatible**: Any tool producing vdir format (one .ics file per event)
- **NOT supported**: Direct iCal imports or custom calendar formats

## License

See [LICENSE](LICENSE)
