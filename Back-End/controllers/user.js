import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js"
import Comment from "../models/Comment.js";
import Reply from "../models/Comment.js";

export const update = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },
                { new: true });
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    } else {
        return next(createError(403, "¡No puedes actualizar este usuario!"))
    }
}

export const remove = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id
            );
            res.status(200).json("¡El usuario ha sido eliminado!");
        } catch (error) {
            next(error);
        }
    } else {
        return next(createError(403, "¡No puedes eliminar este usuario!"))
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const subscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.id },
        });
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 },
        });
        res.status(200).json("Subscription successfull.")
    } catch (err) {
        next(err);
    }
};

export const unsubscribe = async (req, res, next) => {
    try {
        try {
            await User.findByIdAndUpdate(req.user.id, {
                $pull: { subscribedUsers: req.params.id },
            });
            await User.findByIdAndUpdate(req.params.id, {
                $inc: { subscribers: -1 },
            });
            res.status(200).json("Unsubscription successfull.")
        } catch (err) {
            next(err);
        }
    } catch (err) {
        next(err);
    }
};

export const like = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        const video = await Video.findById(videoId);

        // Verifica si el usuario ya había dado like al video
        const alreadyLiked = video.likes.includes(id);

        // Si ya había dado like, remuévelo, de lo contrario, agrégalo
        const updateObject = alreadyLiked
            ? { $pull: { likes: id } }
            : { $addToSet: { likes: id }, $pull: { dislikes: id } };

        await Video.findByIdAndUpdate(videoId, updateObject, { new: true });

        const message = alreadyLiked
            ? "Has quitado tu like a este video."
            : "Te ha gustado este video.";

        res.status(200).json(message);
    } catch (err) {
        next(err);
    }
};

export const dislike = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        const video = await Video.findById(videoId);

        // Verifica si el usuario ya había dado dislike al video
        const alreadyDisliked = video.dislikes.includes(id);

        // Si ya había dado dislike, remuévelo, de lo contrario, agrégalo
        const updateObject = alreadyDisliked
            ? { $pull: { dislikes: id } }
            : { $addToSet: { dislikes: id }, $pull: { likes: id } };

        await Video.findByIdAndUpdate(videoId, updateObject, { new: true });

        const message = alreadyDisliked
            ? "Has quitado tu dislike a este video."
            : "No te ha gustado este video.";

        res.status(200).json(message);
    } catch (err) {
        next(err);
    }
};

export const likeComment = async (req, res, next) => {
    const userId = req.user.id;
    const commentId = req.params.commentId;

    try {
        const comment = await Comment.findById(commentId);

        // Verifica si el usuario ya había dado like al comentario
        const alreadyLiked = comment.likes.includes(userId);

        // Si ya había dado like, remuévelo, de lo contrario, agrégalo
        const updateObject = alreadyLiked
            ? { $pull: { likes: userId } }
            : { $addToSet: { likes: userId }, $pull: { dislikes: userId } };

        await Comment.findByIdAndUpdate(commentId, updateObject, { new: true });

        const message = alreadyLiked
            ? "Has quitado tu like a este comentario."
            : "Te ha gustado este comentario.";

        res.status(200).json(message);
    } catch (err) {
        next(err);
    }
};

export const dislikeComment = async (req, res, next) => {
    const userId = req.user.id;
    const commentId = req.params.commentId;

    try {
        const comment = await Comment.findById(commentId);

        // Verifica si el usuario ya había dado dislike al comentario
        const alreadyDisliked = comment.dislikes.includes(userId);

        // Si ya había dado dislike, remuévelo, de lo contrario, agrégalo
        const updateObject = alreadyDisliked
            ? { $pull: { dislikes: userId } }
            : { $addToSet: { dislikes: userId }, $pull: { likes: userId } };

        await Comment.findByIdAndUpdate(commentId, updateObject, { new: true });

        const message = alreadyDisliked
            ? "Has quitado tu dislike a este comentario."
            : "No te ha gustado este comentario.";

        res.status(200).json(message);
    } catch (err) {
        next(err);
    }
};

// LIKE A REPLY
export const likeReply = async (req, res, next) => {
    const userId = req.user.id;
    const { commentId, replyId } = req.params;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const reply = comment.replies.id(replyId);

        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        // Check if the user already liked the reply
        const alreadyLiked = reply.likes.includes(userId);

        // If already liked, remove the like; otherwise, add the like and remove dislike
        if (alreadyLiked) {
            reply.likes.pull(userId);
        } else {
            reply.likes.push(userId);
            reply.dislikes.pull(userId);
        }

        // Manually update updatedAt
        reply.updatedAt = new Date();

        // Save the parent Comment document
        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};

// DISLIKE A REPLY
export const dislikeReply = async (req, res, next) => {
    const userId = req.user.id;
    const { commentId, replyId } = req.params;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const reply = comment.replies.id(replyId);

        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        // Check if the user already disliked the reply
        const alreadyDisliked = reply.dislikes.includes(userId);

        // If already disliked, remove the dislike; otherwise, add the dislike and remove like
        if (alreadyDisliked) {
            reply.dislikes.pull(userId);
        } else {
            reply.dislikes.push(userId);
            reply.likes.pull(userId);
        }

        // Manually update updatedAt
        reply.updatedAt = new Date();

        // Save the parent Comment document
        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};
