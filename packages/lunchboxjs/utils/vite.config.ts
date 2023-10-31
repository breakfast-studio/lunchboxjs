import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import glsl from "vite-plugin-glsl";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), glsl(), vueJsx()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
