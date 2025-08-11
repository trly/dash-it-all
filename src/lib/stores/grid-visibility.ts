import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { dev } from '$app/environment';

// Grid visibility store - defaults to true in dev mode, false in production
const initialValue = dev;

export const showGrid = writable<boolean>(initialValue);

// Persist grid visibility to localStorage (only in browser)
if (browser) {
	const stored = localStorage.getItem('dashboard-grid-visibility');
	if (stored !== null) {
		showGrid.set(JSON.parse(stored));
	}

	showGrid.subscribe((value) => {
		localStorage.setItem('dashboard-grid-visibility', JSON.stringify(value));
	});
}
