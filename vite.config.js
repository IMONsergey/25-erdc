import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  server: { host: "0.0.0.0", allowedHosts: ["terminal.local"] },
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        vladivostok: "vladivostok/index.html",
        mapLab: "map-lab/index.html",
        responsiveQA: "qa/index.html",
      },
    },
  },
});
