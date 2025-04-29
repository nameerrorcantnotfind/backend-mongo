const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const productRoutes = require('../src/routes/product.routes');
const Product = require('../src/models/product.model');
const Category = require('../src/models/category.model');

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/v1', productRoutes);

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
  await Product.deleteMany({});
  await Category.deleteMany({});
});

describe('Product API', () => {
  // Test case PROD-001: Get all products
  test('PROD-001: Should get all products', async () => {
    // Create a category first
    const category = await Category.create({ name: 'Test Category' });
    
    // Create some test products
    await Product.create([
      {
        name: 'Product 1',
        price: 99.99,
        category: category._id,
        pictureURL: 'http://example.com/image1.jpg',
        amountInStore: 10
      },
      {
        name: 'Product 2',
        price: 149.99,
        category: category._id,
        pictureURL: 'http://example.com/image2.jpg',
        amountInStore: 5
      }
    ]);

    const response = await request(app).get('/api/v1/products');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(2);
  });

  // Test case PROD-002: Get product by ID
  test('PROD-002: Should get product by ID', async () => {
    // Create a category first
    const category = await Category.create({ name: 'Test Category' });
    
    // Create a test product
    const product = await Product.create({
      name: 'Test Product',
      price: 99.99,
      category: category._id,
      pictureURL: 'http://example.com/image.jpg',
      amountInStore: 10
    });

    const response = await request(app).get(`/api/v1/products/${product._id}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Test Product');
    expect(response.body.data.price).toBe(99.99);
  });

  // Test case PROD-003: Create new product with valid data
  test('PROD-003: Should create a new product with valid data', async () => {
    // Create a category first
    const category = await Category.create({ name: 'Test Category' });
    
    const productData = {
      name: 'New Product',
      price: 99.99,
      category: category._id.toString(),
      pictureURL: 'http://example.com/image.jpg',
      amountInStore: 10,
      feature: ['Feature 1', 'Feature 2'],
      description: 'Test description'
    };

    const response = await request(app)
      .post('/api/v1/products')
      .send(productData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(productData.name);
    expect(response.body.data.price).toBe(productData.price);
    expect(response.body.message).toBe('Product created successfully');

    // Verify product was created in the database
    const product = await Product.findOne({ name: productData.name });
    expect(product).toBeTruthy();
    expect(product.price).toBe(productData.price);
  });

  // Test case PROD-004: Create product with missing required fields
  test('PROD-004: Should not create product with missing required fields', async () => {
    const productData = {
      name: 'Incomplete Product'
      // Missing required fields: price, category, pictureURL
    };

    const response = await request(app)
      .post('/api/v1/products')
      .send(productData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Missing required fields');
  });

  // Test case PROD-005: Update product with valid data
  test('PROD-005: Should update product with valid data', async () => {
    // Create a category first
    const category = await Category.create({ name: 'Test Category' });
    
    // Create a test product
    const product = await Product.create({
      name: 'Test Product',
      price: 99.99,
      category: category._id,
      pictureURL: 'http://example.com/image.jpg',
      amountInStore: 10
    });

    const updateData = {
      price: 89.99,
      description: 'Updated description'
    };

    const response = await request(app)
      .put(`/api/v1/products/${product._id}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.price).toBe(updateData.price);
    expect(response.body.data.description).toBe(updateData.description);
    expect(response.body.message).toBe('Product updated successfully');

    // Verify product was updated in the database
    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.price).toBe(updateData.price);
    expect(updatedProduct.description).toBe(updateData.description);
  });

  // Test case PROD-006: Delete product
  test('PROD-006: Should delete product', async () => {
    // Create a category first
    const category = await Category.create({ name: 'Test Category' });
    
    // Create a test product
    const product = await Product.create({
      name: 'Test Product',
      price: 99.99,
      category: category._id,
      pictureURL: 'http://example.com/image.jpg',
      amountInStore: 10
    });

    const response = await request(app).delete(`/api/v1/products/${product._id}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Product deleted successfully');

    // Verify product was deleted from the database
    const deletedProduct = await Product.findById(product._id);
    expect(deletedProduct).toBeNull();
  });
});
