const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const categoryRoutes = require('../src/routes/category.routes');
const Category = require('../src/models/category.model');
const Product = require('../src/models/product.model');

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/v1', categoryRoutes);

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

// Mock authentication middleware
jest.mock('../src/middleware/auth.middleware', () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 'mock-user-id', email: 'admin@example.com', isAdmin: true };
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
  await Category.deleteMany({});
  await Product.deleteMany({});
});

describe('Category API', () => {
  // Test case CAT-001: Get all categories
  test('CAT-001: Should get all categories', async () => {
    // Create some test categories
    await Category.create([
      { name: 'Category 1' },
      { name: 'Category 2' },
      { name: 'Category 3' }
    ]);

    const response = await request(app).get('/api/v1/category');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(3);
  });

  // Test case CAT-002: Get category by ID
  test('CAT-002: Should get category by ID', async () => {
    // Create a test category
    const category = await Category.create({ name: 'Test Category' });

    const response = await request(app).get(`/api/v1/category/${category._id}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Test Category');
  });

  // Test case CAT-003: Create new category with valid data
  test('CAT-003: Should create a new category with valid data', async () => {
    const categoryData = {
      name: 'New Category'
    };

    const response = await request(app)
      .post('/api/v1/category')
      .send(categoryData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(categoryData.name);
    expect(response.body.message).toBe('Category created successfully');

    // Verify category was created in the database
    const category = await Category.findOne({ name: categoryData.name });
    expect(category).toBeTruthy();
    expect(category.name).toBe(categoryData.name);
  });

  // Test case CAT-004: Create category with missing name
  test('CAT-004: Should not create category with missing name', async () => {
    const categoryData = {};

    const response = await request(app)
      .post('/api/v1/category')
      .send(categoryData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Name is required');
  });
});
