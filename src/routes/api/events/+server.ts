import { json } from '@sveltejs/kit';
import { serverFileWatcher } from '$lib/file-watcher-server.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async () => {
	try {
		await serverFileWatcher.init();
		const events = serverFileWatcher.getEvents();
		return json(events);
	} catch (error) {
		console.error('Failed to get calendar events:', error);
		return json({ error: 'Failed to load calendar events' }, { status: 500 });
	}
};
