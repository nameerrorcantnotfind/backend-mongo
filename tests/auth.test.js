const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const authRoutes = require('../src/routes/auth.routes');
const User = require('../src/models/user.model');
const bcrypt = require('bcrypt');

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/v1', authRoutes);

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

// Mock JWT token generation
jest.mock('../src/utils/auth', () => ({
  generateToken: jest.fn().mockReturnValue('mock-token'),
  verifyToken: jest.fn().mockReturnValue({ id: 'mock-user-id', email: 'test@example.com', isAdmin: false })
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
  // Clear the User collection before each test
  await User.deleteMany({});
});

describe('Authentication API', () => {
  // Test case AUTH-001: Register a new user with valid data
  test('AUTH-001: Should register a new user with valid data', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBe('mock-token');
    expect(response.body.message).toBe('Register successfully');

    // Verify user was created in the database
    const user = await User.findOne({ email: userData.email });
    expect(user).toBeTruthy();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });

  // Test case AUTH-002: Login with valid credentials
  test('AUTH-002: Should login with valid credentials', async () => {
    // Create a user first
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User'
    });

    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBe('mock-token');
    expect(response.body.message).toBe('Login successfully');
  });

  // Test case AUTH-003: Register with existing email
  test('AUTH-003: Should not register with existing email', async () => {
    // Create a user first
    await User.create({
      email: 'test@example.com',
      password: 'hashedpassword',
      name: 'Existing User'
    });

    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('User already exists');
  });

  // Test case AUTH-004: Login with invalid credentials
  test('AUTH-004: Should not login with invalid credentials', async () => {
    // Create a user first
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User'
    });

    const loginData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(loginData);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Invalid credentials');
  });
});
