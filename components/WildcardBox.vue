<template>
	<label class="relative">
		<input
			class="scale-0 absolute -z-10"
			type="checkbox"
			:value="modelValue"
			@change="handleChange"
		/>
		<AskeriskIcon
			class="w-12 text-purple-600 border rounded p-1 cursor-pointer hover:bg-purple-100"
			:class="[
				modelValue
					? 'border-purple-600 bg-purple-200'
					: 'border-purple-200',
			]"
		/>
	</label>
</template>

<script setup>
	import AskeriskIcon from "@phosphor-icons/core/assets/bold/asterisk-bold.svg?component"

	const props = defineProps({
		modelValue: {
			type: Boolean,
			default: false,
		},
	})

	const emit = defineEmits(["update:modelValue"])

	function handleChange(event) {
		emit("update:modelValue", event.target.checked)
	}
</script>
