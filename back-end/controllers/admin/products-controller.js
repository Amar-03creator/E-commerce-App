const { imageUploadUtil } = require("../../Helpers/cloudinary");
const Product = require("../../models/Products")

// const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    // Convert file buffer into a Base64 string and build the data URL
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const url = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload the image to Cloudinary; imageUploadUtil returns the secure URL string directly
    const result = await imageUploadUtil(url);

    // Send the result directly as the imageUrl (since result is already the URL string)
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Image upload failed",
      error: error.message
    });
  }
}

//add a new product
const addProduct = async (req, res) => {
  try {
    const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;
    const newProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock
    });
    await newProduct.save();
    res.status(201).json({
      success: true,
      data: newProduct,
      message: "Product added successfully",
      product: newProduct
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message
    });
  }
}






//fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
}


//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;
    let findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    findProduct.image = image || findProduct.image;
    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === '' ? 0 : price || findProduct.price;
    findProduct.salePrice = salePrice === '' ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;

    await findProduct.save();
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: findProduct
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to edit product",
      error: error.message
    });
  }
}



//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message
    });
  }
}

module.exports = {
  handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct
};
