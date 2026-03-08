import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxt/icon", "@nuxt/eslint"],
  css: ["./app/assets/css/main.css"],

  devServer: {
    port: 4000,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: "http://localhost",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
  // @ts-ignore remove later
  colorMode: {
    dataValue: "theme",
  },
  eslint: {
    config: {
      stylistic: false,
    },
  },
});
