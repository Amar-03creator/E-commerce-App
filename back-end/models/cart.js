const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ]
},{ timestamps: true } // Add timestamps to track creation and update times
);

module.exports =mongoose.models.Cart || mongoose.model('Cart', CartSchema);
// This schema defines a cart for a user, which contains an array of items.
