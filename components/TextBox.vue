<template>
	<input
		type="text"
		class="border border-purple-200 text-md md:text-xl p-1 md:p-2 rounded-md w-full"
		:value="modelValue"
		@input="handleInput"
	/>
</template>

<script setup>
	const props = defineProps({
		modelValue: [String, Number],
	})

	const emit = defineEmits(["update:modelValue"])

	function handleInput(event) {
		emit("update:modelValue", event.target.value)
	}
</script>
