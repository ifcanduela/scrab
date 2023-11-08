<template>
	<LoadingBlock :loading="pending">
		<MainMenu>
			<NuxtLink
				to="/words"
				class="bg-purple-100 hover:bg-purple-200 text-purple-400 hover:text-purple-600 rounded px-3 py-3 leading-none inline-flex gap-2 items-center"
				><ManageIcon class="w-4" /> Manage wordlist</NuxtLink
			>
			<button
				class="inline-flex gap-2 bg-white hover:bg-purple-100 border border-purple-400 text-purple-400 px-4 py-2 rounded"
				@click="handleResetClick"
			>
				<ResetIcon class="w-4" />
				Reset search
			</button>
		</MainMenu>

		<PageTitle>Scrab</PageTitle>

		<div class="flex gap-4 w-full">
			<div class="flex-1">
				<FormGroup label="Player tiles" id="letterList">
					<TextBox
						v-model="letterList"
						id="letterList"
						:class="{ 'bg-red-50': tooManyLetters }"
					/>
				</FormGroup>

				<FormGroup label="Wildcards">
					<div class="flex gap-2">
						<WildcardBox v-model="wildcards.a" />
						<WildcardBox v-model="wildcards.b" />
					</div>
				</FormGroup>

				<div class="flex gap-2">
					<FormGroup
						class="grow-1"
						label="Starts with"
						id="startsWithString"
					>
						<TextBox
							v-model="startsWithString"
							id="startsWithString"
						/>
					</FormGroup>

					<FormGroup
						class="grow-1"
						label="Contains"
						id="containsString"
					>
						<TextBox v-model="containsString" id="containsString" />
					</FormGroup>

					<FormGroup
						class="grow-1"
						label="Ends with"
						id="endsWithString"
					>
						<TextBox v-model="endsWithString" id="endsWithString" />
					</FormGroup>
				</div>

				<FormGroup label="Anchoring" id="anchoring">
					<div
						class="grid gap-2"
						style="grid-template-columns: repeat(3, 1fr)"
					>
						<TextBox
							v-model="anchorLetter"
							id="anchoring"
							placeholder="A"
						/>
						<TextBox
							type="number"
							v-model.number="anchorPosition"
							placeholder="4"
						/>
						<select
							class="bg-white border border-purple-200 text-md md:text-xl p-1 md:p-2 rounded-md"
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
				<div class="flex justify-between mb-2">
					<div class="text-sm">
						<span class="font-bold text-purple-500">{{
							resultCount.toLocaleString()
						}}</span>
						results
					</div>
					<div class="flex gap-1">
						<button
							class="text-xs text-purple-100 bg-purple-400 px-1 rounded"
							:class="{ 'bg-purple-700': sort === 'length' }"
							@click="sort = 'length'"
						>
							by length
						</button>
						<button
							class="text-xs text-purple-100 bg-purple-400 px-1 rounded"
							:class="{ 'bg-purple-700': sort === 'score' }"
							@click="sort = 'score'"
						>
							by score
						</button>
					</div>
				</div>

				<div class="flex flex-col gap-2">
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
	import { useStorage } from "@vueuse/core"

	import ManageIcon from "@phosphor-icons/core/assets/bold/gear-six-bold.svg?component"
	import ResetIcon from "@phosphor-icons/core/assets/bold/trash-bold.svg?component"
	import ScoreMaker from "@/lib/ScoreMaker"
	import WordMatcher from "@/lib/WordMatcher"

	useHead({
		title: "Escrábol",
	})

	const sort = useStorage("sort", "length")

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
	const resultCount = ref(0)

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

	watchEffect(() => {
		if (pending.value === false) {
			const matcher = new WordMatcher(wordlist.value)

			matcher.letters(letterList.value)
			matcher.letterLimit(wordLengthLimit.value)
			matcher.useWildcards(wildcardCount.value)
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

			const results = matcher.match()
			resultCount.value = results.length

			if (sort.value === "score") {
				const sm = new ScoreMaker()
				results.sort((a, b) => sm.getScore(b) - sm.getScore(a))
			}

			result.value = results.slice(0, 25)
		} else {
			result.value = []
		}
	})

	function handleResetClick() {
		letterList.value = ""
		wildcards.value.a = false
		wildcards.value.b = false
		startsWithString.value = ""
		endsWithString.value = ""
		containsString.value = ""
		anchorLetter.value = ""
		anchorPosition.value = 0
		anchorDirection.value = "start"
		wordLengthLimit.value = 15
	}
</script>
