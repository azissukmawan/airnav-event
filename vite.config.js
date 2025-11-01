import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    API_BASE_URL: JSON.stringify(
      "https://mediumpurple-swallow-757782.hostingersite.com/api"
    ),
  },
});
