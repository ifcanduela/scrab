/**
 * Count each character in a string.
 *
 * @param {String} str
 * @returns {object.<string, number>}
 */
export default function countLetters(str) {
	const letters = {}

	for (let i = 0; i < str.length; i++) {
		const letter = str[i]

		letters[letter] = (letters[letter] || 0) + 1
	}

	return letters
}
