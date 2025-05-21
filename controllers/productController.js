import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

// Function to add a product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, bestseller } = req.body;

    // Extract uploaded files
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    // Upload images to Cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    // Prepare product data
    const productData = {
      name,
      description,
      category,
      price: Number(price),
      image: imagesUrl, // Save uploaded image URLs
      bestseller: bestseller === 'true' || bestseller===true,
      date: Date.now(),
    };

    // Save the product
    const product = new productModel(productData);
    await product.save();

    console.log("Product Added Successfully" , product)

    res.status(201).json({ success: true, message: 'Added Successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function to list products
export const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({ success: true, message: 'Success', products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function to remove a product
export const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function for single product info
export const singleProduct = async (req, res) => {
  try {
    const {productId} = req.body; // Use params for the product ID
    const product = await productModel.findById(productId );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
