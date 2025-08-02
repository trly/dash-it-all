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

<div class="clock-widget">
	<div class="widget-header">
		<Clock size={20} />
		<h3>{instance.name}</h3>
	</div>

	<div class="time-display">
		<div class="time">{formatTime(currentTime, settings.timeFormat as string)}</div>
		{#if settings.showDate}
			<div class="date">{formatDate(currentTime)}</div>
		{/if}
	</div>
</div>

<style>
	.clock-widget {
		padding: 1rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.widget-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.widget-header h3 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.time-display {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.time {
		font-size: 2.5rem;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.date {
		font-size: 1rem;
		color: #6b7280;
	}
</style>
