import { TILES } from "./tiles.js"

export default class ScoreMaker {
	getScore(word) {
		return word.split("").reduce((acc, letter) => {
			const tile = TILES.find(
				(t) => t.letter.toLowerCase() === letter.toLowerCase(),
			)
			if (!tile) {
				return acc
			}

			return acc + tile.points
		}, 0)
	}
}
