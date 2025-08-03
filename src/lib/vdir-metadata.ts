import { readFile } from 'fs/promises';
import { join } from 'path';
import type { VdirMetadata } from './types.js';

/**
 * Read vdir metadata files from a collection directory
 */
export async function readVdirMetadata(collectionPath: string): Promise<VdirMetadata> {
	const metadata: VdirMetadata = {};

	try {
		// Read color file (hex RGB value like #FF0000)
		try {
			const colorContent = await readFile(join(collectionPath, 'color'), 'utf8');
			const color = colorContent.trim();
			if (color.match(/^#[0-9A-Fa-f]{8}$/)) {
				metadata.color = color;
			}
		} catch {
			// File doesn't exist or can't be read, skip
		}

		// Read displayname file (UTF-8 encoded label)
		try {
			const displaynameContent = await readFile(join(collectionPath, 'displayname'), 'utf8');
			metadata.displayname = displaynameContent.trim();
		} catch {
			// File doesn't exist or can't be read, skip
		}

		// Read description file (UTF-8 encoded description)
		try {
			const descriptionContent = await readFile(join(collectionPath, 'description'), 'utf8');
			metadata.description = descriptionContent.trim();
		} catch {
			// File doesn't exist or can't be read, skip
		}

		// Read order file (numeric order for UI)
		try {
			const orderContent = await readFile(join(collectionPath, 'order'), 'utf8');
			const order = parseInt(orderContent.trim(), 10);
			if (!isNaN(order)) {
				metadata.order = order;
			}
		} catch {
			// File doesn't exist or can't be read, skip
		}
	} catch (error) {
		console.error(`Error reading vdir metadata from ${collectionPath}:`, error);
	}

	return metadata;
}

/**
 * Check if a file should be treated as a vdir item (calendar event/contact)
 */
export function isVdirItem(filename: string): boolean {
	// Ignore temporary files and metadata files
	if (filename.endsWith('.tmp') || !filename.includes('.')) {
		return false;
	}

	// Only process .ics files for calendar events
	// (we could also support .vcf for contacts in the future)
	return filename.endsWith('.ics');
}

/**
 * Check if a file is a vdir metadata file
 */
export function isVdirMetadata(filename: string): boolean {
	const metadataFiles = ['color', 'displayname', 'description', 'order'];
	return metadataFiles.includes(filename);
}
