// // helpers/paypal.js
// require("dotenv").config();

// const {
//   Client,
//   Environment,
//   OrdersCreateRequest,
//   OrdersCaptureRequest,
// } = require("@paypal/paypal-server-sdk");

// // 1️⃣ Pick your environment
// //    Environment.Sandbox and Environment.Live are both static objects.
// const env = Environment.Sandbox;  
// // const env = Environment.Live;  // when you go to production

// // 2️⃣ Instantiate the PayPal HTTP client
// const paypalClient = new Client({
//   environment: env,
//   clientCredentialsAuthCredentials: {
//     oAuthClientId:     process.env.CLIENT_ID,
//     oAuthClientSecret: process.env.CLIENT_SECRET,
//   },
//   // timeout, logging, retryConfig, etc. all optional
// });

// module.exports = {
//   paypalClient,
//   OrdersCreateRequest,
//   OrdersCaptureRequest,
// };

// helpers/paypal.js
require("dotenv").config();

const paypal = require("@paypal/checkout-server-sdk");
const { core, orders } = paypal;

// 1️⃣ Environment
const env = new core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_KEY,
  process.env.PAYPAL_SECRET_KEY
);
// 2️⃣ Client
const paypalClient = new core.PayPalHttpClient(env);

// 3️⃣ Exports
module.exports = {
  paypalClient,
  OrdersCreateRequest:  orders.OrdersCreateRequest,
  OrdersCaptureRequest: orders.OrdersCaptureRequest,
};
