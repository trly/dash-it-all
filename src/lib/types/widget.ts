import type { ComponentType, SvelteComponent } from 'svelte';

export interface WidgetConfig {
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
	settings?: Record<string, WidgetSettingDefinition>;
}

export interface WidgetSettingDefinition {
	type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect';
	label: string;
	description?: string;
	default?: unknown;
	required?: boolean;
	options?: { value: string; label: string }[]; // For select/multiselect
	min?: number; // For number type
	max?: number; // For number type
}

export interface WidgetInstance {
	id: string;
	widgetId: string;
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

export interface WidgetDefinition {
	config: WidgetConfig;
	component: ComponentType<SvelteComponent>;
}

export interface WidgetProps {
	instance: WidgetInstance;
	settings: Record<string, unknown>;
}
