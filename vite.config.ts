import build from "@hono/vite-build/vercel";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		honox({
			client: { input: ["/app/client.ts", "/app/style.css"] },
		}),
		tailwindcss(),
		build({
			staticDir: ".vercel/output/static",
		}),
	],
});
