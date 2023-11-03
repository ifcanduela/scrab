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

		<div class="flex gap-4 min-w-[40rem] mb-4">
			<div class="wordlist flex gap-2 flex-wrap">
				<div
					class="bg-purple-100 px-2 py-1"
					v-for="w in wordlist"
					:data-id="w"
				>
					{{ w }}
				</div>
			</div>
		</div>

		<div class="pagination flex gap-4 items-center">
			<button
				class="bg-purple-300 text-purple-800 uppercase px-4 py-3 rounded-sm"
				:class="{
					'opacity-50': page === 1,
					'cursor-default': page === 1,
				}"
				@click="prevPage"
			>
				Prev
			</button>
			<span class="inline-flex gap-1 items-center">
				{{ page }}<small>/ {{ maxPage }}</small>
			</span>
			<button
				class="bg-purple-300 text-purple-800 uppercase px-4 py-3 rounded-sm"
				:class="{
					'opacity-50': page === maxPage,
					'cursor-default': page === maxPage,
				}"
				@click="nextPage"
			>
				Next
			</button>
		</div>
	</div>
</template>

<script setup>
	import { useStorage } from "@vueuse/core"

	useHead({
		title: "Manage the wordlist - Escrábol",
	})

	const PAGE_SIZE = 100

	const selected = ref([])
	const filter = useStorage("filter", "")
	const page = ref(1)

	const { data, pending } = useFetch("https://ifcanduela.com/scrab-server/")

	function prevPage() {
		if (page.value > 1) {
			page.value = Math.max(1, page.value - 1)
			selected.value = []
		}
	}

	function nextPage() {
		page.value = Math.min(maxPage.value, page.value + 1)
	}

	const maxPage = computed(() => Math.ceil(data.value.length / PAGE_SIZE))

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
</script>
