import express from "express";
import cors from "cors";
import { addVideo, addView, deleteVideo, getByTag, getVideo, random, getByLikes, search, sub, trend, updateVideo, TrendingSub, getRelatedVideos } from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router()
router.use(cors());

// CREATE A VIDEO
router.post("/", verifyToken, addVideo)

// UPDATE A VIDEO
router.put("/:id", verifyToken, updateVideo)

// DELETE A VIDEO
router.delete("/:id", verifyToken, deleteVideo)

// GET A VIDEO
router.get("/find/:id", getVideo)

// VIEWS VIDEO
router.put("/view/:id", addView)

// TREND VIDEO
router.get("/trend", trend)

// MOST LIKED VIDEOS
router.get("/mostliked", getByLikes)

// TREND AND SUBBED
router.get("/trendsub", verifyToken, TrendingSub)

// RANDOM VIDEO
router.get("/random", random)

// SUBSCRIBED CHANNELS VIDEO
router.get("/sub", verifyToken, sub)

// GET VIDEO BY TAG
router.get("/tags", getByTag)

// GET VIDEO BY TITLE
router.get("/search", search)

// GET RELATES VIDEOS
router.get("/related/:id", getRelatedVideos);

export default router;