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
		this._useWidcard = true
		this._letters = []
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

	useWildcard(trueOrFalse) {
		this._useWildcard = trueOrFalse
	}

	letters(listOfPlayerLetters) {
		this._letters = listOfPlayerLetters
	}

	match(letters = null) {
		let result = this._wordList.slice()
		let letterList = letters ? letters.split("") : this._letters.split("")
		const tileCount = countLetters(letterList)

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

		if (this._useWildcard) {
			// @todo
		}

		if (allPlayableLetters.length) {
			result = result.filter((w) => {
				for (const l of w.split("")) {
					if (!allPlayableLetters.includes(l)) {
						return false
					}
				}

				return true
			})
		}

		result = result
			.slice(0, 5)
			.map((w) => {
				const countables = w
					.replace(new RegExp(`^${this._matchStart}`), "")
					.replace(new RegExp(`${this._matchEnd}$`), "")
					.replace(new RegExp(`${this._matchMiddle}`), "")

				return {
					word: w,
					letterCount: countLetters(countables),
				}
			})
			.filter((w) => {
				for (const letter in w.letterCount) {
					if (tileCount[letter] > w.letterCount[letter]) {
						return false
					}
				}

				return true
			})
		result.sort((a, b) => b.length - a.length)

		return result
	}
}
