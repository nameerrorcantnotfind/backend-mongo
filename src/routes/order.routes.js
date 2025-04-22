const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller.js');
const { authenticate } = require('../middleware/auth.middleware.js');


// Áp dụng middleware xác thực cho tất cả các routes
router.use(`/orders`, authenticate);

// Routes cho cả user và admin
router.get(`/orders`, orderController.getOrders);
router.get(`/orders/:id`, orderController.getOrderById);
router.post(`/orders`, orderController.create);

// Route chỉ dành cho admin
router.put(`/orders/:id/status`, orderController.updateStatus);

module.exports = router;