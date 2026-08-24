import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { STANDARD_USERNAME, STANDARD_PASSWORD } from '../../fixtures/credentials';

const PRODUCT = 'Sauce Labs Backpack';

test.describe('Cart and checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(STANDARD_USERNAME, STANDARD_PASSWORD);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('adds a product to the cart and updates the badge count', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCart(PRODUCT);

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('removes a product from the cart from the inventory page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCart(PRODUCT);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart(PRODUCT);

    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });

  test('cart page reflects the items added on the inventory page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addToCart(PRODUCT);
    await inventoryPage.addToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();

    const names = await cartPage.itemNames();
    expect(names).toEqual(expect.arrayContaining([PRODUCT, 'Sauce Labs Bike Light']));
    expect(await cartPage.itemCount()).toBe(2);
  });

  test('completes checkout end to end with valid customer info', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart(PRODUCT);
    await inventoryPage.goToCart();
    await cartPage.checkoutButton.click();

    await checkoutPage.fillCustomerInfo('Carlos', 'Vera', '11300');
    await checkoutPage.continueButton.click();

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutPage.summaryTotalLabel).toBeVisible();

    await checkoutPage.finishButton.click();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('blocks checkout when required customer info is missing', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart(PRODUCT);
    await inventoryPage.goToCart();
    await cartPage.checkoutButton.click();

    // Postal code left blank on purpose.
    await checkoutPage.fillCustomerInfo('Carlos', 'Vera', '');
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});
