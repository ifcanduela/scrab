import fs from "fs/promises"

function cleanFileContent(textFile) {
	return textFile
		.toString()
		.split("\n")
		.map((w) => w.trim().toLowerCase())
		.filter((w) => !w.match(/\d/))
		.filter((w) => !w.match(/\s/))
		.filter((w) => w.length > 1)
}

async function buildListCommand(_params, program) {
	const basicFile = await fs.readFile(
		"./data/opentaal/basiswoorden-gekeurd.txt",
		"utf-8",
	)
	const basicList = cleanFileContent(basicFile)

	const derivativeFile = await fs.readFile(
		"./data/opentaal/flexies-ongekeurd.txt",
		"utf-8",
	)
	const derivativeList = cleanFileContent(derivativeFile)

	const allPlacesJson = await fetch(
		"https://opendata.cbs.nl/ODataApi/OData/84734NED/Woonplaatsen",
	)
	const allPlacesData = await allPlacesJson.json()
	const placeList = allPlacesData.value
		.map((item) => item.Title.trim().toLowerCase())
		.filter((w) => !w.match(/\d/))
		.filter((w) => !w.match(/\s/))

	const allWords = [...basicList, ...derivativeList, ...placeList]

	const unique = Array.from(new Set(allWords))

	fs.writeFile("./data/wordlist.json", JSON.stringify(unique, null, 2))
}

export default buildListCommand
