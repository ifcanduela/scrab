import WordMatcher from "@/lib/WordMatcher.js"
import { readWords } from "~/server/Wordlist"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const wordlist = await readWords()

	if (!body.letters) {
		throw createError({
			statusMessage: "Parameter `letters` is required",
			statusCode: 400,
		})
	}

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
