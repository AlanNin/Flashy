import Comment from "../models/Comment.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";

export const addComment = async (req, res, next) => {
    const newComment = new Comment({ ...req.body, userId: req.user.id })
    try {
        const savedComment = await newComment.save()
        res.status(200).send(savedComment)
    } catch (error) {
        next(error)
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id)
        const video = await Video.findById(req.params.id)
        if (req.user.id === comment.userId || req.user.id === video.userId) {
            await Comment.findByIdAndDelete(req.params.id)
            res.status(200).json("El comentario ha sido eliminado.")
        } else {
            return next(createError(403, "No puedes eliminar este comentario!"));
        }
    } catch (error) {
        next(error)
    }
}
export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ videoId: req.params.videoId })
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}

export const addReply = async (req, res, next) => {
    const { commentId } = req.params;
    const newReply = {
        ...req.body,
        userId: req.user.id,
    };

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(createError(404, "Comentario no encontrado"));
        }

        comment.replies.push(newReply);
        const savedComment = await comment.save();

        res.status(200).json(savedComment);
    } catch (error) {
        next(error);
    }
}

export const deleteReply = async (req, res, next) => {
    const { commentId, replyId } = req.params;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(createError(404, "Comentario no encontrado"));
        }

        const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId);
        if (replyIndex === -1) {
            return next(createError(404, "Respuesta no encontrada"));
        }

        comment.replies.splice(replyIndex, 1);
        const savedComment = await comment.save();

        res.status(200).json(savedComment);
    } catch (error) {
        next(error);
    }
}

export const getReplies = async (req, res, next) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(createError(404, "Comentario no encontrado"));
        }

        const replies = comment.replies;
        res.status(200).json(replies);
    } catch (error) {
        next(error);
    }
}

