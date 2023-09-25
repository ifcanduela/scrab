import wordlist from "~/public/wordlist.json" assert { type: "json" }

export async function readWords() {
	return wordlist
}

export async function writeWords(words: string[]) {
	return false
}
