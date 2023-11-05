import countLetters from "./countLetters.js"

export default class WordMatcher {
	constructor(wordList) {
		this._wordList = wordList
			.slice()
			.map((w) => w.trim())
			.filter((w) => w.length > 0 && w.length <= 15)
		this._matchStart = ""
		this._matchEnd = ""
		this._matchMiddle = ""
		this._useWildcard = 0
		this._letters = ""
		this._letterLimit = 0
	}

	letterLimit(limit) {
		this._letterLimit = limit
	}

	matchStart(str) {
		this._matchStart = str
	}

	matchEnd(str) {
		this._matchEnd = str
	}

	matchMiddle(str) {
		this._matchMiddle = str
	}

	useWildcard(wildcardCount) {
		this._useWildcard = wildcardCount
	}

	letters(listOfPlayerLetters) {
		this._letters = listOfPlayerLetters
	}

	match(letters = null) {
		let result = this._wordList.slice()
		let letterList = (letters ? letters : this._letters)
			.toLowerCase()
			.split("")

		if (letterList.length === 0) {
			return []
		}

		const allPlayableLetters = [
			...letterList,
			...this._matchStart.split(""),
			...this._matchMiddle.split(""),
			...this._matchEnd.split(""),
		]

		if (this._letterLimit) {
			result = result.filter((w) => {
				return w.length <= this._letterLimit
			})
		}

		if (this._matchStart) {
			result = result.filter((w) => {
				return w.startsWith(this._matchStart)
			})
		}

		if (this._matchMiddle) {
			result = result.filter((w) => {
				return w.includes(this._matchMiddle)
			})
		}

		if (this._matchEnd) {
			result = result.filter((w) => {
				return w.endsWith(this._matchEnd)
			})
		}

		const playerHasY = letterList.includes("y")

		result = result.filter((resultWord) => {
			// first we need to manage the IJ/Y situation
			let word = resultWord
			// check if the current word has an ij digraph
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
			let misses = this._useWildcard

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

		return result.slice(0, 25)
	}
}
