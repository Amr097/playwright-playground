import js from "@eslint/js";
import typescript from "typescript-eslint";
import playwright from "eslint-plugin-playwright";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...typescript.configs.recommended,
  prettier,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescript.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: ["tests/**/*.ts"],
    ...playwright.configs["flat/recommended"],
  },
  {
    ignores: ["node_modules", "dist", "build", "coverage", ".next", "*.config.js"],
  },
];