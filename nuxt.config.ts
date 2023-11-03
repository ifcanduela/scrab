// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: false },
	devServer: {
		port: 3131,
	},
	modules: ["@nuxt/image", "@pinia/nuxt", "@nuxtjs/tailwindcss"],
	runtimeConfig: {
		app: {
			supabaseUrl: process.env.SUPABASE_URL,
			supabaseKey: process.env.SUPABASE_KEY,
		},
	},
})
