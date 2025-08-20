import { describe, it, expect } from 'bun:test';
import { agendaPluginDefinition } from './index';

describe('agenda plugin', () => {
	it('should have valid plugin definition', () => {
		expect(agendaPluginDefinition).toBeDefined();
		expect(agendaPluginDefinition.config).toBeDefined();
		expect(agendaPluginDefinition.component).toBeDefined();
	});

	it('should have correct plugin config', () => {
		const { config } = agendaPluginDefinition;

		expect(config.id).toBe('agenda');
		expect(config.name).toBe('Daily Agenda');
		expect(config.description).toBe("Display today's upcoming events");
		expect(config.version).toBe('1.0.0');
		expect(config.author).toBe('Dash It All');
		expect(config.category).toBe('calendar');
	});

	it('should have valid max size constraints', () => {
		const { maxSize } = agendaPluginDefinition.config;

		expect(maxSize).toBeDefined();
		expect(maxSize?.width).toBe(6);
		expect(maxSize?.height).toBe(7);
	});

	it('should have valid settings schema', () => {
		const { settings } = agendaPluginDefinition.config;

		expect(settings).toBeDefined();
		expect(settings?.showLocation).toBeDefined();
		expect(settings?.showCollection).toBeDefined();
	});

	it('should have correct showLocation setting', () => {
		const showLocation = agendaPluginDefinition.config.settings?.showLocation;

		expect(showLocation?.type).toBe('boolean');
		expect(showLocation?.label).toBe('Show Location');
		expect(showLocation?.description).toBe('Display event locations');
		expect(showLocation?.default).toBe(true);
	});

	it('should have correct showCollection setting', () => {
		const showCollection = agendaPluginDefinition.config.settings?.showCollection;

		expect(showCollection?.type).toBe('boolean');
		expect(showCollection?.label).toBe('Show Collection');
		expect(showCollection?.description).toBe('Display which calendar collection the event is from');
		expect(showCollection?.default).toBe(true);
	});
});
