import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Load environment variables
import connectDB from './config/mongoDb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// Initialize the Express app
const app = express();

// Load PORT from environment variables
const PORT = process.env.PORT || 4000;

// Connect to the database and Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json({ limit: '10mb' })); // Parse JSON with increased size limit
app.use(cors());

// Base Routes
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'API is Working!' });
});

// User and Product Routes
app.use('/api/user', userRouter); // User login & admin routes
app.use('/api/product', productRouter); // Product management routes
app.use('/api/cart' , cartRouter)
app.use('/api/order' , orderRouter)

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message,
  });
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
