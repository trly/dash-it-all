import { readdir, stat } from 'fs/promises';
import { join, basename } from 'path';
import { existsSync } from 'fs';
import { readVdirMetadata } from './vdir-metadata.js';
import type { VdirCollectionConfig } from './types.js';

/**
 * Check if a directory is a valid vdir collection
 * A vdir collection should contain at least one .ics file or vdir metadata files
 */
export async function isVdirCollection(dirPath: string): Promise<boolean> {
	try {
		if (!existsSync(dirPath)) return false;

		const stats = await stat(dirPath);
		if (!stats.isDirectory()) return false;

		const files = await readdir(dirPath);

		// Check for .ics files or vdir metadata files
		const hasIcsFiles = files.some((file) => file.endsWith('.ics'));
		const hasMetadata = files.some((file) =>
			['color', 'displayname', 'description', 'order'].includes(file)
		);

		return hasIcsFiles || hasMetadata;
	} catch (error) {
		console.warn(`Error checking if ${dirPath} is a vdir collection:`, error);
		return false;
	}
}

/**
 * Scan a root directory for vdir collections
 */
export async function scanVdirRoot(rootPath: string): Promise<VdirCollectionConfig[]> {
	const collections: VdirCollectionConfig[] = [];

	try {
		if (!existsSync(rootPath)) {
			console.warn(`Vdir root directory does not exist: ${rootPath}`);
			return collections;
		}

		const entries = await readdir(rootPath);

		for (const entry of entries) {
			const entryPath = join(rootPath, entry);

			try {
				const stats = await stat(entryPath);
				if (stats.isDirectory() && (await isVdirCollection(entryPath))) {
					// Read metadata to get display name, color, etc.
					const metadata = await readVdirMetadata(entryPath);

					const collection: VdirCollectionConfig = {
						name: metadata.displayname || basename(entryPath),
						path: entryPath,
						color: metadata.color,
						displayname: metadata.displayname,
						description: metadata.description,
						order: metadata.order,
						enabled: true
					};

					collections.push(collection);
				}
			} catch (error) {
				console.warn(`Error processing entry ${entryPath}:`, error);
			}
		}
	} catch (error) {
		console.error(`Error scanning vdir root ${rootPath}:`, error);
	}

	// Sort by order if available, then by name
	collections.sort((a, b) => {
		if (a.order !== undefined && b.order !== undefined) {
			return a.order - b.order;
		}
		if (a.order !== undefined) return -1;
		if (b.order !== undefined) return 1;
		return a.name.localeCompare(b.name);
	});

	return collections;
}

/**
 * Scan all configured vdir root directories for collections
 */
export async function scanAllVdirRoots(vdirRoots: string[]): Promise<VdirCollectionConfig[]> {
	const allCollections: VdirCollectionConfig[] = [];

	for (const rootPath of vdirRoots) {
		const collections = await scanVdirRoot(rootPath);
		allCollections.push(...collections);
	}

	return allCollections;
}
