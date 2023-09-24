import fs from "fs/promises"

async function buildListCommand(_params, program) {
	const textFile = await fs.readFile("./data/opentaal/wordlist.txt", "utf-8")
	const allWords = textFile
		.toString()
		.split("\n")
		.map((w) => w.trim())
		.filter((w) => !w.match(/\d/))
		.filter((w) => !w.match(/\s/))
		.filter((w) => w.length > 1)

	const allPlacesJson = await fetch(
		"https://opendata.cbs.nl/ODataApi/OData/84734NED/Woonplaatsen",
	)
	const allPlacesData = await allPlacesJson.json()

	allPlacesData.value
		.map((item) => item.Title)
		.map((w) => w.trim())
		.filter((w) => !w.match(/\d/))
		.filter((w) => !w.match(/\s/))
		.forEach((w) => {
			allWords.push(w)
		})

	fs.writeFile("./data/wordlist.json", JSON.stringify(allWords, null, 2))
}

export default buildListCommand
