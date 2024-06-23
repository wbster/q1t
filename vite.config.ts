import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

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
	plugins: [
		dts({
			insertTypesEntry: true,
			include: "src/**/*",
			exclude: "src/**/*.spec.ts",
		}),
	],
})
