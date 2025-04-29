# Unit Test Cases for Backend MongoDB Express API

| Test Case Id | Description | Input | Expected Result | Actual Outcome | Pass/Fail | Duration |
|-------------|-------------|-------|-----------------|----------------|-----------|----------|
| AUTH-001 | Register a new user with valid data | ```javascript
const response = await request(app)
  .post('/api/v1/auth/register')
  .send({
    email: "test@example.com",
    password: "password123",
    name: "Test User"
  });
``` | Status 200, token returned in response | ```javascript
{
  status: 200,
  body: {
    success: true,
    message: "Register successfully",
    data: "mock-token"
  }
}
``` | Pass | 134ms |
| AUTH-002 | Login with valid credentials | ```javascript
const response = await request(app)
  .post('/api/v1/auth/login')
  .send({
    email: "test@example.com",
    password: "password123"
  });
``` | Status 200, user object and token returned | ```javascript
{
  status: 200,
  body: {
    success: true,
    message: "Login successfully",
    data: {
      user: {
        _id: "user-id",
        name: "Test User",
        email: "test@example.com",
        // other user fields
      },
      token: "mock-token"
    }
  }
}
``` | Pass | 121ms |
| AUTH-003 | Register with existing email | ```javascript
const response = await request(app)
  .post('/api/v1/auth/register')
  .send({
    email: "test@example.com",
    password: "password123",
    name: "Test User"
  });
``` | Status 500, error message "User already exists" | ```javascript
{
  status: 500,
  body: {
    success: false,
    error: "User already exists"
  }
}
``` | Pass | 51ms |
| AUTH-004 | Login with invalid credentials | ```javascript
const response = await request(app)
  .post('/api/v1/auth/login')
  .send({
    email: "test@example.com",
    password: "wrongpassword"
  });
``` | Status 500, error message "Invalid credentials" | ```javascript
{
  status: 500,
  body: {
    success: false,
    error: "Invalid credentials"
  }
}
``` | Pass | 124ms |
| PROD-001 | Get all products | ```javascript
const response = await request(app)
  .get('/api/v1/products');
``` | Status 200, array of products | ```javascript
{
  status: 200,
  body: {
    success: true,
    data: [
      // Array of product objects
      {
        _id: "product-id",
        name: "Product 1",
        price: 99.99,
        // other product fields
      },
      // more products
    ]
  }
}
``` | Pass | 99ms |
| PROD-002 | Get product by ID | ```javascript
const response = await request(app)
  .get(`/api/v1/products/${productId}`);
``` | Status 200, product object | ```javascript
{
  status: 200,
  body: {
    success: true,
    data: {
      _id: "product-id",
      name: "Test Product",
      price: 99.99,
      // other product fields
    }
  }
}
``` | Pass | 35ms |
| PROD-003 | Create new product with valid data | ```javascript
const response = await request(app)
  .post('/api/v1/products')
  .send({
    name: "New Product",
    price: 99.99,
    category: categoryId,
    pictureURL: "http://example.com/image.jpg",
    amountInStore: 10
  });
``` | Status 201, created product returned | ```javascript
{
  status: 201,
  body: {
    success: true,
    message: "Product created successfully",
    data: {
      _id: "new-product-id",
      name: "New Product",
      price: 99.99,
      // other product fields
    }
  }
}
``` | Pass | 45ms |
| PROD-004 | Create product with missing required fields | ```javascript
const response = await request(app)
  .post('/api/v1/products')
  .send({
    name: "Incomplete Product"
    // Missing required fields
  });
``` | Status 400, error message about missing fields | ```javascript
{
  status: 400,
  body: {
    success: false,
    message: "Missing required fields"
  }
}
``` | Pass | 38ms |
| PROD-005 | Update product with valid data | ```javascript
const response = await request(app)
  .put(`/api/v1/products/${productId}`)
  .send({
    price: 89.99,
    description: "Updated description"
  });
``` | Status 200, updated product returned | ```javascript
{
  status: 200,
  body: {
    success: true,
    message: "Product updated successfully",
    data: {
      _id: "product-id",
      name: "Test Product",
      price: 89.99,
      description: "Updated description",
      // other product fields
    }
  }
}
``` | Pass | 40ms |
| PROD-006 | Delete product | ```javascript
const response = await request(app)
  .delete(`/api/v1/products/${productId}`);
``` | Status 200, deleted product returned | ```javascript
{
  status: 200,
  body: {
    success: true,
    message: "Product deleted successfully",
    data: {
      _id: "product-id",
      name: "Test Product",
      // other product fields
    }
  }
}
``` | Pass | 36ms |
| CAT-001 | Get all categories | ```javascript
const response = await request(app)
  .get('/api/v1/category');
``` | Status 200, array of categories | ```javascript
{
  status: 200,
  body: {
    success: true,
    data: [
      // Array of category objects
      {
        _id: "category-id",
        name: "Category 1"
      },
      // more categories
    ]
  }
}
``` | Pass | 30ms |
| CAT-002 | Get category by ID | ```javascript
const response = await request(app)
  .get(`/api/v1/category/${categoryId}`);
``` | Status 200, category object | ```javascript
{
  status: 200,
  body: {
    success: true,
    data: {
      _id: "category-id",
      name: "Test Category"
    }
  }
}
``` | Pass | 28ms |
| CAT-003 | Create new category with valid data | ```javascript
const response = await request(app)
  .post('/api/v1/category')
  .send({
    name: "New Category"
  });
``` | Status 201, created category returned | ```javascript
{
  status: 201,
  body: {
    success: true,
    message: "Category created successfully",
    data: {
      _id: "new-category-id",
      name: "New Category"
    }
  }
}
``` | Pass | 32ms |
| CAT-004 | Create category with missing name | ```javascript
const response = await request(app)
  .post('/api/v1/category')
  .send({});
``` | Status 400, error message "Name is required" | ```javascript
{
  status: 400,
  body: {
    success: false,
    error: "Name is required"
  }
}
``` | Pass | 25ms |
| CART-001 | Add item to cart | ```javascript
const response = await request(app)
  .post('/api/v1/cart')
  .send({
    productId: productId,
    quantity: 2
  });
``` | Status 200, updated cart returned | ```javascript
{
  status: 200,
  body: {
    success: true,
    data: {
      message: "Product added to cart successfully"
    }
  }
}
``` | Pass | 55ms |
| CART-002 | Get user's cart | ```javascript
const response = await request(app)
  .get('/api/v1/cart');
