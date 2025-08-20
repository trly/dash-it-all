<script lang="ts">
	import type { CalendarEvent } from '$lib/types';
	import { Popover } from 'bits-ui';
	import { X } from 'lucide-svelte';
	import { calendarMetadata } from '$lib/stores/calendar-client';
	import { formatTimeRange, isAllDayEvent } from './event-utils.js';
	import LocationMap from '$lib/components/maps/LocationMap.svelte';

	interface Props {
		event: CalendarEvent;
		children: import('svelte').Snippet;
	}

	let { event, children }: Props = $props();

	function getCollectionColor(collectionName: string): string {
		const metadata = $calendarMetadata.get(collectionName);
		return metadata?.color || '#4285f4';
	}

	function getCollectionDisplayName(collectionName: string): string {
		const metadata = $calendarMetadata.get(collectionName);
		return metadata?.displayname || collectionName;
	}

	function formatEventDateTime(event: CalendarEvent): string {
		if (isAllDayEvent(event)) {
			return event.start.toLocaleDateString();
		}
		const startDate = event.start.toLocaleDateString();
		const timeRange = formatTimeRange(event);
		return `${startDate} ${timeRange}`;
	}

	function encodeLocationForMap(location: string): string {
		return encodeURIComponent(location);
	}

	function getMapUrl(location: string): string {
		return `https://www.openstreetmap.org/search?query=${encodeLocationForMap(location)}`;
	}

	let open = $state(false);
</script>

<Popover.Root bind:open>
	<Popover.Trigger class="popover-trigger">
		{@render children()}
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content class="event-details-popover" side="bottom" sideOffset={8}>
			<div class="space-y-4">
				<!-- Header with close button -->
				<div class="popover-header">
					<div class="popover-title-section">
						<h3 class="popover-title">
							{event.summary || 'Untitled Event'}
						</h3>
						<div class="popover-collection">
							<div
								class="collection-indicator"
								style="background-color: {getCollectionColor(event.collection)}"
							></div>
							<span class="collection-name">
								{getCollectionDisplayName(event.collection)}
							</span>
						</div>
					</div>
					<Popover.Close class="popover-close" aria-label="Close">
						<X class="close-icon" />
					</Popover.Close>
				</div>

				<!-- Date/Time -->
				<div class="popover-section">
					<h4 class="section-title">Date & Time</h4>
					<p class="section-content">
						{formatEventDateTime(event)}
					</p>
				</div>

				<!-- Location with embedded map -->
				{#if event.location}
					<div class="popover-section">
						<h4 class="section-title">Location</h4>
						<div class="location-content">
							<p class="section-content">
								📍 {event.location}
							</p>
							<div class="map-embed">
								<LocationMap location={event.location} height="160px" />
							</div>
							<a
								href={getMapUrl(event.location)}
								target="_blank"
								rel="noopener noreferrer"
								class="map-link"
							>
								View on OpenStreetMap
								<svg class="external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									></path>
								</svg>
							</a>
						</div>
					</div>
				{/if}

				<!-- Description -->
				{#if event.description}
					<div class="popover-section">
						<h4 class="section-title">Description</h4>
						<p class="section-content description">
							{event.description}
						</p>
					</div>
				{/if}

				<!-- Organizer -->
				{#if event.organizer}
					<div class="popover-section">
						<h4 class="section-title">Organizer</h4>
						<p class="section-content">
							{event.organizer}
						</p>
					</div>
				{/if}

				<!-- Attendees -->
				{#if event.attendees && event.attendees.length > 0}
					<div class="popover-section">
						<h4 class="section-title">Attendees</h4>
						<div class="attendees-list">
							{#each event.attendees as attendee (attendee)}
								<p class="section-content">
									{attendee}
								</p>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Categories -->
				{#if event.categories && event.categories.length > 0}
					<div class="popover-section">
						<h4 class="section-title">Categories</h4>
						<div class="categories-list">
							{#each event.categories as category (category)}
								<span class="category-tag">
									{category}
								</span>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Status -->
				{#if event.status}
					<div class="popover-section">
						<h4 class="section-title">Status</h4>
						<p class="section-content">
							{event.status}
						</p>
					</div>
				{/if}
			</div>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>

<style>
	:global(.popover-trigger) {
		width: 100% !important;
		background: transparent !important;
		border: none !important;
		padding: 0 !important;
		margin: 0 !important;
		cursor: pointer !important;
	}

	:global(.popover-trigger:hover) {
		background: transparent !important;
	}

	:global(.event-details-popover) {
		z-index: 50;
		width: 100%;
		max-width: 28rem;
		background-color: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-medium);
		padding: 1.5rem;
		box-shadow: var(--shadow-medium);
	}

	.space-y-4 > * + * {
		margin-top: 1rem;
	}

	.popover-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.popover-title-section {
		flex: 1;
	}

	.popover-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 0.25rem 0;
	}

	.popover-collection {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.collection-indicator {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
	}

	.collection-name {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	:global(.popover-close) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: none;
		background: transparent;
		border-radius: var(--radius-small);
		color: var(--text-secondary);
		cursor: pointer;
		padding: 0;
		transition: background-color 0.2s ease;
	}

	:global(.popover-close:hover) {
		background-color: var(--bg-hover);
		color: var(--text-primary);
	}

	.close-icon {
		width: 1rem;
		height: 1rem;
	}

	.popover-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.section-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
		margin: 0;
	}

	.section-content {
		font-size: 0.875rem;
		color: var(--text-primary);
		margin: 0;
	}

	.description {
		white-space: pre-wrap;
		line-height: 1.5;
	}

	.location-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.map-embed {
		margin: 0.5rem 0;
	}

	.map-link {
		display: inline-flex;
		align-items: center;
		font-size: 0.875rem;
		color: var(--color-primary);
		text-decoration: none;
		gap: 0.25rem;
		transition: color 0.2s ease;
	}

	.map-link:hover {
		color: var(--color-primary-hover);
	}

	.external-icon {
		width: 0.75rem;
		height: 0.75rem;
	}

	.attendees-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.categories-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.category-tag {
		background-color: var(--bg-tertiary);
		color: var(--text-primary);
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-large);
	}
</style>
