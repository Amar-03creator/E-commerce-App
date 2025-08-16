const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

// Import all your routes
const authRouter = require('./routes/auth/auth-routes');
const adminProductsRouter = require('./routes/admin/products-routes');
const adminOrderRouter= require("./routes/admin/order-routes");
const shopProductsRouter = require('./routes/shop/products-routes');
const shopCartRouter = require('./routes/shop/cart-routes');
const shopAddressRouter = require('./routes/shop/address-routes');
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");

const app = express();

// --- CHANGE 1: UPDATED CORS CONFIGURATION FOR PRODUCTION ---
// This allows both your local machine and your live Vercel frontend to connect.
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL, // You'll set this variable in Vercel/Render
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders : ["Content-Type", 'Authorization'],
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json());

// --- CHANGE 2: SIMPLIFIED MONGODB CONNECTION ---
// This now uses the single MONGO_URI variable from your .env file.
mongoose.connect(process.env.mongoURL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("DB connection failed: ", error));

// Use all your API routes
app.use('/api/auth', authRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/orders', adminOrderRouter);
app.use('/api/shop/products', shopProductsRouter);
app.use('/api/shop/cart', shopCartRouter);
app.use('/api/shop/address', shopAddressRouter);
app.use('/api/shop/order', shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);

// --- CHANGE 3: HEALTH CHECK ROUTE FOR RENDER ---
// This route responds to Render's health checks to prevent timeouts.
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is healthy and running!" });
});

// --- CHANGE 4: EXPORT THE APP FOR SERVERLESS ENVIRONMENT ---
// We remove app.listen() and export the app for Render to use.
module.exports = app;
