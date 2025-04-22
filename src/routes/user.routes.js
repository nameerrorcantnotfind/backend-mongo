const express = require('express');
const userController = require('../controllers/user.controller.js');
const { authenticate } = require('../middleware/auth.middleware.js');
const router = express.Router();

//trước khi đi vào routes thì sẽ kiểm tra authenticate tại đây rồi mới đi vào routes
router.use(authenticate);

router.get(`/user/profile`, userController.getProfile);
router.put(`/user/profile`, userController.updateProfile);
router.put(`/user/change-password`, userController.changePassword);
router.get(`/user/:email`, userController.getByEmail);
router.post(`/user`, userController.create);


module.exports = router;