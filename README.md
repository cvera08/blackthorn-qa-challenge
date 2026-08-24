# Blackthorn QA Challenge: E-Commerce Platform Testing

Playwright + TypeScript automation for the Senior QA Engineer take-home challenge, testing [saucedemo.com](https://www.saucedemo.com).

## What's here

- `docs/test-plan.md`: scope, approach, risks, entry/exit criteria, environment requirements
- `docs/test-scenarios.md`: Gherkin scenarios (positive, negative, edge cases)
- `pages/`: Page Object Model for login, inventory, cart and checkout
- `tests/`: Playwright specs (UI) plus `tests/api/` for API-level checks
- `playwright.config.ts`: cross-browser config (Chromium, Firefox, WebKit)

## Install dependencies

```bash
npm install
npx playwright install --with-deps
```

## Run tests

```bash
npx playwright test              # run everything, headless, all three browsers
npx playwright test --headed     # watch the browser while it runs
npx playwright test --ui         # interactive UI mode
npx playwright show-report       # open the HTML report from the last run
```

Run a single file or browser:

```bash
npx playwright test tests/login.spec.ts
npx playwright test --project=chromium
```

## Local test run

```
$ npx playwright test

Running 48 tests using 3 workers (chromium, firefox, webkit)

  48 passed (20.3s)
```

A CI run (GitHub Actions) with a status badge pointing at this repo is next on the list.

## Assumptions and limitations

- SauceDemo doesn't expose a public API, so the API suite (`tests/api/products-api.spec.ts`) exercises a public product-catalog API (Fake Store API) instead, to demonstrate API-level test design with Playwright's request context. It's a substitute, not a test of SauceDemo itself.
- `InventoryPage`/`CartPage` build selectors from the product name (e.g. `Sauce Labs Backpack` → `add-to-cart-sauce-labs-backpack`), matching SauceDemo's `data-test` naming convention. This holds for every product used in the tests but isn't guaranteed for catalog items with punctuation in the name.
- Tests assume the seeded demo accounts (`standard_user`, `locked_out_user`, password `secret_sauce` for both) stay available and unchanged, since there's no way to provision test data on a public demo site.
- No CI pipeline is included. `retries` and `workers` in `playwright.config.ts` are gated on `process.env.CI` so the suite behaves the same locally and would need minimal changes to run in one (GitHub Actions, etc.).
