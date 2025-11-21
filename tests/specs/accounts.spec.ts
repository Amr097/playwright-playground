import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

test("logs in and checks dashboard title", async ({
  rootLayout,
  accountsPage,
  accountsDetailsPage,
}) => {
  await rootLayout.gotoModule("accounts");

  await accountsPage.waitForAccountsTable();

  const accountName = await accountsPage.getFirstAccountName();
  const accountId = await accountsPage.clickFirstAccount();

  await accountsDetailsPage.waitForAccountDetails(accountId);
  await accountsDetailsPage.expectTitleToMatch(accountName!);
  expect(true).toBeTruthy();
});
