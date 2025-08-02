export interface CalendarEvent {
	uid: string;
	summary: string;
	description?: string;
	start: Date;
	end?: Date;
	location?: string;
	organizer?: string;
	attendees?: string[];
	categories?: string[];
	status?: string;
	rrule?: string;
	collection: string;
	filePath: string;
	id?: string; // Optional unique identifier for React keys
}

export interface VdirCollectionConfig {
	name: string;
	path: string;
	color?: string;
	displayname?: string;
	description?: string;
	order?: number;
	enabled?: boolean;
}

export interface AppConfig {
	vdirRoots: string[]; // Array of root directories containing vdir collections
	refreshInterval: number;
	watchFiles: boolean;
	server?: {
		port?: number;
		host?: string;
	};
	fileWatcher?: {
		ignorePattern?: string;
		depth?: number;
	};
	api?: {
		baseUrl?: string;
		timeout?: number;
	};
	theme?: {
		gridColumns?: string;
		colors?: {
			textPrimary?: string;
			textSecondary?: string;
			bgPrimary?: string;
			colorPrimary?: string;
		};
	};
}

export interface VdirMetadata {
	color?: string;
	displayname?: string;
	description?: string;
	order?: number;
}

export interface FileWatcherEvent {
	type: 'add' | 'change' | 'unlink';
	filePath: string;
	collection: string;
}
