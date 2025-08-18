import type { ComponentType, SvelteComponent } from 'svelte';

export interface PluginConfig {
	id: string;
	name: string;
	description?: string;
	version?: string;
	author?: string;
	category?: string;
	maxSize?: {
		width?: number;
		height?: number;
	};
	settings?: Record<string, PluginSettingDefinition>;
}

export interface PluginSettingDefinition {
	type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect';
	label: string;
	description?: string;
	default?: unknown;
	required?: boolean;
	options?: { value: string; label: string }[]; // For select/multiselect
	min?: number; // For number type
	max?: number; // For number type
}

export interface PluginInstance {
	id: string;
	pluginId: string;
	name: string;
	settings: Record<string, unknown>;
	position: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	enabled: boolean;
}

export interface PluginDefinition {
	config: PluginConfig;
	component: ComponentType<SvelteComponent>;
}

export interface PluginProps {
	instance: PluginInstance;
	settings: Record<string, unknown>;
}
