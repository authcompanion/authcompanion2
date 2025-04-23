import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  root: "./client",
  build: {
    outDir: "./dist",
    emptyOutDir: true,
  },
  server: {
    port: 3001, // Frontend port
    // strictPort: true,
    proxy: {
      "/v1": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
    },
  },
});
