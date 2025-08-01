const express = require('express');

const { getFilteredProducts, getProductDetails } = require('../../controllers/shop/products-controller'); // Import the controller function

const router = express.Router();

router.get('/get', getFilteredProducts); // Handle fetching all products
router.get('/get/:id', getProductDetails); // Handle fetching a single product by ID



module.exports = router; // Export the router