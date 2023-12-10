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
};

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
};

export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return next(createError(404, "Comentario no encontrado"));
        }

        if (req.user.id !== comment.userId) {
            return next(createError(403, "No tienes permiso para editar este comentario"));
        }

        comment.desc = req.body.desc;
        comment.edited = true;
        comment.editedAt = new Date();

        const updatedComment = await comment.save();

        res.status(200).json(updatedComment);
    } catch (error) {
        next(error);
    }
};

export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ videoId: req.params.videoId })
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
};

export const reportComment = async (req, res, next) => {
    const { commentId } = req.params;
    const { userId, reason } = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(createError(404, "Comentario no encontrado"));
        }

        const existingReport = comment.reports.find(report => report.userId === userId);
        if (existingReport) {
            return next(createError(400, "Ya has reportado este comentario"));
        }

        comment.reports.push({ userId, reason });
        await comment.save();

        // Devuelve solo la información necesaria
        res.status(200).json({ message: "Comentario reportado exitosamente" });
    } catch (error) {
        next(error);
    }
};


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
};

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
};

export const editReply = async (req, res, next) => {
    try {
        const { commentId, replyId } = req.params;
        const { desc } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(createError(404, "Comment not found"));
        }

        const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId);
        if (replyIndex === -1) {
            return next(createError(404, "Reply not found"));
        }

        const reply = comment.replies[replyIndex];
        if (req.user.id !== reply.userId) {
            return next(createError(403, "You are not allowed to edit this reply"));
        }

        reply.desc = desc;
        reply.edited = true;

        const editedComment = await comment.save();

        res.status(200).json(editedComment);
    } catch (error) {
        next(error);
    }
};

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
};

export const reportReply = async (req, res, next) => {
    const { commentId, replyId } = req.params;
    const { userId, reason } = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(createError(404, "Comentario no encontrado"));
        }

        const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId);
        if (replyIndex === -1) {
            return next(createError(404, "Respuesta no encontrada"));
        }

        const reply = comment.replies[replyIndex];

        const existingReport = reply.reports.find(report => report.userId === userId);
        if (existingReport) {
            return next(createError(400, "Ya has reportado esta respuesta"));
        }

        reply.reports.push({ userId, reason });
        await comment.save();

        // Devuelve solo la información necesaria
        res.status(200).json({ message: "Respuesta reportada exitosamente" });
    } catch (error) {
        next(error);
    }
};





