const express = require('express');

const {handleImageUpload,addProduct,editProduct,fetchAllProducts,deleteProduct} = require('../../controllers/admin/products-controller'); // Import the controller function  
const {upload} = require('../../Helpers/cloudinary'); // Import the upload middleware from cloudinary helper
const router = express.Router();

router.post('/upload-image', upload.single('my_file'), handleImageUpload); // Handle image upload
router.post('/add', addProduct); // Handle adding a new product
router.put('/edit/:id', editProduct); // Handle editing a product
router.get('/get', fetchAllProducts); // Handle fetching all products
router.delete('/delete/:id', deleteProduct); // Handle deleting a product


module.exports = router; // Export the router