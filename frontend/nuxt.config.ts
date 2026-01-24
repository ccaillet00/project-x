import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxt/icon", "@nuxt/eslint"],
  css: ["./app/assets/css/main.css"],

  devServer: {
    port: 4000,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: "http://localhost:3000",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
  eslint: {
    config: {
      stylistic: false,
    },
  },
});
