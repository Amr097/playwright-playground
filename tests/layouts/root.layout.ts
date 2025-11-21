import type { Page } from "@playwright/test";
import path from "path";

type ModuleName =
  | "accounts"
  | "couriers"
  | "warehouses"
  | "sales-orders"
  | "subscriptions";

export class rootLayout {
  constructor(private page: Page) {}

  async gotoModule(module: ModuleName) {
    await this.page.goto("/");
    await this.page.click(`#nav-item-${module}`);
    await this.page.waitForURL(`**/${module}`);
  }
}
