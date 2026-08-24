# Test Plan: E-Commerce Platform Testing (SauceDemo)

## 1. Scope and objectives

This plan covers the core purchase flow of the SauceDemo demo application: login, product listing, cart management, and checkout. The objective is to confirm that a standard user can browse products, manage a cart, and complete a purchase, and that the application handles bad input and edge conditions without breaking the flow.

In scope:
- Login (valid credentials, invalid credentials, locked-out user, missing fields)
- Product listing and add/remove to cart
- Cart contents accuracy
- Checkout (customer info form, order summary, confirmation)
- A handful of edge cases: empty cart, refresh persistence, direct URL access without a session

Out of scope for this exercise:
- Visual regression testing (SauceDemo ships a few users, like `visual_user`, meant for this, but it's a separate concern from functional testing)
- Payment processing, since SauceDemo doesn't integrate a real payment gateway
- Load and performance testing
- Full cross-account testing of every seeded user (`problem_user`, `performance_glitch_user`, etc.), beyond `locked_out_user` which is directly relevant to login validation

## 2. Test approach

**Functional testing:** scenario-based, following the real user journey from login through order confirmation. Positive paths validate the happy flow; negative paths validate that the app rejects bad input with a useful message instead of failing silently or crashing.

**UI validation:** assertions target user-visible state (URL, error text, cart badge count, item names on screen) rather than internal implementation details. Locators favor `data-test` attributes where SauceDemo provides them, since those are far less likely to break on a CSS refactor than class-based selectors.

**Integration considerations:** SauceDemo is a self-contained demo app with no real backend to integrate against, so there's no service boundary to test here beyond the browser-to-app interaction itself.

**API validation:** SauceDemo doesn't expose a public API, so a separate suite exercises a public product-catalog API (Fake Store API) using Playwright's request context. This is meant to demonstrate API-level test design, not to validate SauceDemo itself, and is documented as a substitute in the README.

## 3. Risk assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Selectors break if SauceDemo's markup changes | Medium | Medium | Favor `data-test` attributes over CSS classes; centralize selectors in Page Objects so a markup change means editing one file |
| Flaky tests from network/demo-site latency | Medium | Low | Use Playwright's auto-waiting assertions instead of fixed sleeps; retry once in CI |
| Cart/session state leaking between tests | Low | Medium | Each test gets a fresh browser context by default; no shared state across tests |
| Public third-party API (Fake Store API) changes shape or goes down | Low | Low | API suite is isolated from the UI suite and documented as best-effort; a failure there shouldn't block release sign-off on the core UI flow |

## 4. Entry and exit criteria

**Entry criteria:**
- SauceDemo (https://www.saucedemo.com) is reachable and the standard test credentials work
- Test environment has Node, Playwright, and browser binaries installed

**Exit criteria:**
- All test scenarios in this plan pass across Chromium, Firefox, and WebKit
- No known critical defect is open in the core login-to-checkout flow
- Any skipped or deferred scenario is documented with a reason

## 5. Environment requirements

- **Browsers:** Chromium, Firefox, WebKit (configured as separate Playwright projects, run in parallel)
- **Test data:** the seeded SauceDemo accounts (`standard_user`, `locked_out_user`), all with password `secret_sauce`; no test data setup/teardown needed since SauceDemo resets state per session
- **Tooling:** Playwright Test with TypeScript, Page Object Model for maintainability, HTML reporter for local review of failures (screenshots and video on failure)
