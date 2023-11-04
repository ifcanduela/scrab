<template>
	<LoadingBlock :loading="pending">
		<div
			class="layout min-h-screen flex flex-col justify-start items-center p-16"
		>
			<MainMenu>
				<NuxtLink
					to="/"
					class="bg-purple-100 hover:bg-purple-200 text-purple-400 hover:text-purple-600 rounded px-3 py-3 leading-none inline-flex gap-2 items-center"
				>
					<HomeIcon class="w-4" />
					Back to app
				</NuxtLink>

				<button
					@click="handleClickAddWords"
					class="bg-purple-100 hover:bg-purple-200 text-purple-400 hover:text-purple-600 rounded px-3 py-3 leading-none inline-flex gap-2 items-center"
				>
					<AddIcon class="w-4" />
					Add words
				</button>
			</MainMenu>

			<h1 class="font-bold text-center text-8xl mb-8 text-purple-500">
				Word List
			</h1>

			<div class="flex gap-4 min-w-[40rem]">
				<div class="flex-1">
					<div class="flex flex-col gap-2 mb-4">
						<label class="font-bold opacity-50" for="letterList"
							>Filter
							<strong class="text-purple-700">{{
								filtered.length
							}}</strong>
							words</label
						>
						<input
							v-model="filter"
							class="border border-purple-200 text-xl p-2 rounded-md"
							id="letterList"
							placeholder="Filter..."
						/>
					</div>
				</div>
			</div>

			<div class="pagination flex gap-4 mb-4 items-center">
				<button
					class="bg-purple-300 hover:bg-purple-200 flex gap-2 items-center text-purple-800 uppercase px-4 py-3 rounded-sm"
					:class="{
						'opacity-50': page === 1,
						'cursor-default': page === 1,
					}"
					@click="prevPage"
				>
					<CaretLeft class="w-4" />
					Prev
				</button>
				<span class="inline-flex gap-1 items-center">
					{{ page }}<small>/ {{ maxPage }}</small>
				</span>
				<button
					class="bg-purple-300 hover:bg-purple-200 flex gap-2 items-center text-purple-800 uppercase px-4 py-3 rounded-sm"
					:class="{
						'opacity-50': page === maxPage,
						'cursor-default': page === maxPage,
					}"
					@click="nextPage"
				>
					Next
					<CaretRight class="w-4" />
				</button>
			</div>

			<div class="flex gap-4 w-[40rem]">
				<div class="wordlist flex gap-2 flex-wrap">
					<div
						class="bg-purple-100 text-purple-800 px-2 py-1 cursor-pointer rounded-sm"
						:class="{
							'outline outline-purple-700': selected.includes(w),
						}"
						v-for="w in wordlist"
						:data-id="w"
						@click="toggleSelected(w)"
					>
						{{ w }}
					</div>
				</div>
			</div>
		</div>

		<div
			v-if="selected.length"
			class="fixed bottom-2 left-2 flex flex-col gap-1 w-[10rem]"
		>
			<button
				class="bg-red-400 text-white font-bold py-2 px-1 rounded-md hover:bg-red-600"
				@click="handleClickDeleteWords"
			>
				Delete selected
			</button>
			<div
				v-for="s in selected"
				class="flex gap-2 items-center leading-none"
			>
				<button
					@click="toggleSelected(s)"
					class="block bg-amber-400 p-2"
				>
					<CrossIcon class="w-2" />
				</button>
				<span class="block text-gray-600">{{ s }}</span>
			</div>
		</div>
	</LoadingBlock>

	<dialog class="bg-white p-10 shadow-2xl" id="dialog-delete-words">
		<h2 class="font-bold mb-2">
			Do you really want to delete {{ selected.length }} word{{
				selected.length === 1 ? "" : "s"
			}}?
		</h2>

		<p class="mb-6">This action cannot be undone.</p>

		<div class="flex gap-4">
			<button
				class="bg-gray-100 py-2 px-4 rounded"
				@click="handleCancelDeleteWords"
			>
				Not really, cancel this
			</button>

			<button
				class="bg-red-600 text-white py-2 px-4 rounded"
				@click="handleConfirmDeleteWords"
			>
				Yes, I want to delete {{ selected.length }} word{{
					selected.length === 1 ? "" : "s"
				}}
			</button>
		</div>
	</dialog>

	<dialog
		class="bg-white p-10 shadow-2xl min-w-[32rem]"
		id="dialog-add-words"
	>
		<h2 class="font-bold mb-2">Add new words</h2>

		<div class="bg-purple-100 p-3 mb-2">
			<div>Write one word per line</div>
		</div>

		<div class="mb-2">
			<textarea
				v-model="newWords"
				class="border border-purple-200 rounded p-2 w-full min-h-32"
			></textarea>
		</div>

		<div class="flex gap-4 justify-between">
			<button
				class="bg-gray-100 py-2 px-4 rounded"
				@click="handleCancelAddWords"
			>
				Cancel
			</button>

			<button
				class="bg-emerald-600 text-white py-2 px-4 rounded"
				@click="handleConfirmAddWords"
			>
				Add words
			</button>
		</div>
	</dialog>
