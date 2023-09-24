import { program } from "commander"
import findWordsCommand from "./commands/FindWords.js"
import buildListCommand from "./commands/BuildList.js"

program
	.command("find-words")
	.description("Find word matches from a list of letters")
	.action(findWordsCommand)
	.option("-l, --letters <letters>", "letters to use")
	.option("-w, --wildcard", "allow a wildcard match")
	.option("-s, --start <start>", "match word start")
	.option("-e, --end <end>", "match word end")

program
	.command("build-list")
	.description("Build a word list from different sources")
	.action(buildListCommand)

program.parse()
