import { readWords } from "~/server/Wordlist"

export default defineEventHandler(async (_event) => {
	const wordlist = await readWords()
	return wordlist
})
