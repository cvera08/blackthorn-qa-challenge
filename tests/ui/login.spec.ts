import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { STANDARD_USERNAME, STANDARD_PASSWORD, LOCKED_OUT_USERNAME } from '../../fixtures/credentials';

test.describe('Login', () => {
  test('standard user logs in and lands on the inventory page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(STANDARD_USERNAME, STANDARD_PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('rejects an invalid username/password combination', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Deliberately wrong password, not a real credential, kept inline on purpose.
    await loginPage.login(STANDARD_USERNAME, 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('do not match any user');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('blocks a locked out user with a clear error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(LOCKED_OUT_USERNAME, STANDARD_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('has been locked out');
  });

  test('rejects an empty username field', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Deliberately blank input, not a real credential, kept inline on purpose.
    await loginPage.login('', STANDARD_PASSWORD);

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });
});
