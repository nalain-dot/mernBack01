import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  bestseller: { type: Boolean, default: false }, // Fix: Adding default value and type
  date: { type: Number, required: true },
});

// Correcting the model definition
const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
