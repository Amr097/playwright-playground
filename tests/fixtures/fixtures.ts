import { test as base } from "@playwright/test";
import { rootLayout } from "../layouts/root.layout";
import { AccountsPage } from "../pages/accounts/accounts-list-view.page";
import { AccountDetailsPage } from "../pages/accounts/account-details.page";
export const test = base.extend<{
  rootLayout: rootLayout;
  accountsPage: AccountsPage;
  accountsDetailsPage: AccountDetailsPage;
}>({
  rootLayout: async ({ page }, use) => {
    await use(new rootLayout(page));
  },
  accountsPage: async ({ page }, use) => {
    await use(new AccountsPage(page));
  },

  accountsDetailsPage: async ({ page }, use) => {
    await use(new AccountDetailsPage(page));
  },
});

export const expect = test.expect;
