const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const cartRoutes = require('../src/routes/cart.routes');
const Cart = require('../src/models/cart.model');
const Product = require('../src/models/product.model');
const User = require('../src/models/user.model');
const Category = require('../src/models/category.model');

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/v1', cartRoutes);

// Mock response utility functions
jest.mock('../src/utils/response', () => ({
  successResponse: (res, data, message = '', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  },
  errorResponse: (res, message = '', statusCode = 500, error = {}) => {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error.message
    });
  }
}));

// Mock user ID for authentication
const mockUserId = new mongoose.Types.ObjectId();

// Mock authentication middleware
jest.mock('../src/middleware/auth.middleware', () => ({
  authenticate: (req, _res, next) => {
    req.user = { id: mockUserId.toString(), email: 'user@example.com', isAdmin: false };
    next();
  }
}));

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear collections before each test
  await Cart.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({});
  await Category.deleteMany({});
});

describe('Cart API', () => {
  let testProduct;

  beforeEach(async () => {
    // Create a test user
    testUser = await User.create({
      _id: mockUserId,
      name: 'Test User',
      email: 'user@example.com',
      password: 'hashedpassword',
      cartItems: []
    });

    // Create a category
    const category = await Category.create({ name: 'Test Category' });

    // Create a test product
    testProduct = await Product.create({
      name: 'Test Product',
      price: 99.99,
      category: category._id,
      pictureURL: 'http://example.com/image.jpg',
      amountInStore: 10,
      cartItems: []
    });
  });

  // Test case CART-001: Add item to cart
  test('CART-001: Should add item to cart', async () => {
    const cartData = {
      productId: testProduct._id.toString(),
      quantity: 2
    };

    const response = await request(app)
      .post('/api/v1/cart')
      .send(cartData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toBe('Product added to cart successfully');

    // Verify cart item was created in the database
    const cart = await Cart.findOne({ userId: mockUserId, productId: testProduct._id });
    expect(cart).toBeTruthy();
    expect(cart.quantity).toBe(2);
  });

  // Test case CART-002: Get user's cart
  test('CART-002: Should get user\'s cart', async () => {
    // Add an item to the cart first
    const cart = await Cart.create({
      userId: mockUserId,
      productId: testProduct._id,
      quantity: 2
    });

    // Update user's cartItems
    await User.findByIdAndUpdate(mockUserId, {
      $push: { cartItems: cart._id }
    });

    // Update product's cartItems
    await Product.findByIdAndUpdate(testProduct._id, {
      $push: { cartItems: cart._id }
    });

    const response = await request(app).get('/api/v1/cart');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toBe('Cart fetched successfully');
    expect(Array.isArray(response.body.data.items)).toBe(true);
  });

  // Test case CART-003: Update cart item quantity
  test('CART-003: Should update cart item quantity', async () => {
    // Add an item to the cart first
    const cart = await Cart.create({
      userId: mockUserId,
      productId: testProduct._id,
      quantity: 2
    });

    // Update user's cartItems
    await User.findByIdAndUpdate(mockUserId, {
      $push: { cartItems: cart._id }
    });

    // Update product's cartItems
    await Product.findByIdAndUpdate(testProduct._id, {
      $push: { cartItems: cart._id }
    });

    const updateData = {
      productId: testProduct._id.toString(),
      quantity: 3
    };

    const response = await request(app)
      .put('/api/v1/cart')
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toBe('Cart updated successfully');

    // Verify cart item was updated in the database
    const updatedCart = await Cart.findOne({ userId: mockUserId, productId: testProduct._id });
    expect(updatedCart.quantity).toBe(3);
  });

  // Test case CART-004: Remove item from cart
  test('CART-004: Should remove item from cart', async () => {
    // Add an item to the cart first
    const cart = await Cart.create({
      userId: mockUserId,
      productId: testProduct._id,
      quantity: 2
    });

    // Update user's cartItems
    await User.findByIdAndUpdate(mockUserId, {
      $push: { cartItems: cart._id }
    });

    // Update product's cartItems
    await Product.findByIdAndUpdate(testProduct._id, {
      $push: { cartItems: cart._id }
    });

    const deleteData = {
      productId: testProduct._id.toString()
    };

    const response = await request(app)
      .delete('/api/v1/cart')
      .send(deleteData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toBe('Product removed from cart successfully');

    // Verify cart item was removed from the database
    const deletedCart = await Cart.findOne({ userId: mockUserId, productId: testProduct._id });
    expect(deletedCart).toBeNull();
  });
});
