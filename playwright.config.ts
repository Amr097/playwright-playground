import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, ".env.test"),
});

export const STORAGE_STATE = path.join(
  __dirname,
  "./tests/playwright/.auth/user.json"
);

export default defineConfig({
  testDir: "./tests",

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  use: {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },
  retries: 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testMatch: ["**/*.setup.ts"],
    },

    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Use prepared auth state.
        storageState: STORAGE_STATE,
      },
      dependencies: ["setup"],
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        // Use prepared auth state.
        storageState: STORAGE_STATE,
      },
      dependencies: ["setup"],
    },
  ],
});
