const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const userRoutes = require('../src/routes/user.routes');
const User = require('../src/models/user.model');
const bcrypt = require('bcrypt');

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/v1', userRoutes);

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
  authenticate: (req, res, next) => {
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
  // Clear the User collection before each test
  await User.deleteMany({});
});

describe('User API', () => {
  beforeEach(async () => {
    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      _id: mockUserId,
      name: 'Test User',
      email: 'user@example.com',
      phone: '1234567890',
      address: '123 Test St',
      password: hashedPassword
    });
  });

  // Test case USER-001: Get user profile
  test('USER-001: Should get user profile', async () => {
    const response = await request(app).get('/api/v1/user/profile');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Test User');
    expect(response.body.data.email).toBe('user@example.com');
    expect(response.body.data.phone).toBe('1234567890');
    expect(response.body.data.address).toBe('123 Test St');
    // Password should not be returned
    expect(response.body.data.password).toBeUndefined();
  });

  // Test case USER-002: Update user profile
  test('USER-002: Should update user profile', async () => {
    const updateData = {
      name: 'Updated Name',
      phone: '9876543210',
      address: '456 New St'
    };

    const response = await request(app)
      .put('/api/v1/user/profile')
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(updateData.name);
    expect(response.body.data.phone).toBe(updateData.phone);
    expect(response.body.data.address).toBe(updateData.address);
    // Email should remain unchanged
    expect(response.body.data.email).toBe('user@example.com');

    // Verify user was updated in the database
    const updatedUser = await User.findById(mockUserId);
    expect(updatedUser.name).toBe(updateData.name);
    expect(updatedUser.phone).toBe(updateData.phone);
    expect(updatedUser.address).toBe(updateData.address);
  });

  // Test case USER-003: Change password
  test('USER-003: Should change password', async () => {
    const passwordData = {
      currentPassword: 'password123',
      newPassword: 'newpassword123'
    };

    const response = await request(app)
      .put('/api/v1/user/change-password')
      .send(passwordData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('Password changed successfully');

    // Verify password was updated in the database
    const updatedUser = await User.findById(mockUserId);
    const isNewPasswordValid = await bcrypt.compare(passwordData.newPassword, updatedUser.password);
    expect(isNewPasswordValid).toBe(true);
  });
});
