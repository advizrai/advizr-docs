import { defineConfig } from 'playwright/test';

/**
 * Port contract: CI (and any fresh clone) gets the default port 3000 with a
 * dev server Playwright starts itself. This workspace often has ANOTHER
 * session's server on 3000, so reuseExistingServer is OFF — reusing a
 * foreign server silently tests someone else's build. Local runs set
 * PW_PORT (e.g. 3991) to a dedicated port; PW_NO_SERVER=1 skips the managed
 * webServer entirely for runs against an already-started production build
 * (npm run build && npx next start -p $PW_PORT).
 */
const PORT = Number(process.env.PW_PORT ?? 3000);
const BASE_URL = process.env.PW_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: process.env.PW_NO_SERVER
    ? undefined
    : {
        command: `npm run dev -- -p ${PORT}`,
        port: PORT,
        timeout: 120000,
        reuseExistingServer: false,
      },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { browserName: 'chromium', viewport: { width: 375, height: 812 } },
      // visual-baseline manages its own viewports under the chromium project
      testIgnore: /visual-baseline/,
    },
  ],
});
