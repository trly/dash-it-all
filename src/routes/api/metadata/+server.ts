import { json } from '@sveltejs/kit';
import { serverFileWatcher } from '$lib/file-watcher-server.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async () => {
	try {
		await serverFileWatcher.init();
		const metadata = serverFileWatcher.getAllCollectionMetadata();
		// Convert Map to object for JSON serialization
		const metadataObj = Object.fromEntries(metadata);
		return json(metadataObj);
	} catch (error) {
		console.error('Failed to get calendar metadata:', error);
		return json({ error: 'Failed to load calendar metadata' }, { status: 500 });
	}
};
