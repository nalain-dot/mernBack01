import express from "express";
import upload from "../middleware/multer.js";
import { uploadHeroMedia, getMediaByType } from "../controllers/mediaController.js";

const router = express.Router();

// Allow up to 3 files for hero, 1 for logo (controlled in controller)
router.post("/upload", upload.array("media", 3), uploadHeroMedia);

router.get("/:type", getMediaByType);

export default router;
