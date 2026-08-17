import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { powerApps } from "@microsoft/power-apps-vite/plugin";
import tailwindcss from "@tailwindcss/vite";
import eslint from "vite-plugin-eslint";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), powerApps(), tailwindcss(), eslint()],
  optimizeDeps: {
    exclude: ['@microsoft/power-apps']
  }

},

);
