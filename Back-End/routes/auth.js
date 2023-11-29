import express from "express";
import cors from "cors";
import { signin, signup, SigninGoogleAuth, SignupGoogleAuth } from "../controllers/auth.js";

const router = express.Router();
router.use(cors());

// CREATE A USER
router.post("/signup", signup);

// SIGN IN
router.post("/signin", signin)

// SIGN IN GOOGLE AUTH
router.post("/googlesignin", SigninGoogleAuth);

// CREATE A USER GOOGLE AUTH
router.post("/googlesignup", SignupGoogleAuth);

export default router;
