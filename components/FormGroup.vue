<template>
	<div
		class="flex flex-col gap-2 mb-4 text-sm md:text-base whitespace-nowrap"
	>
		<label v-if="label" class="font-bold opacity-50" :for="theId">{{
			label
		}}</label>
		<slot />
	</div>
</template>

<script setup>
	const props = defineProps({
		id: {
			type: String,
			default: "",
		},
		label: {
			type: String,
			require: false,
		},
	})

	const theId = props.id || "id-" + Math.random().toString(36).substr(2, 9)
</script>
