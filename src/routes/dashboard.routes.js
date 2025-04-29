const express = require('express');
const router = express.Router();
const { getDashBoard } = require('../controllers/dashboard.controller');

router.get('/dashboard', getDashBoard);

module.exports = router;
