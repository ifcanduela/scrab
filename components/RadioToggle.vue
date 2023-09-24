<!--
## PROPS

- items: An array of objects with `key` and `label`
-->
<template>
	<div class="inline-flex bg-purple-100 rounded-full overflow-hidden">
		<div
			class="radio-toggle__button"
			v-for="option in options"
			:class="{
				'radio-toggle__button--active': modelValue === option.value,
			}"
			:key="option.value"
		>
			<input
				class="absolute scale-0 w-0 h-0"
				type="radio"
				:value="option.value"
				:id="`${id}--${option.value}`"
				:name="id"
				:checked="option.value === modelValue"
				@input="update(option.value)"
			/>
			<label
				class="px-4 py-2 cursor-pointer flex hover:bg-purple-300"
				:class="{
					'bg-purple-400': option.value === modelValue,
				}"
				:for="`${id}--${option.value}`"
			>
				{{ option.label }}
			</label>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		modelValue: { type: [String, Number], default: "" },
		options: { type: Array, default: () => [] },
	})

	const emit = defineEmits(["update:modelValue"])

	const id = computed(
		() => `radio-toggle--${Math.ceil(Math.random() * 999999999999999)}`,
	)

	function update(value) {
		emit("update:modelValue", value)
	}
</script>
