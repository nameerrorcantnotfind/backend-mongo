const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller.js');
const { authenticate } = require('../middleware/auth.middleware.js');


// Apply authentication middleware to all cart routes
router.use(authenticate);

// Cart routes
router.post(`/cart`, cartController.add);
router.delete(`/cart`, cartController.remove);
router.put(`/cart`, cartController.update);
router.get(`/cart`, cartController.getByUserId);

module.exports = router;