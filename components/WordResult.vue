<template>
	<div class="mb-2">
		<div
			class="font-bold text-purple-700 tracking-wide"
			v-html="highlightedWord"
		></div>
		<div class="text-sm opacity-50">{{ word.length }} letters</div>
	</div>
</template>

<script setup>
	import countLetters from "@/lib/countLetters"

	const props = defineProps({
		word: String,
		letters: Array,
	})

	const highlightedWord = computed(() => {
		const letterCount = countLetters(props.letters.join(""))
		const spans = props.word.split("").map((letter) => {
			const count = letterCount[letter]
			if (count) {
				letterCount[letter]--
				return `<span class="text-purple-700">${letter}</span>`
			} else {
				return `<span class="text-emerald-700">${letter}</span>`
			}
		})
		console.log(letterCount)

		return spans.join("")
	})
</script>
