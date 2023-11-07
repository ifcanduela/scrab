<template>
	<div class="mb-2">
		<div
			class="font-bold text-purple-700 tracking-wide"
			v-html="highlightedWord"
		></div>
		<div class="text-sm opacity-50">
			<span
				class="text-xs bg-purple-200 py-1 px-2 rounded-md text-purple-700"
				><strong class="font-bold">{{ score }}</strong> points</span
			>
			{{ word.length }} letters
		</div>
	</div>
</template>

<script setup>
	import countLetters from "@/lib/countLetters"
	import ScoreMaker from "@/lib/ScoreMaker"

	const props = defineProps({
		word: String,
		letters: Array,
	})

	const playerHasY = props.letters.includes("y")
	const wordHasIJ = /ij/.test(props.word)

	const sm = new ScoreMaker()
	const score = sm.getScore(props.word)

	const highlightedWord = computed(() => {
		const letterCount = countLetters(props.letters.join(""))
		if (wordHasIJ && playerHasY) {
			letterCount.i = letterCount.i
				? letterCount.i + letterCount.y
				: letterCount.y
			letterCount.j = letterCount.j
				? letterCount.j + letterCount.y
				: letterCount.y
		}

		const spans = props.word.split("").map((letter) => {
			const count = letterCount[letter]
			if (count) {
				letterCount[letter]--
				return `<span class="text-purple-700">${letter}</span>`
			} else {
				return `<span class="text-emerald-700">${letter}</span>`
			}
		})

		return spans.join("")
	})
</script>
