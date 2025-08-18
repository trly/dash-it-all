# Agent Guide - Dash It All

## Commands

- **Dev**: `bun run dev` - Start development server
- **Build**: `bun run build` - Build for production
- **Type Check**: `bun run check` - Run TypeScript type checking
- **Type Check (Watch)**: `bun run check:watch` - Continuous type checking
- **Preview**: `bun run preview` - Preview production build
- **Install**: `bun install` - Install dependencies

## Architecture

- **SvelteKit** app with TypeScript and Vite
- **bits.ui** for UI components, **lucide-svelte** for icons
- **node-ical** for parsing vdir items, **chokidar** for file watching
- **Vdir-only** calendar collections from `/static/config.json`
- **Modular dashboard** with pluggable plugins/components
- **Pimsync integration** - supports vdir format calendar collections

## Data Sources

- **Primary**: pimsync (https://pimsync.whynothugo.nl/) - syncs calendars to vdir format
- **Compatible**: Any tool that produces vdir format (one .ics file per event)
- **NOT supported**: Direct iCal imports, custom calendar formats
- **Focus**: Display-only dashboard, no sync/management capabilities

## Vdir Structure

- Each collection is a directory containing:
  - `.ics` files (one event per file)
  - `color` file (hex color like #FF0000)
  - `displayname` file (human-readable name)
  - `description` file (optional description)
  - `order` file (numeric sort order)

## Code Style

- Use **TypeScript** strict mode with explicit types
- **ES modules** with `import/export` syntax
- **Kebab-case** for files, **camelCase** for variables/functions
- **PascalCase** for components and interfaces
- Store components in `src/lib/components/`, utils in `src/lib/`
- Use `$lib/` path alias for internal imports
- Error handling with try/catch and meaningful error messages
