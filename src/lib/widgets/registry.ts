import type { WidgetDefinition } from '$lib/types/widget.js';

class WidgetRegistry {
	private widgets = new Map<string, WidgetDefinition>();

	register(definition: WidgetDefinition): void {
		this.widgets.set(definition.config.id, definition);
	}

	unregister(id: string): boolean {
		return this.widgets.delete(id);
	}

	get(id: string): WidgetDefinition | undefined {
		return this.widgets.get(id);
	}

	getAll(): WidgetDefinition[] {
		return Array.from(this.widgets.values());
	}

	getByCategory(category: string): WidgetDefinition[] {
		return this.getAll().filter((widget) => widget.config.category === category);
	}

	exists(id: string): boolean {
		return this.widgets.has(id);
	}
}

export const widgetRegistry = new WidgetRegistry();
