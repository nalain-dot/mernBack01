import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'hero' or 'logo'
  url: { type: String, required: true },
  format: { type: String, required: true }, // 'image' or 'video'
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Media", mediaSchema);
