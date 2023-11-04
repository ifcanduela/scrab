<template>
	<div>
		<div
			v-if="loading"
			class="fixed inset-0 flex flex-col gap-4 items-center justify-center"
		>
			<LoadingIcon />
			<div class="text-purple-400 uppercase text-center">
				<div>Just a moment</div>
				<div>Fetching word list...</div>
			</div>
		</div>

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
