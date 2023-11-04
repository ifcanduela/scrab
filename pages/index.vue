<template>
	<LoadingBlock :loading="pending">
		<div
			class="layout min-h-screen flex flex-col justify-start items-center p-16"
		>
			<MainMenu>
				<NuxtLink
					to="/words"
					class="bg-purple-100 hover:bg-purple-200 text-purple-400 hover:text-purple-600 rounded px-3 py-3 leading-none inline-flex gap-2 items-center"
					><ManageIcon class="w-4" /> Manage wordlist</NuxtLink
				>
			</MainMenu>
			<h1 class="font-bold text-center text-8xl mb-8 text-purple-500">
				Scrab
			</h1>

			<div class="flex gap-4 min-w-[40rem]">
				<div class="flex-1">
					<FormGroup label="Player tiles" id="letterList">
						<input
							v-model="letterList"
							class="border border-purple-200 text-xl p-2 rounded-md"
							:class="{ 'bg-red-50': tooManyLetters }"
							id="letterList"
						/>
					</FormGroup>

					<FormGroup label="Wildcards">
						<div class="flex gap-2">
							<WildcardBox v-model="wildcards.a" />
							<WildcardBox v-model="wildcards.b" />
						</div>
					</FormGroup>

					<FormGroup label="Starts with" id="startsWithString">
						<input
							class="border border-purple-200 text-xl p-2 rounded-md"
							v-model="startsWithString"
							id="startsWithString"
						/>
					</FormGroup>

					<FormGroup label="Contains" id="containsString">
						<input
							class="border border-purple-200 text-xl p-2 rounded-md"
							v-model="containsString"
							id="containsString"
						/>
					</FormGroup>

					<FormGroup label="Ends with" id="endsWithString">
						<input
							class="border border-purple-200 text-xl p-2 rounded-md"
							v-model="endsWithString"
							id="endsWithString"
						/>
					</FormGroup>

					<FormGroup label="Word length limit" id="wordLengthLimit">
						<div>
							<RadioToggle
								v-model="wordLengthLimit"
								:options="wordLengthLimitOptions"
							/>
						</div>
					</FormGroup>
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
	</LoadingBlock>
</template>

<script setup lang="ts">
	import ManageIcon from "@phosphor-icons/core/assets/bold/gear-six-bold.svg?component"
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

	const wildcards = useStorage("wildcards", {
		a: false,
		b: false,
	})

	const letterList = useStorage("letterList", "aard")

	const tooManyLetters = computed(() => letterList.value.length > 8)

	const result = ref([])

	const { data: wordlist, pending } = useFetch(
		"https://ifcanduela.com/scrab-server/",
	)

	const wildcardCount = computed(() => {
		let count = 0

		if (wildcards.value.a) {
			count++
		}

		if (wildcards.value.b) {
			count++
		}

		return count
	})

	watchEffect(async () => {
		if (pending.value === false) {
			const matcher = new WordMatcher(wordlist.value)

			matcher.letters(letterList.value)
			matcher.letterLimit(wordLengthLimit.value)
			matcher.useWildcard(wildcardCount.value)
			matcher.matchStart(startsWithString.value)
			matcher.matchMiddle(containsString.value)
			matcher.matchEnd(endsWithString.value)

			console.log({ matcher })

			result.value = matcher.match()
		} else {
			result.value = []
		}
	})
</script>
