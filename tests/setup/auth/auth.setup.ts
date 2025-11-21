import { test as setup } from "@playwright/test";
import path from "path";
// import fs from "fs";
import data from "../../data/data.json";

const authFile = path.join(__dirname, "../../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  // if (fs.existsSync(authFile)) {
  //   console.log("✅ Auth file already exists, skipping login...");
  //   return;
  // }

  // console.log("🔐 Running authentication setup...");

  await page.goto(`${data.baseURL}/login`);

  const { username, password } = data.credentials;

  await page.fill("#username-input", username);
  await page.fill("#password-input", password);

  await page.click("#login-submit-button");

  // Must wait for baseURL, not hardcoded
  await page.waitForURL(`${data.baseURL}/`);

  // Save session
  await page.context().storageState({ path: authFile });
});
