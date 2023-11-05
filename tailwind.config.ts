import defaultTheme from "tailwindcss/defaultTheme"
import type { Config } from "tailwindcss"

export default <Partial<Config>>{
	theme: {
		fontFamily: {
			sans: ["Inter", ...defaultTheme.fontFamily.sans],
			serif: [...defaultTheme.fontFamily.serif],
			mono: [...defaultTheme.fontFamily.mono],
		},
	},
}
