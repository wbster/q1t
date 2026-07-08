import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	build: {
		lib: {
			entry: {
				index: "src/index.ts",
				// react: 'src/react/index.ts'
			},
			name: "q1t",
			formats: ["cjs", "es"],
		},
		outDir: "./dist",
		minify: "esbuild",
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	plugins: [
		dts({
			insertTypesEntry: true,
			include: "src/**/*",
			exclude: "src/**/*.spec.ts",
		}),
	],
})
