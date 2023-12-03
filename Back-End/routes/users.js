import express from "express";
import cors from "cors";
import { update, remove, getUser, subscribe, unsubscribe, like, dislike } from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();
router.use(cors());

// UPDATE USER
router.put("/:id", verifyToken, update)

// REMOVE USER
router.delete("/:id", verifyToken, remove)

// GET A USER
router.get("/find/:id", getUser)

// SUBSCRIBE A USER
router.put("/sub/:id", verifyToken, subscribe)

// UNSUBSCRIBE A USER
router.put("/unsub/:id", verifyToken, unsubscribe)

// LIKE A VIDEO
router.put("/like/:videoId", verifyToken, like)

// DISLIKE A VIDEO
router.put("/dislike/:videoId", verifyToken, dislike)


export default router;