<script lang="ts">
	import type { WidgetProps } from '$lib/types/widget.js';
	import { Clock } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	type Props = WidgetProps;

	let { instance, settings }: Props = $props();

	let currentTime = $state(new Date());
	let intervalId: ReturnType<typeof setInterval>;

	onMount(() => {
		if (browser) {
			intervalId = setInterval(() => {
				currentTime = new Date();
			}, 1000) as ReturnType<typeof setInterval>;

			return () => {
				clearInterval(intervalId);
			};
		}
	});

	const formatTime = (date: Date, format: string) => {
		if (format === '12h') {
			return date.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				second: settings.showSeconds ? '2-digit' : undefined
			});
		} else {
			return date.toLocaleTimeString('en-US', {
				hour12: false,
				hour: '2-digit',
				minute: '2-digit',
				second: settings.showSeconds ? '2-digit' : undefined
			});
		}
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
</script>

<div class="clock-container">
	<div class="time">{formatTime(currentTime, settings.timeFormat as string)}</div>
	{#if settings.showDate}
		<div class="date">{formatDate(currentTime)}</div>
	{/if}
</div>

<style>
	.clock-container {
		text-align: center;
		padding: 0.5rem;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.time {
		font-size: clamp(1.5rem, 8vw, 4rem);
		font-weight: 300;
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
		color: var(--text-primary);
		line-height: 1;
		white-space: nowrap;
	}

	.date {
		font-size: clamp(0.75rem, 3vw, 1.25rem);
		color: var(--text-secondary);
		margin-top: 0.25rem;
		line-height: 1.2;
	}
</style>
