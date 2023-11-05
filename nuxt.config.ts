import svgLoader from "vite-svg-loader"

export default defineNuxtConfig({
	ssr: false,
	devtools: { enabled: false },
	devServer: {
		port: 3131,
	},
	modules: [
		"@nuxt/image",
		"@pinia/nuxt",
		"@nuxtjs/tailwindcss",
		"@nuxtjs/google-fonts",
	],
	googleFonts: {
		download: true,
		families: {
			Inter: [400, 700, 900],
		},
	},
	vite: {
		plugins: [svgLoader()],
	},
})
