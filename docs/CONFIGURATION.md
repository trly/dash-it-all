# Configuration Guide

## Overview

Dash It All uses JSON-based configuration to manage calendar collections and application settings. The main configuration file is located at `static/config.json`.

## Main Configuration

### File Location

`static/config.json` - Main application configuration

### Structure

```json
{
	"collections": {
		"collection-name": "/path/to/vdir/collection"
	},
	"refreshInterval": 5000,
	"watchFiles": true
}
```

### Configuration Options

#### collections

**Type:** `Record<string, string>`  
**Required:** Yes

Maps collection names to their filesystem paths. Each collection should be a vdir format directory.

```json
{
	"collections": {
		"personal": "/Users/username/calendars/personal",
		"work": "/Users/username/calendars/work",
		"family": "/Users/username/calendars/family"
	}
}
```

#### refreshInterval

**Type:** `number`  
**Default:** `5000`  
**Unit:** Milliseconds

How often to refresh calendar data when file watching is disabled.

```json
{
	"refreshInterval": 10000
}
```

#### watchFiles

**Type:** `boolean`  
**Default:** `true`

Enable real-time file system watching for automatic updates when calendar files change.

```json
{
	"watchFiles": false
}
```

## Collection Configuration

Each vdir collection can contain metadata files that control its appearance and behavior.

### Collection Directory Structure

```
collection-name/
├── event1.ics          # Calendar event files
├── event2.ics
├── recurring-event.ics
├── color               # Collection color
├── displayname         # Human-readable name
├── description         # Collection description
└── order               # Sort order
```

### Metadata Files

#### color

**File:** `color`  
**Format:** Hex color code

Specifies the display color for this collection.

```
#FF5733
```

#### displayname

**File:** `displayname`  
**Format:** Plain text

Human-readable name for the collection, used in the UI instead of the directory name.

```
Personal Calendar
```

#### description

**File:** `description`  
**Format:** Plain text

Optional description of the collection.

```
Personal events and appointments
```

#### order

**File:** `order`  
**Format:** Integer

Numeric sort order for displaying collections. Lower numbers appear first.

```
1
```

## Example Configurations

### Basic Setup

```json
{
	"collections": {
		"personal": "/home/user/calendars/personal",
		"work": "/home/user/calendars/work"
	},
	"refreshInterval": 5000,
	"watchFiles": true
}
```

### Multi-User Setup

```json
{
	"collections": {
		"alice-personal": "/home/alice/calendars/personal",
		"alice-work": "/home/alice/calendars/work",
		"bob-personal": "/home/bob/calendars/personal",
		"shared-family": "/shared/calendars/family"
	},
	"refreshInterval": 3000,
	"watchFiles": true
}
```

### Pimsync Integration

When using [pimsync](https://pimsync.whynothugo.nl/), collections are typically located in:

```json
{
	"collections": {
		"personal": "/home/user/.local/share/vdirsyncer/calendars/personal",
		"work": "/home/user/.local/share/vdirsyncer/calendars/work"
	},
	"refreshInterval": 5000,
	"watchFiles": true
}
```

### Development Setup

For development and testing:

```json
{
	"collections": {
		"test-personal": "./test-calendars/personal",
		"test-work": "./test-calendars/work"
	},
	"refreshInterval": 1000,
	"watchFiles": true
}
```

## Collection Setup Guide

### Step 1: Create Collection Directory

```bash
mkdir -p /path/to/your/calendar/collection
```

### Step 2: Add Metadata Files

```bash
# Set display color
echo "#3B82F6" > /path/to/your/calendar/collection/color

# Set display name
echo "My Calendar" > /path/to/your/calendar/collection/displayname

# Set description (optional)
echo "Personal events and appointments" > /path/to/your/calendar/collection/description

# Set sort order (optional)
echo "1" > /path/to/your/calendar/collection/order
```

### Step 3: Add Calendar Events

Create `.ics` files for individual events:

```bash
cat > /path/to/your/calendar/collection/meeting.ics << EOF
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//Your Product//EN
BEGIN:VEVENT
UID:meeting-20240115-001
DTSTART:20240115T140000Z
DTEND:20240115T150000Z
SUMMARY:Team Meeting
DESCRIPTION:Weekly team standup meeting
LOCATION:Conference Room A
END:VEVENT
END:VCALENDAR
EOF
```

### Step 4: Update Configuration

Add the collection to your `static/config.json`:

```json
{
	"collections": {
		"my-calendar": "/path/to/your/calendar/collection"
	}
}
```

## Troubleshooting

### Collection Not Appearing

1. **Check Path**: Ensure the collection path exists and is accessible
2. **Check Permissions**: Verify read permissions on the directory and files
3. **Check Format**: Ensure the path is absolute, not relative
4. **Restart App**: Restart the development server after configuration changes

### Events Not Loading

1. **Check .ics Format**: Validate .ics file syntax
2. **Check File Extensions**: Ensure event files have `.ics` extension
3. **Check File Watching**: Verify `watchFiles` is enabled or restart the app
4. **Check Console**: Look for parsing errors in browser developer tools

### Invalid Configuration

1. **Validate JSON**: Check for syntax errors in `config.json`
2. **Check Required Fields**: Ensure `collections` field is present
3. **Check Types**: Verify `refreshInterval` is a number, `watchFiles` is boolean

### Performance Issues

1. **Reduce Refresh Interval**: Increase `refreshInterval` value
2. **Limit Collections**: Remove unused collections from configuration
3. **Check File Count**: Large numbers of .ics files may impact performance
4. **Enable File Watching**: Use `watchFiles: true` instead of polling

## Environment Variables

For deployment scenarios, you can override configuration through environment variables:

```bash
# Override collections path
CALENDAR_COLLECTIONS_PATH=/production/calendars

# Override refresh interval
CALENDAR_REFRESH_INTERVAL=10000

# Disable file watching
CALENDAR_WATCH_FILES=false
```

Note: Environment variable support requires custom implementation in the configuration loader.

## Security Considerations

1. **File Permissions**: Ensure calendar directories are only readable by the application user
2. **Path Validation**: Avoid exposing sensitive system paths
3. **Access Control**: Consider implementing access controls for multi-user setups
4. **Network Access**: When deploying, ensure calendar files are not accessible via web server

## Migration

### From Legacy Formats

If migrating from other calendar systems:

1. **Export to iCal**: Export events from existing system to .ics format
2. **Split Events**: Ensure one event per .ics file (vdir requirement)
3. **Organize Collections**: Group related events into collection directories
4. **Set Metadata**: Add color, displayname, and other metadata files
5. **Update Configuration**: Point collections to new vdir directories

### Configuration Changes

When updating configuration:

1. **Backup**: Always backup current `config.json`
2. **Validate**: Test configuration changes in development
3. **Restart**: Restart application after configuration changes
4. **Monitor**: Check logs for configuration errors
