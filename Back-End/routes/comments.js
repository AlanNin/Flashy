import express from "express";
import cors from "cors";
import { addComment, deleteComment, getComments, addReply, deleteReply, getReplies, editComment, editReply, reportComment, reportReply } from "../controllers/comment.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();
router.use(cors());

// AGREGAR COMENTARIO
router.post("/", verifyToken, addComment)

// ELIMINAR COMENTARIO
router.delete("/:id", verifyToken, deleteComment)

// EDITAR COMENTARIO
router.put('/:id', verifyToken, editComment);

// CONSEGUIR COMENTARIOS 
router.get("/:videoId", getComments)

// AGREGAR RESPUESTA A COMENTARIO
router.post("/:commentId/replies", verifyToken, addReply);

// ELIMINAR RESPUESTA DE COMENTARIO
router.delete("/:commentId/replies/:replyId", verifyToken, deleteReply);

// EDITAR RESPUESTA DE COMENTARIO
router.put("/:commentId/replies/:replyId", verifyToken, editReply);

// CONSEGUIR RESPUESTAS DE COMENTARIO
router.get("/:commentId/replies", getReplies);

// REPORTAR COMENTARIO
router.post("/:commentId/report", verifyToken, reportComment);

// REPORTAR RESPUESTA
router.post("/:commentId/replies/:replyId/report", verifyToken, reportReply);

export default router;