import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Attempt to connect to the database
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database Connected Successfully');
  } catch (error) {
    console.error('Database Connection Failed:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
