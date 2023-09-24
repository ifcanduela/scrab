export default function countLetters(str) {
	const letters = {}

	for (let i = 0; i < str.length; i++) {
		const letter = str[i]

		if (letters[letter]) {
			letters[letter]++
		} else {
			letters[letter] = 1
		}
	}

	return letters
}
