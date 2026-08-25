# Test Scenarios (Gherkin)

## Positive scenarios

### Scenario: Successful login
```
Given I am on the login page
When I log in with valid credentials
Then I should see the products page
```

### Scenario: Add a product to the cart
```
Given I am logged in and on the products page
When I add "Sauce Labs Backpack" to the cart
Then the cart badge should show 1 item
```

### Scenario: Remove a product from the cart
```
Given I have "Sauce Labs Backpack" in my cart
When I remove it from the cart
Then the cart badge should no longer be visible
```

### Scenario: Cart reflects the products I added
```
Given I am logged in and on the products page
When I add "Sauce Labs Backpack" and "Sauce Labs Bike Light" to the cart
And I go to the cart page
Then I should see both products listed
```

### Scenario: Complete checkout with valid information
```
Given I have at least one product in my cart
And I am on the checkout information step
When I fill in a valid first name, last name and postal code
And I continue to the order overview
And I finish the order
Then I should see the order confirmation message "Thank you for your order!"
```

## Negative scenarios

### Scenario: Invalid login credentials
```
Given I am on the login page
When I log in with a valid username and an incorrect password
Then I should see an error message stating the credentials do not match
And I should remain on the login page
```

### Scenario: Locked out user cannot log in
```
Given I am on the login page
When I log in as "locked_out_user"
Then I should see an error message stating the user has been locked out
```

### Scenario: Checkout blocked when postal code is missing
```
Given I have at least one product in my cart
And I am on the checkout information step
When I leave the postal code empty and continue
Then I should see an error message stating the postal code is required
And I should remain on the checkout information step
```

## Edge cases

### Scenario: Empty cart shows no items
```
Given I am logged in and have not added any products
When I go to the cart page
Then the cart should contain 0 items
```

### Scenario: Cart contents survive a page refresh
```
Given I have added a product to my cart
When I refresh the page
Then the cart badge should still show 1 item
```

### Scenario: Direct access to the products page without a session is blocked
```
Given I am not logged in
When I navigate directly to the inventory page URL
Then I should be redirected to the login page
And I should see an error message explaining I need to log in first
```

## Manual test case

Found while exploring the checkout flow by hand, not automated (see the README's "Manual testing note" for why).

### TC-01: Checkout completes with an empty cart

| | |
|---|---|
| **Preconditions** | Logged in as a standard user, cart is empty |
| **Steps** | 1. Go directly to the cart page (`/cart.html`)<br>2. Click "Checkout" with 0 items in the cart<br>3. Fill in first name, last name and postal code, continue<br>4. Click "Finish" |
| **Expected** | The app should prevent checkout with no items, or at least warn before placing an empty order |
| **Actual** | Checkout proceeds through both steps with no warning, order overview shows "Total: $0.00", and the order completes with "Thank you for your order!" |
| **Severity** | Low on this demo (no crash, no data loss, no real fulfillment behind it). On a production e-commerce site the same gap would rate Medium: a $0.00 order can pollute reporting, trip up fulfillment, and skew order metrics |
