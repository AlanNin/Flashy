import User from "../models/User.js";
import Video from "../models/Video.js";
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
    const tags = req.params.tags.split(",");
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
export const getSubscribedChannels = async (req, res, next) => {
    try {
        let user;
        if (req.params.channelId) {
            user = await User.findById(req.params.channelId);
        } else  {
            user = await User.findById(req.user.id);
        }
        const subscribedChannels = user.subscribedUsers;

        const channels = await Promise.all(
            subscribedChannels.map(async (id) => {
                const channel = await User.findById(id);
             return channel;
            })
        );
        res.status(200).json(channels);
    } catch (error) {
        next(error);
    }
};

  export const getVideosByChannel = async (req, res, next) => {
    try {
        const channelId = req.params.channelId; 

        const videos = await Video.find({ userId: channelId }).sort({ createdAt: -1 });

        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }


};

export const getPopularVideosByChannel = async (req, res, next) => {
    try {
        const channelId = req.params.channelId;

        // Obtener videos del canal ordenados por cantidad de vistas
        const videos = await Video.find({ userId: channelId }).sort({ views: -1 });

        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};

export const getLikedVideosByChannel = async (req, res, next) => {
    try {
        const channelId = req.params.channelId;

        // Obtener videos del canal ordenados por cantidad de likes
        const videos = await Video.aggregate([
            { $match: { userId: channelId } },
            {
                $addFields: {
                    likesCount: { $size: "$likes" }
                }
            },
            { $sort: { likesCount: -1 } }
        ]);

        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};

export const getOldVideosByChannel = async (req, res, next) => {
    try {
        const channelId = req.params.channelId;

        // Obtener videos del canal ordenados por fecha de creación ascendente (los más antiguos primero)
        const videos = await Video.find({ userId: channelId }).sort({ createdAt: 1 });

        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};

export const searchByChannel = async (req, res, next) => {
    const query = req.query.q;
    const channelId = req.query.channelId;  

    try {
      
        const videos = await Video.find({
            userId: channelId,  
            title: { $regex: query, $options: "i" },
        }).limit(40);

        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};
