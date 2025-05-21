// routes/orderRoute.js
import express from 'express';
import { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrder, updatestate } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updatestate);

// Payment Features
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);

// User Router
orderRouter.get('/userorders', userOrder);

export default orderRouter;
