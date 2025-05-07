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
    plugins: {
      import: require("eslint-plugin-import"),
    },
    rules: {
      "import/no-unresolved": "error", // opcional, alerta se você errar o caminho
      "import/order": "warn", // opcional, alerta se desorganizar imports
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  },
  
];


export default eslintConfig;
