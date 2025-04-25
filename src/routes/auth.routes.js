const express = require('express');
const authController = require('../controllers/auth.controller.js');
const router = express.Router();

// Public routes
router.post(`/auth/login`, authController.login);
router.post(`/auth/register`, authController.register);
router.post(`/auth/google`, authController.loginWithGoogle);

module.exports = router;