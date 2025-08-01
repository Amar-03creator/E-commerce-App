const Cart = require("../../models/cart");
const Product = require("../../models/Products");


const addToCart = async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body;
    // const userId = req.user._id;

    // Check if the product exists
    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID, quantity, and user ID are required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      // If the item already exists in the cart, update the quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // If the item does not exist in the cart, add it
      cart.items.push({ productId, quantity });
    }
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cart,
    });


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Fetch all items in the cart
const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title price image salePrice",
    });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    };

    // Check if any items in the cart have a null productId i.e. deleted by the admin
    const validCartItems = cart.items.filter(item => item.productId !== null);
    if (validCartItems.length < cart.items.length) {
      cart.items = validCartItems;
      await cart.save();
    }

    const populatedCart = validCartItems.map(item => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));
    res.status(200).json({
      success: true,
      message: "Cart items fetched successfully",
      data: {
        ...cart._doc,
        items: populatedCart,
      }
    });




  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// Delete an item from the cart
const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and product ID are required",
      });
    }
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title price image salePrice",
    });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter((item) => item.productId._id.toString() !== productId);
    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "title price image salePrice",
    });

    const populatedCart = cart.items.map(item => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      message: "Item deleted from cart successfully",
      data: {
        ...cart._doc,
        items: populatedCart,
      }
    });


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update the quantity of an item in the cart
const updateCartItemQty = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const { userId } = req.params;
    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "User ID, product ID, and quantity are required",
      });
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      await cart.populate({
        path: "items.productId",
        select: "title price image salePrice",
      });
      const populatedCart = cart.items.map(item => ({
        productId: item.productId ? item.productId._id : null,
        image: item.productId ? item.productId.image : null,
        title: item.productId ? item.productId.title : "Product not found",
        price: item.productId ? item.productId.price : null,
        salePrice: item.productId ? item.productId.salePrice : null,
        quantity: item.quantity,
      }));
      res.status(200).json({
        success: true,
        message: "Cart item quantity updated successfully",
        data: {
          ...cart._doc,
          items: populatedCart,
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Item not found in the cart",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty
}