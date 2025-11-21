import type { Page } from "@playwright/test";
import { waitForTableLoading } from "../../helpers/list-view/list-view.util";

export class AccountsPage {
  constructor(private page: Page) {}

  async waitForAccountsTable() {
    const accountsTablePromise = this.page.waitForResponse((response) => {
      const request = response.request();
      return (
        request.method() === "POST" &&
        response.url().includes("/accounts/query") &&
        response.ok()
      );
    });

    await waitForTableLoading(this.page, accountsTablePromise);
  }

  async getFirstAccountName() {
    const firstAccountLink = this.page.locator("#accountName-value").first();
    return await firstAccountLink.textContent();
  }

  async clickFirstAccount() {
    const firstAccountLink = this.page.locator("#accountName-value").first();
    await firstAccountLink.click();

    await this.page.waitForURL(/\/accounts\/[0-9a-fA-F-]{36}$/);

    const currentUrl = this.page.url();
    const accountId = currentUrl.split("/").pop();

    return accountId!;
  }
}
