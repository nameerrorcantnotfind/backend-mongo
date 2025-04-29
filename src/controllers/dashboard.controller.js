const { successResponse, errorResponse } = require('../utils/response');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

/**
 * Get statistics of all data in the database (counts only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Statistics counts of all data
 */
const getDashBoard = async (req, res) => {
  try {
    // Get counts of all models
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    const orderCount = await Order.countDocuments();
    const cartCount = await Cart.countDocuments();

    // Get pending orders count
    const pendingOrderCount = await Order.countDocuments({ status: 'pending' });
    
    // Get processing orders count
    const processingOrderCount = await Order.countDocuments({ status: 'processing' });
    
    // Get completed orders count
    const completedOrderCount = await Order.countDocuments({ status: 'completed' });
    
    // Get cancelled orders count
    const cancelledOrderCount = await Order.countDocuments({ status: 'cancelled' });

    // Get total revenue
    const orders = await Order.find({}, { totalPrice: 1 });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Prepare response data
    const stats = {
      counts: {
        users: userCount,
        products: productCount,
        categories: categoryCount,
        orders: orderCount,
        carts: cartCount
      },
      orderStats: {
        pending: pendingOrderCount,
        processing: processingOrderCount,
        completed: completedOrderCount,
        cancelled: cancelledOrderCount
      },
      totalRevenue
    };

    return successResponse(res, stats, 'Statistics fetched successfully');
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return errorResponse(res, 'Failed to fetch statistics', 500, error);
  }
};

module.exports = {
  getDashBoard
};
