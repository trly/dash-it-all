import { json } from '@sveltejs/kit';
import { loadServerConfig } from '$lib/config-server.js';

export async function GET() {
	try {
		const config = await loadServerConfig();
		return json(config);
	} catch (error) {
		console.error('Failed to load config:', error);
		return json({ error: 'Failed to load config' }, { status: 500 });
	}
}
