<template>
	<div class="mb-2">
		<div class="font-bold text-purple-700 tracking-wide">{{ word }}</div>
		<div class="text-sm opacity-50">{{ word.length }} letters</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		word: String,
	})
</script>
