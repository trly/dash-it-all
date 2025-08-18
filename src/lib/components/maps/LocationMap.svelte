<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Map, LatLng } from 'leaflet';

	interface Props {
		location: string;
		height?: string;
		width?: string;
	}

	let { location, height = '200px', width = '100%' }: Props = $props();

	let mapContainer = $state<HTMLDivElement>();
	let map: Map | null = null;
	let loading = $state(true);
	let error = $state<string | null>(null);

	async function geocodeLocation(locationQuery: string): Promise<LatLng | null> {
		try {
			// Use Nominatim (OpenStreetMap's geocoding service)
			const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&limit=1`;
			console.log('Geocoding URL:', url);
			
			const response = await fetch(url, {
				headers: {
					'User-Agent': 'DashItAll-Calendar/1.0'
				}
			});
			
			if (!response.ok) {
				console.error('Geocoding response not ok:', response.status, response.statusText);
				throw new Error(`Geocoding request failed: ${response.status}`);
			}

			const data = await response.json();
			console.log('Geocoding response:', data);
			
			if (data.length === 0) {
				console.warn('No results found for location:', locationQuery);
				return null;
			}

			const result = data[0];
			console.log('Using result:', result);
			
			// Dynamically import Leaflet to avoid SSR issues
			const L = await import('leaflet');
			return L.latLng(parseFloat(result.lat), parseFloat(result.lon));
		} catch (err) {
			console.error('Geocoding error:', err);
			return null;
		}
	}

	async function initializeMap() {
		try {
			loading = true;
			error = null;

			if (!mapContainer) {
				console.error('Map container not available');
				error = 'Map container not ready';
				loading = false;
				return;
			}

			console.log('Geocoding location:', location);
			
			// Geocode the location first
			const coordinates = await geocodeLocation(location);
			
			if (!coordinates) {
				error = 'Location not found';
				loading = false;
				return;
			}

			console.log('Found coordinates:', coordinates);

			// Dynamically import Leaflet to avoid SSR issues
			const L = await import('leaflet');

			// Fix Leaflet's default icon path issue
			delete (L.Icon.Default.prototype as any)._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
				iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
				shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
			});

			console.log('Initializing map...');

			// Initialize the map
			map = L.map(mapContainer, {
				zoomControl: true,
				scrollWheelZoom: false,
				dragging: true,
				doubleClickZoom: true
			}).setView([coordinates.lat, coordinates.lng], 15);

			// Add OpenStreetMap tiles
			const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			});

			tileLayer.on('load', () => {
				console.log('Tiles loaded successfully');
			});

			tileLayer.on('tileerror', (e) => {
				console.error('Tile loading error:', e);
			});

			tileLayer.addTo(map);

			// Add a marker for the location
			const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(map);
			marker.bindPopup(location).openPopup();

			// Force map resize after a short delay
			setTimeout(() => {
				if (map) {
					map.invalidateSize();
				}
			}, 100);

			loading = false;
			console.log('Map initialized successfully');
		} catch (err) {
			console.error('Map initialization error:', err);
			error = `Failed to load map: ${err instanceof Error ? err.message : 'Unknown error'}`;
			loading = false;
		}
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			// Add Leaflet CSS
			if (!document.querySelector('link[href*="leaflet"]')) {
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
				link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
				link.crossOrigin = '';
				document.head.appendChild(link);
			}
			
			// Wait a bit for the container to be ready and CSS to load
			setTimeout(() => {
				initializeMap();
			}, 100);
		}
	});

	onDestroy(() => {
		if (map) {
			map.remove();
			map = null;
		}
	});
</script>

<div 
	class="map-container"
	style="height: {height}; width: {width}"
>
	<!-- Always render the map container -->
	<div bind:this={mapContainer} class="leaflet-map"></div>
	
	<!-- Show loading overlay -->
	{#if loading}
		<div class="map-overlay map-loading">
			<div class="loading-spinner"></div>
			<span>Loading map...</span>
		</div>
	{/if}
	
	<!-- Show error overlay -->
	{#if error}
		<div class="map-overlay map-error">
			<span>📍 {error}</span>
			<small>Location: {location}</small>
		</div>
	{/if}
</div>

<style>
	.map-container {
		border-radius: var(--radius-small);
		overflow: hidden;
		border: 1px solid var(--border-light);
		background-color: var(--bg-tertiary);
		position: relative;
	}

	.leaflet-map {
		height: 100%;
		width: 100%;
	}

	.map-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		color: var(--text-secondary);
		font-size: 0.875rem;
		background-color: var(--bg-tertiary);
		z-index: 1000;
	}

	.map-error {
		text-align: center;
	}

	.map-error small {
		color: var(--text-tertiary);
		font-size: 0.75rem;
	}

	.loading-spinner {
		width: 1.5rem;
		height: 1.5rem;
		border: 2px solid var(--border-light);
		border-top: 2px solid var(--color-primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	/* Override Leaflet's default styles to match our theme */
	:global(.leaflet-container) {
		font-family: inherit;
		font-size: 0.875rem;
	}

	:global(.leaflet-popup-content-wrapper) {
		background-color: var(--bg-primary);
		color: var(--text-primary);
		border-radius: var(--radius-small);
		box-shadow: var(--shadow-medium);
	}

	:global(.leaflet-popup-tip) {
		background-color: var(--bg-primary);
	}

	:global(.leaflet-control-zoom a) {
		background-color: var(--bg-primary);
		color: var(--text-primary);
		border-color: var(--border-color);
	}

	:global(.leaflet-control-zoom a:hover) {
		background-color: var(--bg-hover);
	}

	:global(.leaflet-control-attribution) {
		background-color: var(--bg-primary);
		color: var(--text-tertiary);
		font-size: 0.75rem;
	}

	:global(.leaflet-control-attribution a) {
		color: var(--color-primary);
	}
</style>
