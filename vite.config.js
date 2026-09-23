import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        primorye: "primorye/index.html",
        buryatia: "buryatia/index.html",
        vladivostok: "vladivostok/index.html",
        mapLab: "map-lab/index.html",
        responsiveQA: "qa/index.html",
      },
    },
  },
});
