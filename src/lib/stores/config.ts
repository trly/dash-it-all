import { writable } from 'svelte/store';
import type { AppConfig } from '../types.js';

// Store for app configuration
export const appConfig = writable<AppConfig | null>(null);

// Load config from server API
export async function loadAppConfig(): Promise<AppConfig | null> {
	try {
		const response = await fetch('/api/config');
		if (response.ok) {
			const config = await response.json();
			appConfig.set(config);
			return config;
		} else {
			console.error('Failed to load app config:', response.statusText);
			return null;
		}
	} catch (error) {
		console.error('Failed to load app config:', error);
		return null;
	}
}
