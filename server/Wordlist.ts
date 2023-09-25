import path from "path"
import fs from "fs/promises"
import wordlist from "~/public/wordlist.json" assert { type: "json" }

export async function readWords() {
	// const filename = path.resolve(process.cwd(), "public", "wordlist.json")
	// const json = await fs.readFile(filename, "utf-8")
	// const words = JSON.parse(json)
	//
	// return words
	return wordlist
}

export async function writeWords(words: string[]) {
	const filename = path.resolve(process.cwd(), "public", "wordlist.json")
	const json = JSON.stringify(words, null, 4)
	const result = await fs.writeFile(filename, json)

	return result
}
