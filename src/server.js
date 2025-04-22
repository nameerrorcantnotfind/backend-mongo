const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));

// Routes
app.use('/api/v1/', require('./routes/auth.routes.js'));
app.use('/api/v1/', require('./routes/product.routes.js'));
app.use('/api/v1/', require('./routes/category.routes.js'));
app.use('/api/v1/', require('./routes/order.routes.js'));
app.use('/api/v1/', require('./routes/cart.routes.js'));
app.use('/api/v1/', require('./routes/user.routes.js'));


// Connect to MongoDB and start server
connectDB();
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});