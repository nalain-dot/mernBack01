import userModel from "../models/userModel.js";

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Product Added To Cart Successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Cart
export const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      return res.status(400).json({ success: false, message: 'Item not found in cart' });
    }

    cartData[itemId] = quantity;

    if (cartData[itemId] <= 0) delete cartData[itemId];

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Cart Updated Successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Cart Data
export const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    const cartData = userData.cartData || {};

    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
