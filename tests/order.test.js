const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const orderRoutes = require('../src/routes/order.routes');
const Order = require('../src/models/order.model');
const User = require('../src/models/user.model');
const Product = require('../src/models/product.model');
const Category = require('../src/models/category.model');
const Cart = require('../src/models/cart.model');

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/v1', orderRoutes);

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

// Mock user IDs for authentication
const mockUserId = new mongoose.Types.ObjectId();
const mockAdminId = new mongoose.Types.ObjectId();

// Mock authentication middleware
jest.mock('../src/middleware/auth.middleware', () => ({
  authenticate: (req, res, next) => {
    // Default to regular user
    req.user = { id: mockUserId.toString(), email: 'user@example.com', isAdmin: false };

    // Check if admin route is being tested
    if (req.path.includes('/status')) {
      req.user = { id: mockAdminId.toString(), email: 'admin@example.com', isAdmin: true };
    }

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
  await Order.deleteMany({});
  await User.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});
});

describe('Order API', () => {
  let testProduct;
  let testUser;
  let adminUser;

  beforeEach(async () => {
    // Create a regular user
    testUser = await User.create({
      _id: mockUserId,
      name: 'Test User',
      email: 'user@example.com',
      password: 'hashedpassword',
      orders: []
    });

    // Create an admin user
    adminUser = await User.create({
      _id: mockAdminId,
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashedpassword',
      isAdmin: true
    });

    // Create a category
    const category = await Category.create({ name: 'Test Category' });

    // Create a test product
    testProduct = await Product.create({
      name: 'Test Product',
      price: 99.99,
      category: category._id,
      pictureURL: 'http://example.com/image.jpg',
      amountInStore: 10
    });
  });

  // Test case ORDER-001: Create new order
  test('ORDER-001: Should create a new order', async () => {
    // First, add items to the cart
    await Cart.create({
      userId: mockUserId,
      productId: testProduct._id,
      quantity: 2
    });

    const response = await request(app)
      .post('/api/v1/orders')
      .send({});

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    // Verify order was created in the database
    const order = await Order.findOne({ user: mockUserId });
    expect(order).toBeTruthy();
    expect(order.items.length).toBe(1);
    expect(order.status).toBe('pending');


  });

  // Test case ORDER-002: Get user's orders
  test('ORDER-002: Should get user\'s orders', async () => {
    // Create some test orders for the user
    const order1 = await Order.create({
      user: mockUserId,
      items: [{ product: testProduct._id, quantity: 2 }],
      totalPrice: 199.98,
      status: 'pending'
    });

    const order2 = await Order.create({
      user: mockUserId,
      items: [{ product: testProduct._id, quantity: 1 }],
      totalPrice: 99.99,
      status: 'processing'
    });

    // Update user's orders
    await User.findByIdAndUpdate(mockUserId, {
      $push: { orders: { $each: [order1._id, order2._id] } }
    });

    const response = await request(app).get('/api/v1/orders');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // Test case ORDER-003: Get order by ID
  test('ORDER-003: Should get order by ID', async () => {
    // Create a test order
    const order = await Order.create({
      user: mockUserId,
      items: [{ product: testProduct._id, quantity: 2 }],
      totalPrice: 199.98,
      status: 'pending'
    });

    // Update user's orders
    await User.findByIdAndUpdate(mockUserId, {
      $push: { orders: order._id }
    });

    const response = await request(app).get(`/api/v1/orders/${order._id}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data._id.toString()).toBe(order._id.toString());
  });

  // Test case ORDER-004: Update order status (admin only)
  test('ORDER-004: Should update order status (admin only)', async () => {
    // Create a test order
    const order = await Order.create({
      user: mockUserId,
      items: [{ product: testProduct._id, quantity: 2 }],
      totalPrice: 199.98,
      status: 'pending'
    });

    const updateData = {
      status: 'processing'
    };

    const response = await request(app)
      .put(`/api/v1/orders/${order._id}/status`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);


    // Verify order status was updated in the database
    const updatedOrder = await Order.findById(order._id);
    expect(updatedOrder.status).toBe('processing');
  });
});
