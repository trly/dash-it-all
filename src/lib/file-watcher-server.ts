import chokidar from 'chokidar';
import { readdir } from 'fs/promises';
import { join, basename } from 'path';
import { VdirParser } from './vdir-parser.js';
import { loadServerConfig } from './config-server.js';
import { readVdirMetadata, isVdirItem, isVdirMetadata } from './vdir-metadata.js';
import type {
	CalendarEvent,
	VdirCollectionConfig,
	FileWatcherEvent,
	VdirMetadata
} from './types.js';

export class ServerFileWatcher {
	private watchers: ReturnType<typeof chokidar.watch>[] = [];
	private events: Map<string, CalendarEvent> = new Map();
	private metadata: Map<string, VdirMetadata> = new Map();
	private listeners: Set<(events: CalendarEvent[]) => void> = new Set();
	private fileListeners: Set<(event: FileWatcherEvent) => void> = new Set();

	/**
	 * Initialize the file watcher with vdir collections from config
	 */
	async init(): Promise<void> {
		try {
			const config = await loadServerConfig();
			if (!config || !config.watchFiles) {
				console.log('File watcher disabled in config');
				return;
			}

			// Stop any existing watchers
			this.stop();

			// Convert config format to VdirCollectionConfig array
			const collections: VdirCollectionConfig[] = Object.entries(config.collections).map(
				([name, path]) => ({
					name,
					path,
					enabled: true
				})
			);

			// Load initial events from all vdir collections
			await this.loadInitialEvents(collections);

			// Set up watchers for each vdir collection
			for (const collection of collections) {
				if (collection.enabled !== false) {
					await this.watchCollection(collection);
				}
			}

			console.log(`File watcher initialized for ${this.watchers.length} vdir collections`);
		} catch (error) {
			console.error('Failed to initialize file watcher:', error);
		}
	}

	/**
	 * Load initial events from all vdir collections
	 */
	private async loadInitialEvents(collections: VdirCollectionConfig[]): Promise<void> {
		for (const collection of collections) {
			if (collection.enabled !== false) {
				await this.loadCollectionEvents(collection);
			}
		}
		this.notifyListeners();
	}

	/**
	 * Load events from a specific vdir collection
	 */
	private async loadCollectionEvents(collection: VdirCollectionConfig): Promise<void> {
		try {
			const files = await readdir(collection.path);

			// Load vdir metadata
			const metadata = await readVdirMetadata(collection.path);
			this.metadata.set(collection.name, metadata);

			// Process only .ics files (vdir items)
			const icsFiles = files.filter((file) => isVdirItem(file));

			for (const file of icsFiles) {
				const filePath = join(collection.path, file);
				await this.processEventFile(filePath, collection.name, 'add');
			}
		} catch (error) {
			console.error(`Error loading events from collection ${collection.name}:`, error);
		}
	}

	/**
	 * Set up file watcher for a vdir collection
	 */
	private async watchCollection(collection: VdirCollectionConfig): Promise<void> {
		try {
			// Watch the entire directory for vdir structure
			const config = await loadServerConfig();
			const ignorePattern = config.fileWatcher?.ignorePattern ? 
				new RegExp(config.fileWatcher.ignorePattern) : 
				/(^|[\/\\])\../;
			const depth = config.fileWatcher?.depth ?? 0;
			
			const watcher = chokidar.watch(collection.path, {
				ignored: ignorePattern,
				persistent: true,
				ignoreInitial: true, // we already loaded initial events
				depth
			});

			watcher
				.on('add', (filePath) => this.handleFileChange(filePath, collection.name, 'add'))
				.on('change', (filePath) => this.handleFileChange(filePath, collection.name, 'change'))
				.on('unlink', (filePath) => this.handleFileChange(filePath, collection.name, 'unlink'))
				.on('error', (error) =>
					console.error(`Watcher error for collection ${collection.name}:`, error)
				);

			this.watchers.push(watcher);
			console.log(`Watching vdir collection: ${collection.name} at ${collection.path}`);
		} catch (error) {
			console.error(`Failed to watch collection ${collection.name}:`, error);
		}
	}