</template>

<script setup>
	import { useStorage } from "@vueuse/core"

	import HomeIcon from "@phosphor-icons/core/assets/bold/house-bold.svg?component"
	import AddIcon from "@phosphor-icons/core/assets/bold/plus-square-bold.svg?component"

	import CaretLeft from "@phosphor-icons/core/assets/bold/caret-left-bold.svg?component"
	import CaretRight from "@phosphor-icons/core/assets/bold/caret-right-bold.svg?component"
	import CrossIcon from "@phosphor-icons/core/assets/bold/x-bold.svg?component"

	const SCRAB_SERVER_URL = "https://ifcanduela.com/scrab-server/"

	useHead({
		title: "Manage the word list - Escrábol",
	})

	const PAGE_SIZE = 100

	const selected = ref([])
	const filter = useStorage("filter", "")
	const page = ref(1)
	const newWords = ref("")

	const { data, pending } = useFetch(SCRAB_SERVER_URL)

	function toggleSelected(word) {
		if (selected.value.includes(word)) {
			selected.value = selected.value.filter((w) => w !== word)
		} else {
			selected.value = [...selected.value, word]
		}
	}

	function prevPage() {
		page.value = Math.max(1, page.value - 1)
	}

	function nextPage() {
		page.value = Math.min(maxPage.value, page.value + 1)
	}

	const maxPage = computed(() => Math.ceil(filtered.value.length / PAGE_SIZE))

	const filtered = computed(() => {
		if (pending.value) {
			return []
		}

		if (filter.value.length) {
			const rx = new RegExp(filter.value, "i")
			return data.value.filter((w) => rx.test(w))
		}

		return data.value
	})

	const wordlist = computed(() => {
		const from = (page.value - 1) * PAGE_SIZE
		const to = from + PAGE_SIZE

		return filtered.value.slice(from, to)
	})

	function handleClickDeleteWords(event) {
		const dialog = document.querySelector("#dialog-delete-words")
		dialog.showModal()
	}

	function handleCancelDeleteWords() {
		const dialog = document.querySelector("#dialog-delete-words")
		dialog.close()
	}

	async function handleConfirmDeleteWords() {
		const dialog = document.querySelector("#dialog-delete-words")
		dialog.close()

		const words = selected.value.slice()

		const { data: deleteData, error } = await useFetch(SCRAB_SERVER_URL, {
			method: "DELETE",
			body: { words },
		})

		data.value = data.value.filter((w) => !words.includes(w))
		selected.value = []
	}

	function handleClickAddWords() {
		const dialog = document.querySelector("#dialog-add-words")
		dialog.showModal()
	}

	async function handleConfirmAddWords() {
		const dialog = document.querySelector("#dialog-add-words")
		dialog.close()

		const words = newWords.value
			.split("\n")
			.filter((w) => w)
			.map((w) => w.trim())

		const r = await useFetch(SCRAB_SERVER_URL, {
			method: "POST",
			body: { words },
		})

		data.value = [...data.value, ...r.data.value.words]
		newWords.value = ""
	}

	function handleCancelAddWords() {
		const dialog = document.querySelector("#dialog-add-words")
		dialog.close()
	}
</script>
