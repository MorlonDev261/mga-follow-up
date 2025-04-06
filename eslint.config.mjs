import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn", // Ou 'error' si tu préfères
        {
          argsIgnorePattern: "^_",  // Ignore les arguments qui commencent par "_"
          varsIgnorePattern: "^_",  // Ignore les variables qui commencent par "_"
        },
      ],
    },
  },
];

export default eslintConfig;
