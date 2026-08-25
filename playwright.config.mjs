import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/browser",
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:4183",
    viewport: { width: 390, height: 844 },
  },
  webServer: {
    command: "node tools/e2e-server.mjs 4183",
    port: 4183,
    reuseExistingServer: true,
    timeout: 20000,
  },
});
