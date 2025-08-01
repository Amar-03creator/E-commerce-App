const express = require('express');

const {handleImageUpload}= require('../../../controllers/admin/products-controller'); // Import the image upload handler
const {upload} = require('../../../Helpers/cloudinary'); // Import the upload middleware from cloudinary helper
const router = express.Router();

router.post('/upload-image', upload.single('image'), handleImageUpload); // Handle image upload

module.exports = router;