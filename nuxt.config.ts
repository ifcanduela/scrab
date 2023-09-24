// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	devtools: { enabled: false },
	devServer: {
		port: 3131,
	},
	modules: ["@nuxt/image", "@pinia/nuxt", "@nuxtjs/tailwindcss"],
})
