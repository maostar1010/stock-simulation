import { fileURLToPath } from "url";
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
