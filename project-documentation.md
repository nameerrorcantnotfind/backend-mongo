

### 1. Authentication

#### Description
The authentication module provides functionality for user registration, login, and Google login.

#### Related Files
- **Models**: `src/models/user.model.js`
- **Controllers**: `src/controllers/auth.controller.js`
- **Services**: `src/services/auth.service.js`
- **Routes**: `src/routes/auth.routes.js`
- **Utils**: `src/utils/auth.js`
- **Middleware**: `src/middleware/auth.middleware.js`

#### API Endpoints
- `POST /api/v1/auth/register`: Register a new user
- `POST /api/v1/auth/login`: Login with email and password
- `POST /api/v1/auth/google`: Login with Google

#### Core Source Code

**User Registration**
```javascript
const register = async (userData) => {
  try {
    const { email, password, name, phone, address } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      address
    });

    await newUser.save();

    const token = generateToken(newUser);

    return token;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};
```

**Detailed Explanation:**
1. The `register` function receives a `userData` object containing user information (email, password, name, phone, address).
2. First, the function checks if the email already exists in the database using `User.findOne({ email })`.
3. If the email already exists, the function throws an error "User already exists".
4. If the email doesn't exist, the function hashes the password using bcrypt with a complexity of 10 (salt rounds).
5. Then, the function creates a new User object with the user information and the hashed password.
6. The new User object is saved to the database using the `save()` method.
7. Finally, the function creates a JWT token for the newly registered user by calling the `generateToken` function and returns this token.
8. If an error occurs during registration, the function logs the error and throws it for the controller to handle.

**User Login**
```javascript
const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User is not existed');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin,
      orders: user.orders,
      cartItems: user.cartItems
    };

    return {
      user: userResponse,
      token
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
```

**Detailed Explanation:**
1. The `login` function receives two parameters: user's `email` and `password`.
2. First, the function searches for the user in the database based on the email using `User.findOne({ email })`.
3. If the user is not found, the function throws an error "User is not existed".
4. If the user is found, the function compares the provided password with the hashed password in the database using `bcrypt.compare()`.
5. If the passwords don't match, the function throws an error "Invalid credentials".
6. If the passwords match, the function creates a JWT token for the user by calling the `generateToken` function.
7. The function creates a `userResponse` object containing user information (excluding the password) to return to the client.
8. Finally, the function returns an object containing the user information and token.
9. If an error occurs during login, the function logs the error and throws it for the controller to handle.

**Google Login**
```javascript
const loginGoogle = async (tokenId) => {
  try {
    let email, name;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Get user information from payload
    const payload = ticket.getPayload();
    email = payload.email;
    name = payload.name;

    // Check if email already exists in DB
    let user = await User.findOne({ email });

    if (!user) {
      // Create new account if it doesn't exist
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({
        email,
        name,
        password: hashedPassword,
        isAdmin: false
      });

      await user.save();
    }

    // Create JWT token
    const token = generateToken(user);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAdmin: user.isAdmin,
        orders: user.orders,
        cartItems: user.cartItems
      },
      token
    };
  } catch (error) {
    console.error('Error logging in with Google:', error);
    throw error;
  }
};
```

**Detailed Explanation:**
1. The `loginGoogle` function receives a parameter `tokenId` which is the token provided by Google after the user successfully logs in with Google.
2. The function uses the `google-auth-library` to verify the Google token by calling `client.verifyIdToken()`.
3. After successful verification, the function extracts user information from the token payload, including email and name.
4. The function checks if the user's email already exists in the database using `User.findOne({ email })`.
5. If the email doesn't exist (user hasn't registered), the function will:
   - Create a random password using `Math.random()`.
   - Hash the random password using bcrypt.
   - Create a new User object with information from Google and the hashed password.
   - Save the new user to the database.
6. If the email already exists (user has registered), the function will use the existing user information.
7. The function creates a JWT token for the user by calling the `generateToken` function.
8. Finally, the function returns an object containing user information and the token.
9. If an error occurs during Google login, the function logs the error and throws it for the controller to handle.

**Authentication Middleware**
```javascript
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Token is not valid' });
  }
};
```

