const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: Number,
      quantity: Number
    }
  ],
  addressInfo: {
    addressId: String,
    name: String,
    street: String,
    city: String,
    state: String,
    zip: Number,
    phone: Number,
    notes: String
  },
  orderStatus:String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String
})

module.exports = mongoose.model('Order',OrderSchema);