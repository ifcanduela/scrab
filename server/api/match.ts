import WordMatcher from "@/lib/WordMatcher.js"
import { createClient } from "@supabase/supabase-js"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	if (!body.letters) {
		throw createError({
			statusMessage: "Parameter `letters` is required",
			statusCode: 400,
		})
	}

	const config = useRuntimeConfig(event)

	const supabase = createClient(
		config.app.supabaseUrl,
		config.app.supabaseKey,
	)

	const query = supabase.from("wordlist").select("*")

	if (body.matchStart) {
		query.ilike("word", `${body.matchStart}%`)
	}

	if (body.matchMiddle) {
		query.ilike("word", `%${body.matchMiddle}%`)
	}

	if (body.matchEnd) {
		query.ilike("word", `%${body.matchEnd}`)
	}

	const { data: wordlistResult } = await query

	const wordlist = wordlistResult
		? wordlistResult.map((word) => word.word)
		: []

	const matcher = new WordMatcher(wordlist.slice())

	matcher.letters(body.letters)

	matcher.useWildcard(body.useWildcard)

	if (body.letterLimit) {
		matcher.letterLimit(body.letterLimit)
	}

	if (body.matchStart) {
		matcher.matchStart(body.matchStart)
	}

	if (body.matchMiddle) {
		matcher.matchMiddle(body.matchMiddle)
	}

	if (body.matchEnd) {
		matcher.matchEnd(body.matchEnd)
	}

	return matcher.match().slice(0, 50)
})
