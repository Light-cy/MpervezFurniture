import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig(({ command, mode, isPreview }) => {
  // `npm run build` produces the Cloudflare bundle that gets deployed.
  // `npm run preview` builds the same app for the Node preset so the production
  // output can be inspected locally without installing Wrangler/workerd.
  const preset = mode === "preview" ? "node-server" : "cloudflare-module";

  return {
    plugins: [
      tailwindcss(),
      tanstackStart({
        // Use the custom SSR entry in src/server.ts so server errors render a
        // friendly error page instead of a bare 500 JSON response.
        server: { entry: "server" },
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**"],
            specifiers: ["server-only"],
          },
        },
      }),
      // Nitro produces the deployable server build. It also has to be present
      // for `vite preview`, which serves the built output through Nitro's
      // preview server — without it the TanStack preview plugin looks for a
      // plain `dist/server/server.js` that a Nitro build never creates.
      (command === "build" || isPreview) && nitro({ defaultPreset: preset }),
      react(),
    ],
    resolve: {
      // Reads the `@/*` alias straight from tsconfig.json.
      tsconfigPaths: true,
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
  };
});
