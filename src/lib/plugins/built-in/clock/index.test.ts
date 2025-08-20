import { describe, it, expect } from 'bun:test';
import { clockPluginDefinition } from './index';

describe('clock plugin', () => {
	it('should have valid plugin definition', () => {
		expect(clockPluginDefinition).toBeDefined();
		expect(clockPluginDefinition.config).toBeDefined();
		expect(clockPluginDefinition.component).toBeDefined();
	});

	it('should have correct plugin config', () => {
		const { config } = clockPluginDefinition;

		expect(config.id).toBe('clock');
		expect(config.name).toBe('Clock');
		expect(config.description).toBe('Display current time and date');
		expect(config.version).toBe('1.0.0');
		expect(config.author).toBe('Dash It All');
		expect(config.category).toBe('time');
	});

	it('should have valid max size constraints', () => {
		const { maxSize } = clockPluginDefinition.config;

		expect(maxSize).toBeDefined();
		expect(maxSize?.width).toBe(4);
		expect(maxSize?.height).toBe(1);
	});

	it('should have valid settings schema', () => {
		const { settings } = clockPluginDefinition.config;

		expect(settings).toBeDefined();
		expect(settings?.timeFormat).toBeDefined();
		expect(settings?.showSeconds).toBeDefined();
		expect(settings?.showDate).toBeDefined();
	});

	it('should have correct timeFormat setting', () => {
		const timeFormat = clockPluginDefinition.config.settings?.timeFormat;

		expect(timeFormat?.type).toBe('select');
		expect(timeFormat?.label).toBe('Time Format');
		expect(timeFormat?.default).toBe('12h');
		expect(timeFormat?.required).toBe(true);
		expect(timeFormat?.options).toHaveLength(2);
		expect(timeFormat?.options?.[0]).toEqual({ value: '12h', label: '12 Hour (AM/PM)' });
		expect(timeFormat?.options?.[1]).toEqual({ value: '24h', label: '24 Hour' });
	});

	it('should have correct showSeconds setting', () => {
		const showSeconds = clockPluginDefinition.config.settings?.showSeconds;

		expect(showSeconds?.type).toBe('boolean');
		expect(showSeconds?.label).toBe('Show Seconds');
		expect(showSeconds?.default).toBe(true);
	});

	it('should have correct showDate setting', () => {
		const showDate = clockPluginDefinition.config.settings?.showDate;

		expect(showDate?.type).toBe('boolean');
		expect(showDate?.label).toBe('Show Date');
		expect(showDate?.default).toBe(true);
	});
});