**Detailed Explanation:**
1. The `authenticate` middleware is used to authenticate users before allowing access to protected routes.
2. The middleware receives three parameters: `req` (request), `res` (response), and `next` (function to move to the next middleware).
3. First, the middleware extracts the token from the 'Authorization' header of the request and removes the 'Bearer ' prefix.
4. If there is no token, the middleware returns a 401 (Unauthorized) error with the message "No token, authorization denied".
5. If there is a token, the middleware verifies the token by calling the `verifyToken` function.
6. If the token is valid, the user information decoded from the token is stored in `req.user` for subsequent routes to use.
7. Then, the middleware calls `next()` to move to the next middleware or route handler.
8. If the token is invalid, the middleware returns a 400 (Bad Request) error with the message "Token is not valid".

### 2. User Management

#### Description
The user management module provides functionality for managing user information.

#### Related Files
- **Models**: `src/models/user.model.js`
- **Controllers**: `src/controllers/user.controller.js`
- **Services**: `src/services/user.service.js`
- **Routes**: `src/routes/user.routes.js`

#### User Schema
```javascript
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    cartItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
      },
    ],
  },
  {
    timestamps: true,
  }
);
```

**Detailed Explanation:**
1. The `userSchema` defines the data structure for the User model in MongoDB.
2. User information fields include:
   - `name`: User's name (required)
   - `email`: User's email (required and must be unique)
   - `phone`: User's phone number (optional)
   - `address`: User's address (optional)
   - `password`: Hashed password (required)
   - `isAdmin`: Admin privileges (default is false)
3. The schema also defines relationships with other models:
   - `orders`: Array of user's orders (references the Order model)
   - `cartItems`: Array of items in the user's cart (references the Cart model)
4. The `timestamps: true` option automatically adds `createdAt` and `updatedAt` fields to track when records are created and updated.

### 3. Product Management

#### Description
The product management module provides CRUD functionality for products.

#### Related Files
- **Models**: `src/models/product.model.js`
- **Controllers**: `src/controllers/product.controller.js`
- **Services**: `src/services/product.service.js`
- **Routes**: `src/routes/product.routes.js`

#### API Endpoints
- `GET /api/v1/products`: Get list of products
- `GET /api/v1/products/:id`: Get product by ID
- `POST /api/v1/products`: Create new product (requires authentication)
- `PUT /api/v1/products/:id`: Update product (requires authentication)
- `DELETE /api/v1/products/:id`: Delete product (requires authentication)

#### Product Schema
```javascript
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  pictureURL: {
    type: String,
    required: true
  },
  feature: [{
    type: String
  }],
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  amountInStore: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  orderItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItem'
  }],
  cartItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  }]
}, {
  timestamps: true
});
```

**Detailed Explanation:**
1. The `productSchema` defines the data structure for the Product model in MongoDB.
2. Product information fields include:
   - `name`: Product name (required)
   - `pictureURL`: Product image URL (required)
   - `feature`: Array of product features (optional)
   - `description`: Product description (optional)
   - `price`: Product price (required)
   - `amountInStore`: Quantity of product in stock (required)
   - `category`: Product category (required, references the Category model)
3. The schema also defines relationships with other models:
   - `orderItems`: Array of orders containing this product (references the OrderItem model)
   - `cartItems`: Array of carts containing this product (references the Cart model)
4. The `timestamps: true` option automatically adds `createdAt` and `updatedAt` fields to track when records are created and updated.

### 4. Category Management

#### Description
The category management module provides CRUD functionality for product categories.

#### Related Files
- **Models**: `src/models/category.model.js`
- **Controllers**: `src/controllers/category.controller.js`
- **Services**: `src/services/category.service.js`
- **Routes**: `src/routes/category.routes.js`

### 5. Cart Management

#### Description
The cart management module provides functionality to add, remove, and update products in the shopping cart.

#### Related Files
- **Models**: `src/models/cart.model.js`
- **Controllers**: `src/controllers/cart.controller.js`
- **Services**: `src/services/cart.service.js`
- **Routes**: `src/routes/cart.routes.js`

### 6. Order Management

#### Description
The order management module provides functionality to create, view, and update order status.

