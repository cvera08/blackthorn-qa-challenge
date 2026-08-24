import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const VALID_PASSWORD = 'secret_sauce';

test.describe('Login', () => {
  test('standard user logs in and lands on the inventory page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('standard_user', VALID_PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('rejects an invalid username/password combination', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('standard_user', 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('do not match any user');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('blocks a locked out user with a clear error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('locked_out_user', VALID_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('has been locked out');
  });

  test('rejects an empty username field', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('', VALID_PASSWORD);

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });
});
