const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller.js');
const { authenticate } = require('../middleware/auth.middleware');


router.get(`/products`, productController.get);
router.get(`/products/:id`, productController.getById);
router.post(`/products`, authenticate, productController.createProduct);
router.put(`/products/:id`, authenticate, productController.updateProduct);
router.delete(`/products/:id`, authenticate, productController.deleteProduct);

module.exports = router;