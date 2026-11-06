import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true
  },
  test: {
    // The PXL CLI is checked out into .tools only during CI asset generation.
    // Its upstream tests belong to the PXL repository, not Merzkava's test suite.
    exclude: [...configDefaults.exclude, "**/.tools/**", ".tools/**"]
  }
});
