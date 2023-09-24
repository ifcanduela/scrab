import wordlist from "@/data/wordlist.json" assert { type: "json" }

export default defineEventHandler(async (event) => {
	return wordlist
})
