# Agent Guide - Dash It All

## Commands

- **Dev**: `bun run dev` - Start development server (`vite dev`)
- **Build**: `bun run build` - Build for production (`bun --bun vite build`)
- **Build Binary**: `bun run build:exe` - Build standalone binary executable
- **Type Check**: `bun run check` - Run TypeScript type checking
- **Type Check (Watch)**: `bun run check:watch` - Continuous type checking
- **Preview**: `bun run preview` - Preview production build (`vite preview`)
- **Test**: `bun run test` - Run unit tests with Bun's native test runner
- **Lint**: `bun run lint` - Run prettier, eslint, and svelte-check
- **Lint Fix**: `bun run lint:fix` - Auto-fix linting issues
- **Format**: `bun run format` - Format code with prettier
- **Install**: `bun install` - Install dependencies

## Architecture

- **SvelteKit** app with TypeScript and Vite
- **@eslym/sveltekit-adapter-bun** for Bun runtime adapter
- **bits.ui** for UI components, **lucide-svelte** for icons, **open-color** for CSS variables
- **node-ical** for parsing vdir items, **chokidar** for file watching
- **Leaflet** for map components
- **Vdir-only** calendar collections from `config.json` (root level, not static)
- **Plugin system** with built-in plugins (clock, calendar, agenda) and registry
- **12x8 grid layout** system for dashboard positioning
- **Pimsync integration** - supports vdir format calendar collections
- **Binary compilation** support via Bun's `--compile` flag

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
