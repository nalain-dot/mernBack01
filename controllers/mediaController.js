import cloudinary from "../config/cloudinary.js";
import Media from "../models/Media.js";
import fs from "fs";

export const uploadHeroMedia = async (req, res) => {
  try {
    const { type } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    if (!["hero", "logo"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    if (type === "hero" && files.length > 3) {
      return res.status(400).json({ success: false, message: "Maximum 3 hero images allowed" });
    }

    if (type === "logo" && files.length > 1) {
      return res.status(400).json({ success: false, message: "Only one logo allowed" });
    }

    const uploadResults = [];

    for (const file of files) {
      const resourceType = file.mimetype.startsWith("video") ? "video" : "image";

      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: resourceType,
        folder: "heroUploads",
        public_id: `${Date.now()}-${file.originalname}`,
      });

      uploadResults.push({
        url: result.secure_url,
        format: resourceType,
      });

      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    if (type === "hero") {
      await Media.deleteMany({ type: "hero" });

      const mediaDocs = uploadResults.map((item) => ({
        type,
        url: item.url,
        format: item.format,
      }));

      await Media.insertMany(mediaDocs);
      return res.status(201).json({ success: true, media: mediaDocs });

    } else if (type === "logo") {
      await Media.deleteMany({ type: "logo" });

      const media = new Media({
        type,
        url: uploadResults[0].url,
        format: uploadResults[0].format,
      });

      await media.save();
      return res.status(201).json({ success: true, media });
    }

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMediaByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!["hero", "logo"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    const mediaItems = await Media.find({ type }).sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      media: mediaItems,
    });
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
