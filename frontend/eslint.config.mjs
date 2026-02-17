import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    // Eure Richtlinien
    "@typescript-eslint/no-explicit-any": "error", // Kein any
    "vue/multi-word-component-names": "error", // PascalCase/Struktur
    "vue/component-definition-name-casing": ["error", "PascalCase"],
    camelcase: "error", // camelCase für Variablen
    quotes: ["error", "double"],
  },
});
