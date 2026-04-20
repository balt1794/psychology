import { rmSync } from "node:fs";
import { spawn } from "node:child_process";

const CHUNK_MISSING_REGEX = /Cannot find module '\.\/\d+\.js'/i;
const STREAM_STATE_REGEX = /ERR_INVALID_STATE|ReadableStream is already closed/i;

let child = null;
let restarting = false;
let restartCount = 0;

function cleanNextDir() {
  try {
    rmSync(".next", { recursive: true, force: true });
  } catch (error) {
    console.error("[dev-stable] Failed to clean .next:", error);
  }
}

function scheduleRestart(reason) {
  if (restarting) return;
  restarting = true;
  restartCount += 1;

  console.error(`\n[dev-stable] Restarting Next dev server (#${restartCount})`);
  console.error(`[dev-stable] Reason: ${reason}\n`);

  const currentChild = child;
  if (!currentChild) {
    restarting = false;
    startServer();
    return;
  }

  currentChild.kill("SIGTERM");
  setTimeout(() => {
    if (!currentChild.killed) {
      currentChild.kill("SIGKILL");
    }
  }, 1500);
}

function startServer() {
  cleanNextDir();

  const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
  child = spawn(cmd, ["next", "dev"], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => {
    const text = chunk.toString();
    process.stdout.write(text);

    if (CHUNK_MISSING_REGEX.test(text)) {
      scheduleRestart("missing .next server chunk");
    }
  });

  child.stderr.on("data", (chunk) => {
    const text = chunk.toString();
    process.stderr.write(text);

    if (CHUNK_MISSING_REGEX.test(text)) {
      scheduleRestart("missing .next server chunk");
      return;
    }

    if (STREAM_STATE_REGEX.test(text)) {
      scheduleRestart("invalid stream runtime state");
    }
  });

  child.on("exit", (code, signal) => {
    const expected = restarting;
    child = null;

    if (expected) {
      restarting = false;
      setTimeout(startServer, 250);
      return;
    }

    if (signal || (code !== null && code !== 0)) {
      console.error(
        `[dev-stable] next dev exited unexpectedly (code=${code}, signal=${signal}). Restarting...`,
      );
      setTimeout(startServer, 500);
    }
  });
}

process.on("SIGINT", () => {
  if (child) child.kill("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  if (child) child.kill("SIGTERM");
  process.exit(0);
});

startServer();
