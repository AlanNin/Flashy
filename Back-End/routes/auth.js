import express from "express";
import cors from "cors";
import { signin, signup } from "../controllers/auth.js";

const router = express.Router();
router.use(cors());

// CREATE A USER
router.post("/signup", signup);

// SIGN IN
router.post("/signin", signin)

// GOOGLE AUTH
router.post("/google", /* handle Google auth */);

export default router;
