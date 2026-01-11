import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import litPlugin from "eslint-plugin-lit";
import wcPlugin from "eslint-plugin-wc";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "lit": litPlugin,
      "wc": wcPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...litPlugin.configs.recommended.rules,
      ...wcPlugin.configs.recommended.rules,
      
      // Custom overrides
      "@typescript-eslint/no-explicit-any": "warn", // Allow 'any' but warn
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
  },
  {
    ignores: ["dist/**", "node_modules/**"]
  }
];
