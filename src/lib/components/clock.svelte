<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let currentTime = new Date();

	onMount(() => {
		if (browser) {
			const interval: ReturnType<typeof setInterval> = setInterval(() => {
				currentTime = new Date();
			}, 1000);

			return () => clearInterval(interval);
		}
	});

	function formatTime(date: Date): string {
		return date.toLocaleTimeString('en-US', {
			hour12: true,
			hour: 'numeric',
			minute: '2-digit'
		});
	}
</script>

<div class="clock-container">
	<div class="time">{formatTime(currentTime)}</div>
</div>

<style>
	.clock-container {
		text-align: right;
		padding: 0.5rem 0;
	}

	.time {
		font-size: 2rem;
		font-weight: 300;
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
		color: var(--text-primary, #1a1a1a);
	}
</style>
