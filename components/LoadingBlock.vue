<template>
	<div>
		<LoadingIcon v-if="loading" />
		<slot v-else />
	</div>
</template>

<script setup>
	import LoadingIcon from "./LoadingIcon.vue"

	defineProps({
		loading: {
			type: Boolean,
			required: true,
		},
	})
</script>
