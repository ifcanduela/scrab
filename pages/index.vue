<template>
	<div
		v-if="!pending"
		class="layout min-h-screen flex flex-col justify-start items-center p-16"
	>
		<h1 class="font-bold text-center text-8xl mb-8 text-purple-500">
			Scrab
		</h1>

		<div class="flex gap-4 min-w-[40rem]">
			<div class="flex-1">
				<div class="flex flex-col gap-2 mb-4">
					<label class="font-bold opacity-50" for="letterList"
						>Player tiles</label
					>
					<input
						v-model="letterList"
						class="border border-purple-200 text-xl p-2 rounded-md"
						:class="{ 'bg-red-50': tooManyLetters }"
						id="letterList"
					/>
				</div>

				<div class="flex flex-col gap-2 mb-4">
					<label class="font-bold opacity-50" for="startsWithString"
						>Starts with</label
					>
					<input
						class="border border-purple-200 text-xl p-2 rounded-md"
						v-model="startsWithString"
						id="startsWithString"
					/>
				</div>

				<div class="flex flex-col gap-2 mb-4">
					<label class="font-bold opacity-50" for="containsString"
						>Contains</label
					>
					<input
						class="border border-purple-200 text-xl p-2 rounded-md"
						v-model="containsString"
						id="containsString"
					/>
				</div>

				<div class="flex flex-col gap-2 mb-4">
					<label class="font-bold opacity-50" for="endsWithString"
						>Ends with</label
					>
					<input
						class="border border-purple-200 text-xl p-2 rounded-md"
						v-model="endsWithString"
						id="endsWithString"
					/>
				</div>

				<div class="flex flex-col gap-2 mb-4">
					<label class="font-bold opacity-50" for="endsWithString"
						>Word length limit</label
					>
					<div>
						<RadioToggle
							v-model="wordLengthLimit"
							:options="wordLengthLimitOptions"
						/>
					</div>
				</div>
			</div>

			<div class="flex-1 bg-purple-100 p-2" v-if="result.length">
				<div class="text-sm mb-2">
					<span class="font-bold text-purple-500">{{
						result.length.toLocaleString()
					}}</span>
					results
				</div>

				<div>
					<WordResult
						v-for="word in result"
						:key="word"
						:word="word"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import WordMatcher from "@/lib/WordMatcher"
	import { useStorage } from "@vueuse/core"

	useHead({
		title: "Escrábol",
	})

	const wordLengthLimitOptions = [
		{ label: "8", value: 8 },
		{ label: "15", value: 15 },
		{ label: "No limit", value: 0 },
	]

	const startsWithString = useStorage("startsWithString", "")
	const endsWithString = useStorage("endsWithString", "")
	const containsString = useStorage("containsString", "")

	const wordLengthLimit = useStorage("wordLengthLimit", 0)

	const allowWildcard = useStorage("allowWildcard", true)

	const letterList = useStorage("letterList", "aard")

	const tooManyLetters = computed(() => letterList.value.length > 8)

	const result = ref([])

	const { data: wordlist, pending } = useFetch(
		"https://ifcanduela.com/scrab-server/",
	)

	watchEffect(async () => {
		if (pending.value === false) {
			const matcher = new WordMatcher(wordlist.value)

			matcher.letters(letterList.value)
			matcher.letterLimit(wordLengthLimit.value)
			matcher.useWildcard(allowWildcard.value)
			matcher.matchStart(startsWithString.value)
			matcher.matchMiddle(containsString.value)
			matcher.matchEnd(endsWithString.value)

			result.value = matcher.match()
		} else {
			result.value = []
		}
	})
</script>
