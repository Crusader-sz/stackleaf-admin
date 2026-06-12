import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),

    AutoImport({
      imports: ["vue", "vue-router"],
      resolvers: [
        ElementPlusResolver({
          importStyle: "css",
        }),
      ],
      dts: "./src/types/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true,
      },
    }),

    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: "css",
        }),
      ],
      dts: "./src/types/components.d.ts",
    }),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
