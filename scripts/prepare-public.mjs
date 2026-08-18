import { cp, mkdir, rm } from "node:fs/promises";

await mkdir("public", { recursive: true });
await rm("public/assets", { recursive: true, force: true });
await cp("assets", "public/assets", { recursive: true });
