<template>
	<div
		v-if="!pending"
		class="layout min-h-screen flex flex-col justify-start items-center p-16"
	>
		<h1 class="font-bold text-center text-8xl mb-8 text-purple-500">
			Wordlist
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
		class="fixed bottom-2 right-2 flex flex-col gap-1 w-[10rem]"
	>
		<button
			class="bg-red-400 text-white font-bold py-2 px-1 rounded-md hover:bg-red-600"
			@click="handleDeleteClick"
		>
			Delete selected
		</button>
		<div v-for="s in selected" class="flex gap-2 items-center leading-none">
			<button @click="toggleSelected(s)" class="block bg-amber-400 p-2">
				<CrossIcon class="w-2" />
			</button>
			<span class="block text-gray-600">{{ s }}</span>
		</div>
	</div>

	<dialog class="bg-white p-10 shadow-2xl">
		<p class="mb-2">
			Do you really want to delete {{ selected.length }} word{{
				selected.length === 1 ? "" : "s"
			}}?
		</p>

		<p class="mb-6">This action cannot be undone.</p>

		<div class="flex gap-4">
			<button
				class="bg-gray-100 py-2 px-4 rounded"
				@click="handleCancelDelete"
			>
				Not really, cancel this
			</button>

			<button
				class="bg-red-600 text-white py-2 px-4 rounded"
				@click="handleConfirmDelete"
			>
				Yes, I want to delete {{ selected.length }} word{{
					selected.length === 1 ? "" : "s"
				}}
			</button>
		</div>
	</dialog>
</template>

<script setup>
	import { useStorage } from "@vueuse/core"

	import CaretLeft from "@phosphor-icons/core/assets/bold/caret-left-bold.svg?component"
	import CaretRight from "@phosphor-icons/core/assets/bold/caret-right-bold.svg?component"
	import CrossIcon from "@phosphor-icons/core/assets/bold/x-bold.svg?component"

	useHead({
		title: "Manage the wordlist - Escrábol",
	})

	const PAGE_SIZE = 100

	const selected = ref([])
	const filter = useStorage("filter", "")
	const page = ref(1)

	const { data, pending } = useFetch("https://ifcanduela.com/scrab-server/")

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

	function handleDeleteClick(event) {
		const dialog = document.querySelector("dialog")
		dialog.showModal()
	}

	function handleCancelDelete() {
		const dialog = document.querySelector("dialog")
		dialog.close()
	}

	async function handleConfirmDelete() {
		const dialog = document.querySelector("dialog")
		dialog.close()

		const words = selected.value.slice()

		const {
			data: deleteData,
			pending,
			error,
		} = await useFetch("https://ifcanduela.com/scrab-server", {
			method: "DELETE",
			body: { words },
		})

		console.log(error.value)

		data.value = data.value.filter((w) => !words.includes(w))
		selected.value = []
	}
</script>
