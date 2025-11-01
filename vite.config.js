import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  define: {
    // API backend
    API_BASE_URL: JSON.stringify(
      "https://mediumpurple-swallow-757782.hostingersite.com/api"
    ),

    // Domain frontend (sementara pakai lokal)
    FRONTEND_URL: JSON.stringify("http://localhost:5173/"),
    // FRONTEND_URL: JSON.stringify("https://airnav-event.vercel.app/"),
  },
});
