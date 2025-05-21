import orderModel from '../models/orderModel.js'
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const currency = 'usd';
const deliveryCharge = 200;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Place Order (Cash on Delivery)
export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId; // ✅ Auth middleware attaches userId

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login again." });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    });

    await newOrder.save();

    // Clear user's cart after order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed", orderId: newOrder._id });
  } catch (error) {
    console.error("Error placing COD order:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Place Order with Stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;
    const { origin } = req.headers;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login again." });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    });

    await newOrder.save();

    const line_items = items.map(item => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Add delivery charge
    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error placing Stripe order:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🚧 Razorpay Placeholder
export const placeOrderRazorpay = async (req, res) => {
  res.status(501).json({ success: false, message: "Razorpay not implemented yet." });
};

// ✅ Admin: Get All Orders
export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const userOrder = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log(userId)

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};







// ✅ Admin: Update Order Status
export const updatestate = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("Error updating status:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
