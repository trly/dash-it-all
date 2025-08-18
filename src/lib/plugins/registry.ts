import type { PluginDefinition } from '$lib/types/plugin.js';

class PluginRegistry {
	private plugins = new Map<string, PluginDefinition>();

	register(definition: PluginDefinition): void {
		this.plugins.set(definition.config.id, definition);
	}

	unregister(id: string): boolean {
		return this.plugins.delete(id);
	}

	get(id: string): PluginDefinition | undefined {
		return this.plugins.get(id);
	}

	getAll(): PluginDefinition[] {
		return Array.from(this.plugins.values());
	}

	getByCategory(category: string): PluginDefinition[] {
		return this.getAll().filter((plugin) => plugin.config.category === category);
	}

	exists(id: string): boolean {
		return this.plugins.has(id);
	}
}

export const pluginRegistry = new PluginRegistry();
