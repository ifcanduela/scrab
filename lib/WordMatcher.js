export default class WordMatcher {
	constructor(wordList) {
		this._wordList = wordList
			.slice()
			.map((w) => w.trim())
			.filter((w) => w.length > 0 && w.length <= 15)
		this._matchStart = null
		this._matchEnd = null
		this._matchMiddle = null
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

	match(letters) {
		let result = this._wordList.slice()

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
		}

		if (letters && letters.length) {
			const letterList = letters.split("")

			result = result.filter((w) => {
				for (const l of w) {
					if (!letterList.includes(l)) {
						return false
					}
				}

				return true
			})
		}

		result.sort((a, b) => b.length - a.length)

		return result
	}
}
