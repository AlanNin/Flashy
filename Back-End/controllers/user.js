import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js"

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

