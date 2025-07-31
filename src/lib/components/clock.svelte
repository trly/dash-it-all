<script lang="ts">
	import { onMount } from 'svelte';

	let currentTime = new Date();

	onMount(() => {
		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});

	function formatTime(date: Date): string {
		return date.toLocaleTimeString('en-US', {
			hour12: true,
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function formatDate(date: Date): string {
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
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
