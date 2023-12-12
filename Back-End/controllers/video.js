import User from "../models/User.js";
import Video from "../models/Video.js";
import natural from 'natural';
import stringSimilarity from 'string-similarity';
import { createError } from "../error.js";

export const addVideo = async (req, res, next) => {
    const newVideo = new Video({ userId: req.user.id, ...req.body });
    try {
        const savedVideo = await newVideo.save();
        res.status(200).json(savedVideo);
    } catch (err) {
        next(err);
    }
};

export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "Video not found!"));
        if (req.user.id === video.userId) {
            const updatedVideo = await Video.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(200).json(updatedVideo);
        } else {
            return next(createError(403, "You can update only your video!"));
        }
    } catch (err) {
        next(err);
    }
};

export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "Video not found!"));
        if (req.user.id === video.userId) {
            await Video.findByIdAndDelete(req.params.id);
            res.status(200).json("The video has been deleted.");
        } else {
            return next(createError(403, "You can delete only your video!"));
        }
    } catch (err) {
        next(err);
    }
};

export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        res.status(200).json(video);
    } catch (err) {
        next(err);
    }
};

export const addView = async (req, res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 },
        });
        res.status(200).json("The view has been increased.");
    } catch (err) {
        next(err);
    }
};

export const random = async (req, res, next) => {
    try {
        const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const trend = async (req, res, next) => {
    try {
        const videos = await Video.find().sort({ views: -1 });
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const sub = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;

        const list = await Promise.all(
            subscribedChannels.map(async (channelId) => {
                return await Video.find({ userId: channelId });
            })
        );

        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
        next(err);
    }
};

export const getByTag = async (req, res, next) => {
    const tags = req.query.tags.split(",");
    try {
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const search = async (req, res, next) => {
    const query = req.query.q;
    try {
        const videos = await Video.find({
            title: { $regex: query, $options: "i" },
        }).limit(40);
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const TrendingSub = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;

        const videos = await Video.aggregate([
            {
                $match: {
                    userId: { $in: subscribedChannels }
                }
            },
            {
                $sort: { views: -1, createdAt: -1 } // Ordena por cantidad de vistas
            }
        ]);

        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};

export const getByLikes = async (req, res, next) => {
    try {
        const videos = await Video.aggregate([
            {
                $addFields: {
                    likesCount: { $size: "$likes" }
                }
            },
            {
                $sort: { likesCount: -1 }
            }
        ]);

        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};

export const getRelatedVideos = async (req, res, next) => {
    try {
        const currentVideo = await Video.findById(req.params.id);

        if (!currentVideo) {
            return next(createError(404, "Video not found!"));
        }

        const titleKeywords = currentVideo.title.split(" ");

        const regexPatterns = titleKeywords
            .filter(keyword => !/\bs\d+:\w+X?\b/i.test(keyword))
            .map(keyword => new RegExp(keyword, 'i'));

        const relatedVideos = await Video.find({
            $and: [
                {
                    $or: [
                        { title: { $in: titleKeywords } },
                        { title: { $in: regexPatterns } },
                    ],
                },
                {
                    _id: {
                        $ne: currentVideo._id,
                    },
                },
                {
                    userId: currentVideo.userId, // Filtra por el mismo usuario
                },
            ],
        });

        res.status(200).json(relatedVideos);
    } catch (err) {
        next(err);
    }
};

export const saveVideoProgress = async (req, res, next) => {
    const userId = req.user.id;
    const videoId = req.params.id;
    const progress = req.body.progress; // Este valor debería ser el porcentaje de progreso

    try {
        // Encuentra al usuario por su ID
        const user = await User.findById(userId);

        // Verifica si el usuario ya tiene progreso para este video
        if (user.videoProgress.has(videoId)) {
            // Si ya existe, actualiza el progreso existente
            user.videoProgress.set(videoId, progress);
        } else {
            // Si no existe, agrega un nuevo registro de progreso para el video
            user.videoProgress.set(videoId, progress);
        }

        // Guarda los cambios en el usuario
        await user.save();

        res.status(200).json("Video progress saved successfully.");
    } catch (err) {
        next(err);
    }
};

export const getVideoProgress = async (req, res, next) => {
    const userId = req.user.id;
    const videoId = req.params.id;

    try {
        // Encuentra al usuario por su ID
        const user = await User.findById(userId);

        // Verifica si el usuario tiene progreso para este video
        if (user.videoProgress.has(videoId)) {
            const progress = user.videoProgress.get(videoId);
            res.status(200).json({ progress });
        } else {
            // Si no hay progreso registrado, devuelve 0 o cualquier valor predeterminado
            res.status(200).json({ progress: 0 });
        }
    } catch (err) {
        next(err);
    }
};