import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * waitForTableLoading
 * -------------------
 * Ensures the table has fully loaded after the provided API call.
 *
 * Steps:
 * - Wait for table to be visible.
 * - Wait for loading spinner to appear.
 * - Wait for the API call to finish.
 * - Wait for spinner to disappear.
 * - Validate the final table state (rows or empty state).
 *
 * Fails if:
 * - Table/spinner never appears or disappears.
 * - API call fails.
 * - Table ends in an invalid state (no rows & no empty state).
 */
export async function waitForTableLoading(
  page: Page,
  apiCallPromise: Promise<unknown>
) {
  const table = page.locator(".ant-table");
  await expect(table).toBeVisible();

  const spinner = page.locator(".ant-spin");

  await spinner.waitFor({ state: "attached" });
  await apiCallPromise;
  await spinner.waitFor({ state: "detached" });

  await validateTableState(page);
}

/**
 * validateTableState
 * ------------------
 * Confirms the table has either:
 * - At least one row, OR
 * - A visible empty state.
 *
 * Fails if neither appears.
 */
export async function validateTableState(page: Page) {
  const firstRow = page.locator(".ant-table-row").first();
  const emptyState = page.locator(".ant-table-empty");

  await Promise.race([
    firstRow.waitFor({ state: "visible" }),
    emptyState.waitFor({ state: "visible" }),
  ]).catch(() => {
    throw new Error(
      "❌ Table is invalid: no rows and no empty state appeared."
    );
  });

  const rowCount = await page.locator(".ant-table-row").count();
  if (rowCount === 0) {
    await expect(emptyState).toBeVisible();
  }
}
