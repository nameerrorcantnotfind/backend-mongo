const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller.js');
const { authenticate } = require('../middleware/auth.middleware.js');


// Public routes
router.get(`/category`, categoryController.get);
router.get(`/category/:id`, categoryController.getById);

// Protected routes (require authentication)
router.post(`/category`, authenticate, categoryController.create);
router.put(`/category/:id`, authenticate, categoryController.update);
router.delete(`/category/:id`, authenticate, categoryController.delete);

module.exports = router;