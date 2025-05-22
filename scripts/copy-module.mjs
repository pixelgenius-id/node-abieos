import { copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";

if (!existsSync("build/Release/node_abieos.node")) {
    console.log("node_abieos.node does not exist in the build directory. Skipping copy.");
    process.exit(0);
}

await copyFile("build/Release/node_abieos.node", "lib/abieos.node");
console.log("native module (abieos.node) copied to lib directory.");
