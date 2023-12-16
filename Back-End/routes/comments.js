import express from "express";
import cors from "cors";
import { addComment, deleteComment, getComments, addReply, deleteReply, getReplies } from "../controllers/comment.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();
router.use(cors());

// AGREGAR COMENTARIO
router.post("/", verifyToken, addComment)

// ELIMINAR COMENTARIO
router.delete("/:id", verifyToken, deleteComment)

// CONSEGUIR COMENTARIOS 
router.get("/:videoId", getComments)

// AGREGAR RESPUESTA A COMENTARIO
router.post("/:commentId/replies", verifyToken, addReply);

// ELIMINAR RESPUESTA DE COMENTARIO
router.delete("/:commentId/replies/:replyId", verifyToken, deleteReply);

// CONSEGUIR RESPUESTAS DE COMENTARIO
router.get("/:commentId/replies", getReplies);

export default router;