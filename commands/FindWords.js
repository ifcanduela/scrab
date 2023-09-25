import fs from "fs/promises"
import WordMatcher from "../lib/WordMatcher.js"

async function findWordsCommand(_params, program) {
	const json = await fs.readFile("public/wordlist.json", "utf-8")
	const allWords = JSON.parse(json)

	const opts = program.opts()

	const wordMatcher = new WordMatcher(allWords)

	if (opts.start) {
		wordMatcher.matchStart(opts.start)
	}

	if (opts.end) {
		wordMatcher.matchEnd(opts.end)
	}

	wordMatcher.useWildcard(!!opts.wildcard)

	const result = wordMatcher.match(opts.letters)

	console.log(
		`Number of results: ${result.length} words - Showing top 10 results`,
	)

	result.slice(0, 10).forEach((w) => {
		console.log(w)
	})
}

export default findWordsCommand
