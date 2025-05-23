import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Load environment variables
import connectDB from './config/mongoDb.js';
import './config/cloudinary.js'; // Just import to initialize config (no need to call a function)
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import mediaRoutes from './routes/mediaRoutes.js';

// Initialize the Express app
const app = express();

// Load PORT from environment variables
const PORT = process.env.PORT || 4000;

// Connect to the database
connectDB();

// Middlewares
app.use(express.json({ limit: '10mb' })); // Parse JSON with increased size limit
app.use(cors());

// Base Route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'API is Working!' });
});

// Routes
app.use('/api/user', userRouter);        // User login & admin routes
app.use('/api/product', productRouter);  // Product management routes
app.use('/api/cart', cartRouter);        // Cart routes
app.use('/api/order', orderRouter);      // Order routes
app.use('/api/media', mediaRoutes);      // Media upload routes

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
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
