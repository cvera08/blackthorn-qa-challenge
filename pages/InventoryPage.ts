import { Page, Locator } from '@playwright/test';

/**
 * Page Object for the product listing screen (/inventory.html).
 *
 * Assumption: SauceDemo's "add to cart" / "remove" buttons follow the
 * data-test="add-to-cart-<slugified-name>" convention for the standard
 * catalog. slugify() covers the products used in these tests; it is not
 * guaranteed to hold for every item in the catalog (e.g. names with
 * punctuation like parentheses), which is noted as a limitation in the README.
 */
export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly inventoryItemNames: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.inventoryItemNames = page.locator('.inventory_item_name');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  private slugify(productName: string): string {
    return productName.toLowerCase().replace(/\s+/g, '-');
  }

  addToCartButton(productName: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${this.slugify(productName)}"]`);
  }

  removeButton(productName: string): Locator {
    return this.page.locator(`[data-test="remove-${this.slugify(productName)}"]`);
  }

  async addToCart(productName: string) {
    await this.addToCartButton(productName).click();
  }

  async removeFromCart(productName: string) {
    await this.removeButton(productName).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async cartCount(): Promise<number> {
    if (await this.cartBadge.count() === 0) return 0;
    return Number(await this.cartBadge.innerText());
  }
}