#### Related Files
- **Models**: `src/models/order.model.js`
- **Controllers**: `src/controllers/order.controller.js`
- **Services**: `src/services/order.service.js`
- **Routes**: `src/routes/order.routes.js`

#### Order Schema
```javascript
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "processing", "shipped", "delivered", "completed"],
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
  },
  {
    timestamps: true,
  }
);
```

**Detailed Explanation:**
1. The `orderSchema` defines the data structure for the Order model in MongoDB.
2. Order information fields include:
   - `user`: User who placed the order (required, references the User model)
   - `items`: Array of products in the order, each item includes:
     - `product`: Product (required, references the Product model)
     - `quantity`: Product quantity (required, minimum is 1)
   - `totalPrice`: Total order value (required)
   - `status`: Order status (required, default is "pending")
     - Possible statuses: "pending", "processing", "shipped", "delivered", "completed"
   - `paymentDate`: Payment date (default is the current time)
3. The `timestamps: true` option automatically adds `createdAt` and `updatedAt` fields to track when the order is created and updated.

## Application Configuration and Startup

### Server Configuration
```javascript
//====Cấu Hình Load File ENV=======//
const dotenv = require('dotenv'); //
dotenv.config();//===============//
//==============================//

//=======express-chuyển Json thành JS==========================================//
const express = require('express'); // import thư viện Express================//
const app = express(); // tạo một ứng dụng Express===========================//
app.use(express.json()); //biên dịch json trong req.body thành đối tượng JavaScript
//=========================================================================//

//============cors: cho phép các request từ các domain khác truy cập API của bạn===============//
const cors = require('cors'); // cho phép các request từ các domain khác truy cập API của bạn //
app.use(cors({ origin: '*' })); //cho phép các domain khác truy cập API của bạn==============//
///=========================================================================================//

//==========Kết Nối MongoDB================//
const connectDB = require('./config/db'); //
connectDB();//Gọi Function Kết Nối Mongo //
//======================================//

//======================API-Routes-==================================//
app.use('/api/v1/', require('./routes/auth.routes.js'));//==========//
app.use('/api/v1/', require('./routes/product.routes.js'));//======//
app.use('/api/v1/', require('./routes/category.routes.js'));//====//
app.use('/api/v1/', require('./routes/order.routes.js'));//======//
app.use('/api/v1/', require('./routes/cart.routes.js'));//======//
app.use('/api/v1/', require('./routes/user.routes.js'));//=====//
//======================API-Routes-===========================//

app.listen(process.env.PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${process.env.PORT}`);
});
```

**Detailed Explanation:**
1. **Environment Variables Configuration**:
   - Uses the `dotenv` library to load environment variables from the `.env` file.
   - Environment variables contain configuration information such as PORT, JWT_SECRET, MONGODB_URI, etc.

2. **Express Initialization**:
   - Imports the Express library and creates an Express application.
   - Uses the `express.json()` middleware to convert JSON data in the request body to JavaScript objects.

3. **CORS Configuration**:
   - Uses the `cors` library to allow requests from different domains to access the API.
   - The `origin: '*'` configuration allows all domains to access the API (in a production environment, it's recommended to limit the allowed domains).

4. **MongoDB Connection**:
   - Imports the `connectDB` function from the `./config/db` module.
   - Calls the `connectDB()` function to establish a connection with MongoDB.

5. **Routes Configuration**:
   - Registers routes for the API with the prefix `/api/v1/`.
   - Routes include: auth, product, category, order, cart, user.

6. **Server Startup**:
   - Listens for requests on the port specified in the `PORT` environment variable.
   - Prints a message when the server has started successfully.

## Conclusion

This backend project provides a complete API for a mobile e-commerce application, including authentication, user management, products, categories, shopping cart, and order management. The project structure is organized according to the MVC (Model-View-Controller) pattern with service layers to handle business logic.

Key technologies used:
- **Node.js**: JavaScript runtime environment
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: ODM (Object Data Modeling) for MongoDB
- **JWT**: JSON Web Token for authentication
- **bcrypt**: Password encryption
- **Google Auth Library**: Authentication with Google OAuth
