const Product = require('../../models/Products.js');

const getFilteredProducts = async (req, res) => {
  try {

    const { category = [], brand = [], sortBy = "priceLowToHigh" } = req.query;
    let filters = {};
    if (category.length > 0) {
      filters.category = { $in: category.split(',') };
    }
    if (brand.length > 0) {
      filters.brand = { $in: brand.split(',') };
    }

    let sort = {};

    switch (sortBy) {
      case "priceLowToHigh":
        sort.price = 1;
        break;
      case "priceHighToLow":
        sort.price = -1;
        break;
      case "newestArrivals":
        sort.createdAt = -1;
        break;
      case "bestSellers":
        sort.sold = -1;
        break;
      case "mostPopular":
        sort.ratings = -1;
      default:
        sort.price = 1;
    }
    const products = await Product.find(filters).sort(sort);
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}


const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

module.exports = {
  getFilteredProducts,
  getProductDetails
}