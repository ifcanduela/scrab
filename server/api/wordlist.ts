import { createClient } from "@supabase/supabase-js"

const PAGE_SIZE = 75

type WordlistQuery = {
	page?: string
	filter?: string
}

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig(event)
	const query: WordlistQuery = getQuery(event)

	const page = query.page ? parseInt(query.page) : 1
	const filter = query.filter ? query.filter : ""

	const supabase = createClient(
		config.app.supabaseUrl,
		config.app.supabaseKey,
	)

	const countQuery = supabase
		.from("wordlist")
		.select("word", { count: "exact", head: true })
	if (filter.length) {
		countQuery.ilike("word", `%${filter}%`)
	}
	const { count } = await countQuery

	const from = (page - 1) * PAGE_SIZE
	const to = page * PAGE_SIZE - 1
	const maxPage = Math.ceil(count / PAGE_SIZE)

	const selectQuery = supabase.from("wordlist").select("*").range(from, to)
	if (filter.length) {
		selectQuery.ilike("word", `%${filter}%`)
	}
	const { data: wordlist, error } = await selectQuery

	return { wordlist, error, page, PAGE_SIZE, maxPage }
})
