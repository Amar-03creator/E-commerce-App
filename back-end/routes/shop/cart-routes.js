const express = require('express');
const { addToCart, fetchCartItems, deleteCartItem, updateCartItemQty } = require('../../controllers/shop/cart-controller');


const router = express.Router();
// Add item to cart
router.post('/add', addToCart);
router.get('/fetch/:userId', fetchCartItems);
router.put('/update/:userId', updateCartItemQty);
router.delete('/:userId/:productId', deleteCartItem);

module.exports = router;