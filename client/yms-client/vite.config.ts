import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { powerApps } from "@microsoft/power-apps-vite/plugin";
import tailwindcss from "@tailwindcss/vite";
import eslint from "vite-plugin-eslint";
import {nodePolyfills} from 'vite-plugin-node-polyfills'
// import {viteExternalsPlugin} from 'vite-plugin-externals'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // viteExternalsPlugin({jsstore: 'jsstore'}),
    nodePolyfills(), react(), powerApps(), tailwindcss(), eslint()],
  optimizeDeps: {
    exclude: ['@microsoft/power-apps']
  }

},

);
