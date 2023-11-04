import countLetters from "./countLetters.js"

export default class WordMatcher {
	public _wordList: string[] = []
	public _matchStart: string = ""
	public _matchEnd: string = ""
	public _matchMiddle: string = ""
	public _useWildcard: number = 0
	public _letters: string = ""
	public _letterLimit: number = 0

	constructor(wordList: string[]) {
		this._wordList = wordList
			.slice()
			.map((w) => w.trim())
			.filter((w) => w.length > 0 && w.length <= 15)
	}

	letterLimit(limit: number) {
		this._letterLimit = limit
	}

	matchStart(str: string) {
		this._matchStart = str
	}

	matchEnd(str: string) {
		this._matchEnd = str
	}

	matchMiddle(str: string) {
		this._matchMiddle = str
	}

	useWildcard(wildcardCount: number) {
		this._useWildcard = wildcardCount
	}

	letters(listOfPlayerLetters: string) {
		this._letters = listOfPlayerLetters
	}

	match(letters: string | null = null) {
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
					if (tileCount[letter] < w.letterCount[letter]) {
						return false
					}
				}

				return true
			})
			.map((w) => w.word)

		result.sort((a, b) => b.length - a.length)

		return result
	}
}
