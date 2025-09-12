// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next"; // ✅ official scoped plugin

// Files/folders ESLint should ignore (replaces .eslintignore)
const IGNORES = [
  // build artifacts
  "node_modules/**",
  ".next/**",
  "out/**",
  "dist/**",
  "coverage/**",

  // Next’s generated ambient types
  "next-env.d.ts",

  // common project config files (let tools own their syntax/globals)
  "eslint.config.{js,cjs,mjs}",
  "next.config.{js,cjs,mjs,ts}",
  "tailwind.config.{js,cjs,mjs,ts}",
  "postcss.config.{js,cjs,mjs,ts}",
  "vite.config.{js,cjs,mjs,ts}",
  "tsup.config.{js,cjs,mjs,ts}",
  "jest.config.{js,cjs,mjs,ts}",
  "commitlint.config.{js,cjs,mjs,ts}",
];

const tsTypeChecked = tseslint.configs.recommendedTypeChecked.map((cfg) => ({
  files: ["**/*.{ts,tsx}"], // scope TS rules to TS files
  ...cfg,
}));

export default [
  { ignores: IGNORES },

  // Base JS recommendations (apply to all files; we’ll set language options below)
  js.configs.recommended,

  // Type-aware TS rules
  ...tsTypeChecked,

  // Provide parserOptions + globals for TS (needed for type-aware rules)
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: ["./tsconfig.json"],
        tsconfigRootDir: process.cwd(),
      },
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
    },
  },

  // Next.js Core Web Vitals
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { "@next/next": nextPlugin },
    rules: { ...nextPlugin.configs["core-web-vitals"].rules },
  },

  // Silence triple-slash on Next’s generated file (belt-and-suspenders)
  {
    files: ["next-env.d.ts"],
    rules: { "@typescript-eslint/triple-slash-reference": "off" },
  },
];
