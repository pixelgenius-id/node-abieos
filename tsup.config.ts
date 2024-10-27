import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ["lib/abieos.ts"],
    publicDir: "lib",
    format: ["cjs", "esm"],
    shims: true,
    minify: false,
    sourcemap: false,
    clean: true,
    experimentalDts: "lib/abieos.ts"
})