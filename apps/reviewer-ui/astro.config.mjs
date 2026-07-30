import node from "@astrojs/node";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  security: {
    checkOrigin: true,
  },
  server: {
    host: "127.0.0.1",
    port: 4321,
  },
  vite: {
    server: {
      fs: {
        allow: ["../.."],
      },
    },
  },
});
