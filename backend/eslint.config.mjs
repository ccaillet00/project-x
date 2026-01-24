// backend/eslint.config.mjs
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    // Bestimmt, welche Dateien geprüft werden
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...prettierConfig.rules,

      // --- Eure Richtlinie: TypeScript & Qualität ---
      "@typescript-eslint/no-explicit-any": "error", // Verbot von 'any'

      // --- Eure Richtlinie: Sprache & Benennung ---
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "variable", format: ["camelCase", "UPPER_CASE"] }, // camelCase
        { selector: "function", format: ["camelCase"] }, // camelCase
        { selector: "interface", format: ["PascalCase"] }, // PascalCase
      ],

      // Mindestlänge für Variablen (Aussagekraft)
      "id-length": ["error", { min: 2, exceptions: ["i", "x", "y"] }],
      quotes: ["error", "double"],
    },
  },
];
