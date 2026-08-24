import { Page, Locator } from '@playwright/test';

/**
 * Page Object covering all three checkout steps:
 * /checkout-step-one.html (info), /checkout-step-two.html (overview),
 * /checkout-complete.html (confirmation).
 */
export class CheckoutPage {
  readonly page: Page;

  // Step one: customer info
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step two: order overview
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly summaryItems: Locator;
  readonly summaryTotalLabel: Locator;

  // Complete
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.errorMessage = page.locator('[data-test="error"]');

    this.finishButton = page.locator('#finish');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.summaryItems = page.locator('.cart_item');
    this.summaryTotalLabel = page.locator('.summary_total_label');

    this.completeHeader = page.locator('.complete-header');
  }

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }
}
