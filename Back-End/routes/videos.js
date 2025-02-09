import express from "express";
import cors from "cors";
import {
    addVideo,
    addView,
    deleteVideo,
    getByTag,
    findByTag,
    getVideo,
    random,
    getByLikes,
    search,
    sub,
    trend,
    updateVideo,
    TrendingSub,
    getRelatedVideos,
    saveVideoProgress,
    getVideoProgress,
    addAllowedUserToPrivateVideo,
    removeAllowedUserFromPrivateVideo,
    getAllowedUsersForVideo,
    getAllUserVideos,
    getAllPublicUserVideos,
} from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router()
router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// CREATE A VIDEO
router.post("/", verifyToken, addVideo)

// UPDATE A VIDEO
router.put("/:id/update", verifyToken, updateVideo)

// DELETE A VIDEO
router.delete("/:id/delete", verifyToken, deleteVideo)

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

// GET VIDEO BY TAG
router.get("/tag/:tag", findByTag)

// GET VIDEO BY TITLE
router.get("/search", search)

// GET RELATES VIDEOS
router.get("/related/:id", getRelatedVideos);

// SAVE USER VIDEO PROGRESS
router.post('/saveUserProgress/:id', verifyToken, saveVideoProgress);

// GET USER VIDEO PROGRESS
router.get('/userProgress/:id', verifyToken, getVideoProgress);

// ALLOW USER TO PRIVATE VIDEO
router.post('/:id/allowedUsers', verifyToken, addAllowedUserToPrivateVideo);

// REMOVE ALLOWED USER TO PRIVATE VIDEO
router.delete('/:id/allowedUsers', verifyToken, removeAllowedUserFromPrivateVideo);

// GET ALLOWED USERS TO PRIVATE VIDEO
router.get('/:id/allowedUsers', getAllowedUsersForVideo);

// GET ALL USER VIDEOS
router.get('/user/allvideos', verifyToken, getAllUserVideos);

// GET PUBLIC VIDEOS FROM USER 
router.get('/user/:userId/publicVideos', getAllPublicUserVideos);

export default router;