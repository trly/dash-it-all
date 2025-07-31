import type { AppConfig } from './types.js';

let config: AppConfig | null = null;

export async function loadConfig(): Promise<AppConfig> {
	if (config) return config;

	try {
		const response = await fetch('/config.json');
		config = await response.json();
		return config!;
	} catch (error) {
		console.error('Failed to load config:', error);
		throw new Error('Configuration file not found or invalid');
	}
}

export function getConfig(): AppConfig | null {
	return config;
}
