
const {
  paypalClient,
  OrdersCreateRequest,
  OrdersCaptureRequest,
} = require("../../Helpers/paypal");
const Order = require("../../models/order");
const Cart = require("../../models/cart");
const Product = require("../../models/Products");

exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;

    // Build PayPal “sale”-style payload
    const createPaymentJson = {
      intent: "CAPTURE",     // maps to REST-SDK’s “sale”
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totalAmount.toFixed(2),
              },
            },
          },
          items: cartItems.map((item) => ({
            name: item.title,
            sku: item.productId,
            unit_amount: {
              currency_code: "USD",
              value: item.price.toFixed(2),
            },
            quantity: item.quantity.toString(),
          })),
        },
      ],
      application_context: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
    };

    // Create PayPal order
    const request = new OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody(createPaymentJson);

    const { result: paypalOrder } = await paypalClient.execute(request);

    // Persist your Order in Mongo
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: paypalOrder.id, // override any incoming paymentId
      payerId: null,          // will fill on capture
    });
    await newlyCreatedOrder.save();

    // Extract approval URL
    const approvalURL = paypalOrder.links.find(
      (link) => link.rel === "approve"
    ).href;

    return res.status(201).json({
      success: true,
      approvalURL,
      orderId: newlyCreatedOrder._id,
    });
  } catch (error) {
    console.error("PayPal createOrder error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: "Error creating PayPal payment",
      details: error.message || error,
    });
  }
};

exports.capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Capture the PayPal payment
    const captureRequest = new OrdersCaptureRequest(paymentId);
    captureRequest.requestBody({});
    await paypalClient.execute(captureRequest);

    // Update stock & cart cleanup just like mentor
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.payerId = payerId;

    for (let item of order.cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Stock is low for Product ${item.productId}`,
        });
      }
      product.totalStock -= item.quantity;
      await product.save();
    }

    await Cart.findByIdAndDelete(order.cartId);
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (error) {
    console.error("PayPal capturePayment error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: "Error capturing PayPal payment",
      details: error.message || error,
    });
  }
};

exports.getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};
