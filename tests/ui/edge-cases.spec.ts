import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { STANDARD_USERNAME, STANDARD_PASSWORD } from '../../fixtures/credentials';

test.describe('Edge cases', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(STANDARD_USERNAME, STANDARD_PASSWORD);
  });

  test('cart page shows no items and no badge when nothing was added', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await expect(inventoryPage.cartBadge).toHaveCount(0);

    await inventoryPage.goToCart();

    expect(await cartPage.itemCount()).toBe(0);
  });

  test('cart contents survive a page refresh', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCart('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await page.reload();

    // SauceDemo persists cart state client-side; a refresh should not
    // silently drop items from the badge count.
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('adding multiple distinct items keeps an accurate running count', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Bike Light');
    await inventoryPage.addToCart('Sauce Labs Bolt T-Shirt');

    await expect(inventoryPage.cartBadge).toHaveText('3');
  });
});

test('an unauthenticated session cannot reach the inventory page directly', async ({ page }) => {
  await page.goto('/inventory.html');

  // SauceDemo redirects straight back to the login page rather than
  // rendering the error on the /inventory.html URL itself.
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.locator('[data-test="error"]')).toContainText('You can only access');
});
