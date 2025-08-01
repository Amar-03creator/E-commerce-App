const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage(); // Store files in memory
async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: 'auto'
  });
  return result.secure_url; // Return the URL of the uploaded image
}

const upload = multer({ storage }) // Use multer to handle file uploads
module.exports = {
  upload,
  imageUploadUtil
};