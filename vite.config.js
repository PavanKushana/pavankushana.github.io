// vite.config.js: build settings.
// base "./" makes every asset path relative, so the same build works on GitHub Pages (any repo name) and on a
// custom domain later, without changing anything.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
});
