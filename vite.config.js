import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  define: {
    // API backend
    API_BASE_URL: JSON.stringify(
      "https://be-em.amawan.app/api"
    ),

    // Domain frontend (sementara pakai lokal)
    FRONTEND_URL: JSON.stringify("http://localhost:5173/"),
    // FRONTEND_URL: JSON.stringify("https://airnav-event.vercel.app/"),
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        },
      },
    },
  },
});
