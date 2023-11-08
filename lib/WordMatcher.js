import countLetters from "./countLetters.js"

class Anchoring {
	constructor(letter, position, direction) {
		this.letter = letter
		this.position = position
		this.direction = direction

		if (this.direction !== "start" && this.direction !== "end") {
			throw new Error(
				"Invalid anchoring direction: only 'start' and 'end' are valid values.",
			)
		}
	}

	getRegex() {
		const repeater = `.{${this.position - 1}}`
		const regex =
			this.direction === "start"
				? `^${repeater}${this.letter}`
				: `${this.letter}${repeater}$`

		return new RegExp(regex, "i")
	}
}

export default class WordMatcher {
	constructor(wordList) {
		this.wordlist = wordList
			.map((w) => w.trim())
			.filter((w) => w && w.length > 0 && w.length <= 15)
		this.start = ""
		this.end = ""
		this.middle = ""
		this.wildcards = 0
		this.playerLetters = ""
		this.maxLength = 0
		this.anchor = null
	}

	letterLimit(limit) {
		this.maxLength = limit
	}

	matchStart(str) {
		this.start = str.toLowerCase()
	}

	matchEnd(str) {
		this.end = str.toLowerCase()
	}

	matchMiddle(str) {
		this.middle = str.toLowerCase()
	}

	anchorLetter(letter, position, direction) {
		this.anchor = new Anchoring(letter, position, direction)
	}

	useWildcards(wildcardCount) {
		this.wildcards = wildcardCount
	}

	letters(listOfPlayerLetters) {
		this.playerLetters = listOfPlayerLetters.toLowerCase()
	}

	match(letters = null, resultCount = null) {
		let result = this.wordlist.slice()
		let letterList = (letters ? letters : this.playerLetters).toLowerCase()

		if (letterList.length === 0) {
			return []
		}

		const allPlayableLetters = [
			...letterList,
			...this.start,
			...this.middle,
			...this.end,
		]

		if (this.maxLength) {
			result = result.filter((w) => w.length <= this.maxLength)
		}

		if (this.start) {
			result = result.filter((w) => w.startsWith(this.start))
		}

		if (this.middle) {
			result = result.filter((w) => w.includes(this.middle))
		}

		if (this.end) {
			result = result.filter((w) => w.endsWith(this.end))
		}

		if (this.anchor) {
			const rx = this.anchor.getRegex()
			result = result.filter((w) => rx.test(w))
		}

		const playerHasY = letterList.includes("y")

		result = result.filter((resultWord) => {
			// first we need to manage the IJ/Y situation
			let word = resultWord
			// check if the current word has an IJ digraph
			const hasIJ = /ij/.test(word)

			if (playerHasY && hasIJ) {
				// if the player has a Y and the word has an IJ
				const playerTileCount = countLetters(letterList)

				for (let ij = 0; ij < playerTileCount["y"]; ij++) {
					word = word.replace(/ij/, "y")
				}
			}

			// create a fresh letter counter
			const tileCount = countLetters(allPlayableLetters)
			const letters = word.split("")
			let misses = this.wildcards

			for (const l of letters) {
				if (!tileCount[l]) {
					if (misses === 0) {
						// if we're out of misses, the word doesn't match
						return false
					} else {
						// the player doesn't have this letter,
						// but a wildcard is still available
						misses--
					}
				} else {
					// the letter is available, so we use it
					// and decrease the tile count for this letter
					tileCount[l]--
				}
			}

			return true
		})

		result.sort((a, b) => b.length - a.length)

		if (resultCount) {
			result = result.slice(0, resultCount)
		}

		return result
	}
}
