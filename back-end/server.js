const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require("cors");
const authRouter = require('./routes/auth/auth-routes');
const adminProductsRouter = require('./routes/admin/products-routes'); // Import the admin products router
const adminOrderRouter= require("./routes/admin/order-routes");
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const shopProductsRouter = require('./routes/shop/products-routes'); // Import the shop products router
const shopCartRouter = require('./routes/shop/cart-routes'); // Import the shop cart router
const shopAddressRouter = require('./routes/shop/address-routes'); // Import the shop address router
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");

const mongoURL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@dbecommerece.wntok.mongodb.net/${process.env.MONGO_DB_NAME}`;

mongoose.connect(mongoURL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("DB connection failed: ", error));
// mongoose.connect(
//   'mongodb+srv://456amarnath:hAHwwSH7bSivmrxl@dbecommerece.wntok.mongodb.net/dbecommerece'
// ).then(() => console.log("MongoDB connected")).catch((error) => console.log("DB connection failed: ", error))

//create a database connection -> u can also create a separate file for this and then import/use that file here
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders : [
      "Content-Type",
      'Authorization',
      'Cache-Control',
      'Expires',
      'Pragma'
    ],
    credentials: true   //This will help in the login page
  })
)

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/admin/products', adminProductsRouter); // Use the admin products router
app.use('/api/admin/orders', adminOrderRouter); 

app.use('/api/shop/products', shopProductsRouter); // Use the shop products router
app.use('/api/shop/cart', shopCartRouter); // Use the shop cart router
app.use('/api/shop/address', shopAddressRouter); // Use the shop address router
app.use('/api/shop/order', shopOrderRouter)
app.use("/api/shop/search", shopSearchRouter)
app.use("/api/shop/review", shopReviewRouter)
app.use("/api/common/feature",commonFeatureRouter);

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));
