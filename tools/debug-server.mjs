import { spawn } from "node:child_process";
import { join } from "node:path";

const cwd = process.cwd().includes("tools") ? join(process.cwd(), "..") : process.cwd();
const child = spawn(process.execPath, [join("tools", "e2e-server.mjs"), "4182"], { cwd });
child.stdout.on("data", (d) => console.log("OUT", String(d).trim()));
child.stderr.on("data", (d) => console.log("CHILD-ERR", String(d).trim()));

setTimeout(async () => {
  try {
    const response = await fetch("http://127.0.0.1:4182/");
    console.log("status:", response.status);
    console.log("csp:", response.headers.get("content-security-policy"));
    const body = await response.text();
    console.log("body length:", body.length);
  } catch (error) {
    console.log("FETCH ERR:", error.message);
  }
  child.kill();
  process.exit(0);
}, 2500);
