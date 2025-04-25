const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/auth');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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


const loginGoogle = async (tokenId) => {
  try {
    let email, name;

    // Kiểm tra xem dữ liệu đầu vào là token hay thông tin người dùng
    if (typeof tokenId === 'string') {
      // Đây là token, thử xác thực như ID token trước
      try {
        // Thử xác thực như ID token
        const ticket = await client.verifyIdToken({
          idToken: tokenId,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        // Lấy thông tin người dùng từ payload
        const payload = ticket.getPayload();
        email = payload.email;
        name = payload.name;
      } catch (idTokenError) {
        console.log('ID token verification failed, trying as access token...');

        // Nếu không phải ID token, thử xác thực như access token
        try {
          // Sử dụng access token để lấy thông tin người dùng từ Google API
          const userInfoResponse = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
              headers: { Authorization: `Bearer ${tokenId}` },
            }
          );

          // Lấy thông tin từ response
          const userData = userInfoResponse.data;
          email = userData.email;
          name = userData.name;
        } catch (accessTokenError) {
          console.error('Access token verification failed:', accessTokenError);
          throw new Error('Invalid Google token');
        }
      }
    } else {
      // Đây là thông tin người dùng đã được xác thực
      email = tokenId.email;
      name = tokenId.name;
    }

    if (!email) {
      throw new Error('Email not provided by Google');
    }

    // Kiểm tra xem email đã tồn tại trong DB chưa
    let user = await User.findOne({ email });

    if (user) {
      // Nếu user đã tồn tại, sử dụng thông tin hiện có
      console.log(`User with email ${email} already exists, logging in`);
    } else {
      // Nếu user chưa tồn tại, tạo tài khoản mới
      console.log(`Creating new user with email ${email} from Google login`);

      // Tạo mật khẩu ngẫu nhiên (user sẽ không dùng mật khẩu này vì họ đăng nhập qua Google)
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({
        email,
        name,
        password: hashedPassword,
        isAdmin: false // Mặc định không phải admin
      });

      await user.save();
    }

    // Tạo JWT token
    const token = generateToken(user);

    // Tạo đối tượng user response (loại bỏ password)
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
    console.error('Error logging in with Google:', error);
    throw error;
  }
};

module.exports = {
  login,
  register,
  loginGoogle
};
