import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: "auto",
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.png"],
      manifest: {
        name: "CineMatch",
        short_name: "CineMatch",
        description: "Finde deinen nächsten Lieblingsfilm.",
        orientation: "portrait",
        theme_color: "#383838",
        background_color: "#383838",
        display: "standalone",
        id: "/",
        icons: [
          {
            src: "favicon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
        screenshots: [
          {
            src: "screenshot-1.png",
            sizes: "520x909",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "screenshot-2.png",
            sizes: "520x909",
            type: "image/png",
            form_factor: "narrow",
          },
        ],
      },
    }),
    mkcert(),
  ],
});