	/**
	 * Handle file change (determines if it's a vdir item or metadata)
	 */
	private async handleFileChange(
		filePath: string,
		collectionName: string,
		type: 'add' | 'change' | 'unlink'
	): Promise<void> {
		const fileName = basename(filePath);

		// Notify file listeners
		this.fileListeners.forEach((listener) =>
			listener({ type, filePath, collection: collectionName })
		);

		if (isVdirItem(fileName)) {
			// Handle vdir event file
			await this.processEventFile(filePath, collectionName, type);
		} else if (isVdirMetadata(fileName)) {
			// Handle vdir metadata file
			await this.processMetadataFile(filePath, collectionName, type);
		}
		// Ignore other files (like .tmp files)
	}

	/**
	 * Process a vdir event file change (add, change, or unlink)
	 */
	private async processEventFile(
		filePath: string,
		collectionName: string,
		type: 'add' | 'change' | 'unlink'
	): Promise<void> {
		const fileName = basename(filePath);
		const eventKey = `${collectionName}:${fileName}`;

		if (type === 'unlink') {
			// Remove the event from our map
			this.events.delete(eventKey);
		} else {
			// Parse and add/update the event
			if (VdirParser.isValidVdirItem(filePath)) {
				try {
					const events = await VdirParser.parseFile(filePath, collectionName);
					if (events.length > 0) {
						// For vdir, assume one event per file (as per specification)
						this.events.set(eventKey, events[0]);
					}
				} catch (error) {
					console.error(`Error processing vdir event file ${filePath}:`, error);
				}
			}
		}

		// Notify event listeners
		this.notifyListeners();
	}

	/**
	 * Process a vdir metadata file change
	 */
	private async processMetadataFile(
		filePath: string,
		collectionName: string,
		type: 'add' | 'change' | 'unlink'
	): Promise<void> {
		// Reload metadata for this vdir collection
		const collectionPath = filePath.substring(0, filePath.lastIndexOf('/'));
		try {
			const metadata = await readVdirMetadata(collectionPath);
			this.metadata.set(collectionName, metadata);
			console.log(`Updated metadata for vdir collection ${collectionName}:`, metadata);
		} catch (error) {
			console.error(`Error processing vdir metadata file ${filePath}:`, error);
		}
	}

	/**
	 * Get all current events
	 */
	getEvents(): CalendarEvent[] {
		return Array.from(this.events.values());
	}

	/**
	 * Get metadata for a specific vdir collection
	 */
	getCollectionMetadata(collectionName: string): VdirMetadata | undefined {
		return this.metadata.get(collectionName);
	}

	/**
	 * Get all vdir collection metadata
	 */
	getAllCollectionMetadata(): Map<string, VdirMetadata> {
		return new Map(this.metadata);
	}

	/**
	 * Subscribe to event changes
	 */
	onEventsChanged(listener: (events: CalendarEvent[]) => void): () => void {
		this.listeners.add(listener);
		// Immediately call with current events
		listener(this.getEvents());

		// Return unsubscribe function
		return () => this.listeners.delete(listener);
	}

	/**
	 * Subscribe to file change events
	 */
	onFileChanged(listener: (event: FileWatcherEvent) => void): () => void {
		this.fileListeners.add(listener);
		return () => this.fileListeners.delete(listener);
	}

	/**
	 * Notify all listeners of event changes
	 */
	private notifyListeners(): void {
		const events = this.getEvents();
		this.listeners.forEach((listener) => listener(events));
	}

	/**
	 * Stop all file watchers
	 */
	stop(): void {
		this.watchers.forEach((watcher) => watcher.close());
		this.watchers = [];
		this.events.clear();
		this.metadata.clear();
		console.log('File watchers stopped');
	}

	/**
	 * Restart the file watcher (useful for config changes)
	 */
	async restart(): Promise<void> {
		this.stop();
		await this.init();
	}
}

// Export a singleton instance
export const serverFileWatcher = new ServerFileWatcher();
