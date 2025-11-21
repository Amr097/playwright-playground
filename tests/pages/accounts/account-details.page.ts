import { expect, Page } from "@playwright/test";

export class AccountDetailsPage {
  constructor(private page: Page) {}

  async waitForAccountDetails(accountId: string) {
    await this.page.waitForResponse((response) => {
      const request = response.request();
      return (
        request.method() === "GET" &&
        response.url().includes(`/accounts/${accountId}`) &&
        response.ok()
      );
    });
  }

  async expectTitleToMatch(name: string) {
    await expect(this.page.locator("h4")).toHaveText(
      new RegExp(name.trim(), "i"),
    );
  }
}
