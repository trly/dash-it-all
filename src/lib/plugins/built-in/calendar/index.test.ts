import { describe, it, expect } from 'bun:test';
import { calendarPluginDefinition } from './index';

describe('calendar plugin', () => {
	it('should have valid plugin definition', () => {
		expect(calendarPluginDefinition).toBeDefined();
		expect(calendarPluginDefinition.config).toBeDefined();
		expect(calendarPluginDefinition.component).toBeDefined();
	});

	it('should have correct plugin config', () => {
		const { config } = calendarPluginDefinition;

		expect(config.id).toBe('calendar');
		expect(config.name).toBe('Calendar');
		expect(config.description).toBe('Display upcoming calendar events from your iCal files');
		expect(config.version).toBe('1.0.0');
		expect(config.author).toBe('Dash It All');
		expect(config.category).toBe('calendar');
	});

	it('should not have max size constraints (default flexible sizing)', () => {
		const { maxSize } = calendarPluginDefinition.config;
		expect(maxSize).toBeUndefined();
	});

	it('should have valid settings schema', () => {
		const { settings } = calendarPluginDefinition.config;

		expect(settings).toBeDefined();
		expect(settings?.viewType).toBeDefined();
		expect(settings?.daysToShow).toBeDefined();
		expect(settings?.showWeekends).toBeDefined();
	});

	it('should have correct viewType setting', () => {
		const viewType = calendarPluginDefinition.config.settings?.viewType;

		expect(viewType?.type).toBe('select');
		expect(viewType?.label).toBe('View Type');
		expect(viewType?.default).toBe('week');
		expect(viewType?.required).toBe(true);
		expect(viewType?.options).toHaveLength(2);
		expect(viewType?.options?.[0]).toEqual({ value: 'week', label: 'Week View' });
		expect(viewType?.options?.[1]).toEqual({ value: 'month', label: 'Month View' });
	});

	it('should have correct daysToShow setting', () => {
		const daysToShow = calendarPluginDefinition.config.settings?.daysToShow;

		expect(daysToShow?.type).toBe('number');
		expect(daysToShow?.label).toBe('Days to Show');
		expect(daysToShow?.default).toBe(3);
		expect(daysToShow?.min).toBe(1);
		expect(daysToShow?.max).toBe(7);
	});

	it('should have correct showWeekends setting', () => {
		const showWeekends = calendarPluginDefinition.config.settings?.showWeekends;

		expect(showWeekends?.type).toBe('boolean');
		expect(showWeekends?.label).toBe('Show Weekends');
		expect(showWeekends?.default).toBe(true);
	});
});
