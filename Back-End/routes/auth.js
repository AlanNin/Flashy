import express from "express";
import cors from "cors";
import { signin, signup, SigninExternalAuth, SignupExternalAuth, checkName, checkEmail, checkPassword } from "../controllers/auth.js";

const router = express.Router();
router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// CREATE A USER
router.post("/signup", signup);

// SIGN IN
router.post("/signin", signin)

// SIGN IN EXTERNAL
router.post("/externalsignin", SigninExternalAuth);

// CREATE A USER EXTERNAL
router.post("/externalsignup", SignupExternalAuth);

// CHECK NAME
router.post("/checkname", checkName);

// CHECK EMAIL
router.post("/checkemail", checkEmail);

// CHECK PASSWORD
router.post("/checkpassword", checkPassword);

export default router;
