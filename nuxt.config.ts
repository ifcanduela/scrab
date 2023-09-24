// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	devServer: {
		port: 3131,
	},
	modules: ["@nuxt/image", "@pinia/nuxt", "@nuxtjs/tailwindcss"],
})
