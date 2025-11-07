import { buildContentFile, buildStaticFile, log } from "./utils.ts";
import { join } from "node:path";
import { watch } from "fs";
import config from "./config.ts";

await log();

watch(config.contentPath, { recursive: true }, async (_, filename) => {
  await buildContentFile(join(config.contentPath, filename!));
});

watch(config.staticPath, { recursive: true }, async (_, filename) => {
  await buildStaticFile(join(config.staticPath, filename!));
});
