<template>
	<LoadingBlock :loading="pending">
		<MainMenu>
			<NuxtLink
				to="/words"
				class="bg-purple-100 hover:bg-purple-200 text-purple-400 hover:text-purple-600 rounded px-3 py-3 leading-none inline-flex gap-2 items-center"
				><ManageIcon class="w-4" /> Manage wordlist</NuxtLink
			>
		</MainMenu>

		<PageTitle>Scrab</PageTitle>

		<div class="flex gap-4 w-full">
			<div class="flex-1">
				<FormGroup label="Player tiles" id="letterList">
					<input
						type="text"
						class="border border-purple-200 text-xl p-2 rounded-md"
						:class="{ 'bg-red-50': tooManyLetters }"
						v-model="letterList"
						id="letterList"
					/>
				</FormGroup>

				<FormGroup label="Wildcards">
					<div class="flex gap-2">
						<WildcardBox v-model="wildcards.a" />
						<WildcardBox v-model="wildcards.b" />
					</div>
				</FormGroup>

				<div class="flex gap-2">
					<FormGroup label="Starts with" id="startsWithString">
						<input
							type="text"
							class="border border-purple-200 text-xl p-2 rounded-md w-24"
							v-model="startsWithString"
							id="startsWithString"
						/>
					</FormGroup>

					<FormGroup label="Contains" id="containsString">
						<input
							type="text"
							class="border border-purple-200 text-xl p-2 rounded-md w-24"
							v-model="containsString"
							id="containsString"
						/>
					</FormGroup>

					<FormGroup label="Ends with" id="endsWithString">
						<input
							type="text"
							class="border border-purple-200 text-xl p-2 rounded-md w-24"
							v-model="endsWithString"
							id="endsWithString"
						/>
					</FormGroup>
				</div>

				<FormGroup label="Anchoring" id="anchoring">
					<div class="flex gap-2">
						<input
							type="text"
							class="border border-purple-200 text-xl p-2 rounded-md w-24"
							v-model="anchorLetter"
							placeholder="A"
						/>
						<input
							type="number"
							class="border border-purple-200 text-xl p-2 rounded-md w-24"
							v-model.number="anchorPosition"
							placeholder="4"
						/>
						<select
							class="bg-white border border-purple-200 text-xl p-2 rounded-md w-24"
							v-model="anchorDirection"
						>
							<option value="start">start</option>
							<option value="end">end</option>
						</select>
					</div>
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
						:letters="totalLetterList"
					/>
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

	const anchorLetter = useStorage("anchorLetter", "")
	const anchorPosition = useStorage("anchorPosition", 0)
	const anchorDirection = useStorage("anchorDirection", "start")

	const wordLengthLimit = useStorage("wordLengthLimit", 0)

	const wildcards = useStorage("wildcards", {
		a: false,
		b: false,
	})

	const letterList = useStorage("letterList", "aard")

	const tooManyLetters = computed(() => letterList.value.length > 8)

	const totalLetterList = computed(() => {
		return [
			...letterList.value.toLowerCase(),
			...startsWithString.value.toLowerCase(),
			...containsString.value.toLowerCase(),
			...endsWithString.value.toLowerCase(),
		]
	})

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

			if (anchorLetter.value) {
				matcher.anchorLetter(
					anchorLetter.value,
					anchorPosition.value,
					anchorDirection.value,
				)
			}

			result.value = matcher.match()
		} else {
			result.value = []
		}
	})
</script>