``` | Status 200, cart items returned | ```javascript
{
  status: 200,
  body: {
    success: true,
    data: {
      message: "Cart fetched successfully",
      items: [
        // Array of cart items
      ]
    }
  }
}
``` | Pass | 48ms |
| CART-003 | Update cart item quantity | ```javascript
const response = await request(app)
  .put('/api/v1/cart')
  .send({
    productId: productId,
    quantity: 3
  });
``` | Status 200, updated cart returned | ```javascript
{
  status: 200,
  body: {
    success: true,
    data: {
      message: "Cart updated successfully"
    }
  }
}
``` | Pass | 52ms |
| CART-004 | Remove item from cart | ```javascript
const response = await request(app)
  .delete('/api/v1/cart')
  .send({
    productId: productId
  });
``` | Status 200, updated cart returned | ```javascript
{
  status: 200,
  body: {
    success: true,
    data: {
      message: "Product removed from cart successfully"
    }
  }
}
``` | Pass | 50ms |
| ORDER-001 | Create new order | ```javascript
// First add items to cart
await Cart.create({
  userId: userId,
  productId: productId,
  quantity: 2
});

const response = await request(app)
  .post('/api/v1/orders')
  .send({});
``` | Status 201, created order returned | ```javascript
{
  status: 201,
  body: {
    success: true,
    // Order data
  }
}
``` | Pass | 75ms |
| ORDER-002 | Get user's orders | ```javascript
const response = await request(app)
  .get('/api/v1/orders');
``` | Status 200, array of orders | ```javascript
{
  status: 200,
  body: {
    success: true,
    data: [
      // Array of order objects
    ]
  }
}
``` | Pass | 45ms |
| ORDER-003 | Get order by ID | ```javascript
const response = await request(app)
  .get(`/api/v1/orders/${orderId}`);
``` | Status 200, order object | ```javascript
{
  status: 200,
  body: {
    success: true,
    data: {
      _id: "order-id",
      // Order details
    }
  }
}
``` | Pass | 40ms |
| ORDER-004 | Update order status (admin only) | ```javascript
const response = await request(app)
  .put(`/api/v1/orders/${orderId}/status`)
  .send({
    status: "processing"
  });
``` | Status 200, updated order returned | ```javascript
{
  status: 200,
  body: {
    success: true,
    // Updated order data
  }
}
``` | Pass | 38ms |
| USER-001 | Get user profile | ```javascript
const response = await request(app)
  .get('/api/v1/user/profile');
``` | Status 200, user profile returned | ```javascript
{
  status: 200,
  body: {
    success: true,
    data: {
      _id: "user-id",
      name: "Test User",
      email: "user@example.com",
      // Other user fields excluding password
    }
  }
}
``` | Pass | 35ms |
| USER-002 | Update user profile | ```javascript
const response = await request(app)
  .put('/api/v1/user/profile')
  .send({
    name: "Updated Name",
    phone: "1234567890",
    address: "456 New St"
  });
``` | Status 200, updated user profile returned | ```javascript
{
  status: 200,
  body: {
    success: true,
    data: {
      _id: "user-id",
      name: "Updated Name",
      phone: "1234567890",
      address: "456 New St",
      // Other user fields
    }
  }
}
``` | Pass | 42ms |
| USER-003 | Change password | ```javascript
const response = await request(app)
  .put('/api/v1/user/change-password')
  .send({
    currentPassword: "password123",
    newPassword: "newpassword123"
  });
``` | Status 200, success message | ```javascript
{
  status: 200,
  body: {
    success: true,
    message: "Password changed successfully"
  }
}
``` | Pass | 120ms |
| STATS-001 | Get all statistics | ```javascript
const response = await request(app)
  .get('/api/v1/stats');
``` | Status 200, statistics of all data | ```javascript
{
  status: 200,
  body: {
    success: true,
    message: "Statistics fetched successfully",
    data: {
      counts: {
        users: 2,
        products: 3,
        categories: 2,
        orders: 2
      },
      data: {
        users: [...],
        products: [...],
        categories: [...],
        orders: [...]
      },
      analytics: {
        totalRevenue: 2559.96,
        productsByCategory: {
          "Electronics": 2,
          "Clothing": 1
        },
        ordersByStatus: {
          "completed": 1,
          "pending": 1
        }
      }
    }
  }
}
``` | Pass | 140ms |
| STATS-002 | Non-admin access denied | ```javascript
// Override the mock to simulate a non-admin user
const authMiddleware = require('../src/middleware/auth.middleware');
authMiddleware.authenticate.mockImplementationOnce((req, res, next) => {
  req.user = { id: mockUserId.toString(), email: 'user@example.com', isAdmin: false };
  next();
});

const response = await request(app)
  .get('/api/v1/stats');
``` | Status 403, access denied message | ```javascript
{
  status: 403,
  body: {
    success: false,
    message: "Access denied. Admin only."
  }
}
``` | Pass | 10ms |