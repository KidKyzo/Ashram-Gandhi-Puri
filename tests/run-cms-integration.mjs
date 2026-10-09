import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";

const directory = mkdtempSync(path.join(tmpdir(), "agp-cms-test-"));
const env = { ...process.env, NODE_ENV: "development", DATABASE_URI: `file:${path.join(directory, "payload.db").replaceAll("\\", "/")}`, PAYLOAD_SECRET: randomBytes(32).toString("hex") };
for (const key of ["S3_BUCKET", "BUCKET_NAME", "R2_BUCKET"]) env[key] = "";
try {
  const result = spawnSync(process.execPath, ["node_modules/payload/bin.js", "run", "tests/cms-integration.ts"], { env, stdio: "inherit" });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  // Only remove the unique temporary directory created by this test run.
  if (path.dirname(directory) === path.resolve(tmpdir()) && path.basename(directory).startsWith("agp-cms-test-")) rmSync(directory, { recursive: true, force: true });
}
