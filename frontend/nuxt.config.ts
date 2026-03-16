import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxt/icon", "@nuxt/eslint", "@nuxtjs/color-mode"],
  css: ["./app/assets/css/main.css"],

  devServer: {
    port: 4000,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://webserver:80',
      public: {
        apiBaseUrl: 'http://localhost'
      }
    },
  },

  vite: {
    plugins: tailwindcss(),
  },
  colorMode: {
    dataValue: "theme",
  },
  eslint: {
    config: {
      stylistic: false,
    },
  },
});
