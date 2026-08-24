import { test, expect } from '@playwright/test';

/**
 * SauceDemo has no public API of its own, so this suite validates a public
 * e-commerce API (Fake Store API) using Playwright's request context, as
 * allowed by the challenge brief. It stands in for the kind of contract
 * checks you'd run against a real product catalog service.
 */
test.describe('Product catalog API', () => {
  test('GET /products returns a non-empty list with the expected shape', async ({ request }) => {
    const response = await request.get('https://fakestoreapi.com/products');

    expect(response.status()).toBe(200);

    const products = await response.json();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    const [first] = products;
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('title');
    expect(first).toHaveProperty('price');
    expect(typeof first.price).toBe('number');
  });

  test('GET /products/:id returns a single matching product', async ({ request }) => {
    const response = await request.get('https://fakestoreapi.com/products/1');

    expect(response.status()).toBe(200);

    const product = await response.json();
    expect(product.id).toBe(1);
    expect(product.price).toBeGreaterThan(0);
  });

  test('GET /products/:id returns 404 shape for a non-existent id gracefully', async ({ request }) => {
    const response = await request.get('https://fakestoreapi.com/products/999999');

    // Fake Store API returns 200 with an empty body for unknown ids rather
    // than a 404; asserting on that quirk instead of assuming REST
    // conventions, since real APIs vary here too.
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body === '' || body === 'null').toBe(true);
  });
});
