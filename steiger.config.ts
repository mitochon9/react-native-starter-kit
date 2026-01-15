import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Expo Routerのappディレクトリとその他をignore
    ignores: [
      "**/node_modules/**",
      "**/.expo/**",
      "**/android/**",
      "**/ios/**",
      "**/dist/**",
      "**/build/**",
      "**/*.lock",
      "app/**", // Expo Routerのルーティング用（FSDのappレイヤーとは別）
    ],
  },
  {
    // widgets層のルールを緩和（Expo Routerのapp/から参照されるため）
    files: ["./src/widgets/**"],
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
  {
    // app層のprovidersスライスのuiセグメントは許可
    files: ["./src/app/**/ui/**"],
    rules: {
      "fsd/no-reserved-folder-names": "off",
    },
  },
]);
