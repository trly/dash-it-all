import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import type { AppConfig } from './types.js';

let config: AppConfig | null = null;

const DEFAULT_CONFIG: AppConfig = {
	collections: {},
	refreshInterval: 5000,
	watchFiles: true,
	server: {
		port: 5173,
		host: 'localhost'
	},
	fileWatcher: {
		ignorePattern: '/(^|[\\/\\\\])\\..+/',
		depth: 0
	},
	api: {
		baseUrl: '',
		timeout: 30000
	},
	theme: {
		gridColumns: '2fr 1fr',
		colors: {
			textPrimary: '#1a1a1a',
			textSecondary: '#666',
			bgPrimary: '#ffffff',
			colorPrimary: '#4285f4'
		}
	}
};

export async function loadServerConfig(): Promise<AppConfig> {
	if (config) return config;

	const configPath = process.env.CONFIG_PATH || join(process.cwd(), 'config.json');
	const fallbackPath = join(process.cwd(), 'static', 'config.json');

	try {
		let configText: string;

		if (existsSync(configPath)) {
			configText = await readFile(configPath, 'utf-8');
		} else if (existsSync(fallbackPath)) {
			console.warn(`Using fallback config at ${fallbackPath}. Consider moving to ${configPath}`);
			configText = await readFile(fallbackPath, 'utf-8');
		} else {
			console.warn('No config file found, using default configuration');
			config = DEFAULT_CONFIG;
			return config;
		}

		const fileConfig = JSON.parse(configText);
		config = mergeWithDefaults(fileConfig, DEFAULT_CONFIG);
		return config;
	} catch (error) {
		console.error('Failed to load server config:', error);
		console.warn('Using default configuration due to config error');
		config = DEFAULT_CONFIG;
		return config;
	}
}

function mergeWithDefaults(fileConfig: Partial<AppConfig>, defaults: AppConfig): AppConfig {
	return {
		...defaults,
		...fileConfig,
		server: { ...defaults.server, ...fileConfig.server },
		fileWatcher: { ...defaults.fileWatcher, ...fileConfig.fileWatcher },
		api: { ...defaults.api, ...fileConfig.api },
		theme: {
			...defaults.theme,
			...fileConfig.theme,
			colors: { ...defaults.theme?.colors, ...fileConfig.theme?.colors }
		}
	};
}

export function getServerConfig(): AppConfig | null {
	return config;
}
