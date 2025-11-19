import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
	testMatch: ["**/*.spec.ts"],
	watch: false,
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		}
	}
})
