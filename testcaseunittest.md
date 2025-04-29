# Unit Test Cases for Backend MongoDB Express API

| Test Case Id | Description | Input | Expected Result | Actual Outcome | Pass/Fail |
|-------------|-------------|-------|-----------------|----------------|-----------|
| AUTH-001 | Register a new user with valid data | `POST /api/v1/auth/register` with body: `{ "email": "test@example.com", "password": "password123", "name": "Test User" }` | Status 200, token returned in response | Status 200, token returned in response | Pass |
| AUTH-002 | Login with valid credentials | `POST /api/v1/auth/login` with body: `{ "email": "test@example.com", "password": "password123" }` | Status 200, user object and token returned | Status 200, user object and token returned | Pass |
| AUTH-003 | Register with existing email | `POST /api/v1/auth/register` with body: `{ "email": "test@example.com", "password": "password123", "name": "Test User" }` | Status 500, error message "User already exists" | Status 500, error message "User already exists" | Pass |
| AUTH-004 | Login with invalid credentials | `POST /api/v1/auth/login` with body: `{ "email": "test@example.com", "password": "wrongpassword" }` | Status 500, error message "Invalid credentials" | Status 500, error message "Invalid credentials" | Pass |
| PROD-001 | Get all products | `GET /api/v1/products` | Status 200, array of products | Status 200, array of products | Pass |
| PROD-002 | Get product by ID | `GET /api/v1/products/:id` with valid product ID | Status 200, product object | Status 200, product object | Pass |
| PROD-003 | Create new product with valid data | `POST /api/v1/products` with valid token and body: `{ "name": "Test Product", "price": 99.99, "category": "validCategoryId", "pictureURL": "http://example.com/image.jpg", "amountInStore": 10 }` | Status 201, created product returned | Status 201, created product returned | Pass |
| PROD-004 | Create product with missing required fields | `POST /api/v1/products` with valid token and body: `{ "name": "Test Product" }` | Status 400, error message about missing fields | Status 400, error message about missing fields | Pass |
| PROD-005 | Update product with valid data | `PUT /api/v1/products/:id` with valid token and body: `{ "price": 89.99 }` | Status 200, updated product returned | Status 200, updated product returned | Pass |
| PROD-006 | Delete product | `DELETE /api/v1/products/:id` with valid token | Status 200, deleted product returned | Status 200, deleted product returned | Pass |
| CAT-001 | Get all categories | `GET /api/v1/category` | Status 200, array of categories | Status 200, array of categories | Pass |
| CAT-002 | Get category by ID | `GET /api/v1/category/:id` with valid category ID | Status 200, category object | Status 200, category object | Pass |
| CAT-003 | Create new category with valid data | `POST /api/v1/category` with valid token and body: `{ "name": "Test Category" }` | Status 201, created category returned | Status 201, created category returned | Pass |
| CAT-004 | Create category with missing name | `POST /api/v1/category` with valid token and body: `{}` | Status 400, error message "Name is required" | Status 400, error message "Name is required" | Pass |
| CART-001 | Add item to cart | `POST /api/v1/cart` with valid token and body: `{ "productId": "validProductId", "quantity": 2 }` | Status 200, updated cart returned | Status 200, message "Product added to cart successfully" | Pass |
| CART-002 | Get user's cart | `GET /api/v1/cart` with valid token | Status 200, cart items returned | Status 200, message "Cart fetched successfully" | Pass |
| CART-003 | Update cart item quantity | `PUT /api/v1/cart` with valid token and body: `{ "productId": "validProductId", "quantity": 3 }` | Status 200, updated cart returned | Status 200, message "Cart updated successfully" | Pass |
| CART-004 | Remove item from cart | `DELETE /api/v1/cart` with valid token and body: `{ "productId": "validProductId" }` | Status 200, updated cart returned | Status 200, message "Product removed from cart successfully" | Pass |
| ORDER-001 | Create new order | `POST /api/v1/orders` with valid token and items in cart | Status 201, created order returned | Status 201, created order returned | Pass |
| ORDER-002 | Get user's orders | `GET /api/v1/orders` with valid token | Status 200, array of orders | Status 200, array of orders | Pass |
| ORDER-003 | Get order by ID | `GET /api/v1/orders/:id` with valid token and order ID | Status 200, order object | Status 200, order object | Pass |
| ORDER-004 | Update order status (admin only) | `PUT /api/v1/orders/:id/status` with admin token and body: `{ "status": "processing" }` | Status 200, updated order returned | Status 200, updated order returned | Pass |
| USER-001 | Get user profile | `GET /api/v1/user/profile` with valid token | Status 200, user profile returned | Status 200, user profile returned | Pass |
| USER-002 | Update user profile | `PUT /api/v1/user/profile` with valid token and body: `{ "name": "Updated Name", "phone": "1234567890" }` | Status 200, updated user profile returned | Status 200, updated user profile returned | Pass |
| USER-003 | Change password | `PUT /api/v1/user/change-password` with valid token and body: `{ "currentPassword": "password123", "newPassword": "newpassword123" }` | Status 200, success message | Status 200, success message | Pass |
