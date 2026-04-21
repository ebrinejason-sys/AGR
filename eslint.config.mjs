import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "server.js",
      "ssh_install.js",
      "upload_to_cpanel.js",
      "delete_from_cpanel.js",
    ],
  },
];

export default eslintConfig;
