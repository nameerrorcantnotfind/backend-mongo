//====Cấu Hình Load File ENV=======//
const dotenv = require('dotenv'); //
dotenv.config();//===============//
//==============================//

//=======express-chuyển Json thành JS===================================================//
const express = require('express'); // import thư viện Express=========================//
const app = express(); // tạo một ứng dụng Express====================================//
app.use(express.json()); //biên dịch json trong req.body thành đối tượng JavaScript==//
//==================================================================================//

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