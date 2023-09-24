import fs from "fs/promises"

export default defineEventHandler(async (event) => {
	const json = await fs.readFile("data/wordlist.json", "utf-8")
	const wordList = JSON.parse(json)

	return wordList
})
