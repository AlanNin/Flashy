import express from "express";
import cors from "cors";
import { addComment, deleteComment, getComments } from "../controllers/comment.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();
router.use(cors());

// AGREGAR COMENTARIO
router.post("/", verifyToken, addComment)

// ELIMINAR COMENTARIO
router.delete("/:id", verifyToken, deleteComment)

// CONSEGUIR COMENTARIOS 
router.get("/:videoId", getComments)

export default router;