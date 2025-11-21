import { test, expect } from "@playwright/test";

test("logs in and checks dashboard title", async ({ page }) => {
  await page.goto("/");

  await page.click("#nav-item-accounts");

  const accountsTablePromise = page.waitForResponse((response) => {
    const request = response.request();
    return (
      request.method() === "POST" && // filter by method
      response.url().includes("/accounts/query") &&
      response.ok()
    );
  });

  await page.waitForURL("http://localhost:3000/accounts");

  // Wait for the table to appear
  const table = page.locator(".ant-table");
  await expect(table).toBeVisible();

  // Wait for API response
  await accountsTablePromise;

  await expect(page.locator(".ant-spin")).toHaveCount(0); // spinner gone
  const rows = page.locator(".ant-table-row");
  // Wait until at least one row appears
  await expect(rows.first()).toBeVisible();

  // Get the text value of the first account name link
  const firstAccountLink = page.locator("#accountName-value").first();
  const accountName = await firstAccountLink.textContent();

  const accountDetailsPromise = (accountId) =>
    page.waitForResponse((response) => {
      const request = response.request();
      return (
        request.method() === "GET" && // filter by method
        response.url().includes(`/accounts/${accountId}`) &&
        response.ok()
      );
    });

  // Click the link
  await firstAccountLink.click();

  // ✅ Wait for navigation to /accounts/:id
  await page.waitForURL(/\/accounts\/[0-9a-fA-F-]{36}$/);

  // Get the current URL
  const currentUrl = page.url();

  // Extract the account ID (UUID)
  const accountId = currentUrl.split("/").pop();
  console.log("Account ID:", accountId);
  console.log("URL", `/accounts/${accountId}`);

  await accountDetailsPromise(accountId);

  // Verify that the page title or heading matches the clicked account name
  await expect(page.locator("h4")).toHaveText(
    new RegExp(accountName!.trim(), "i"),
  );
});
