import User from "../models/User.js";
import Video from "../models/Video.js";
import natural from 'natural';
import stringSimilarity from 'string-similarity';
import { createError } from "../error.js";
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import Mux from '@mux/mux-node';
import { v2 as cloudinary } from 'cloudinary';

const accessToken = '4c34dd9f-d2a7-447f-91c6-9b922f77d550';
const secret = '0uKUvBxqbOrPa+ZusHAa/zsz245OnkRptCkbiqvAoFoAV8sV7fl/8p12rG3eYSQTfJeDxzNaBTW';

const mux = new Mux(accessToken, secret);

cloudinary.config({
    cloud_name: 'dnepj9jjf',
    api_key: '161251231549537',
    api_secret: 'jHEIoLaGJP-xWJ-2qvJgvTCaUFU'
});

export const addVideo = async (req, res, next) => {
    const userId = req.user.id;
    const { privacy, ...videoData } = req.body;
    const renderVideo = req.body.renderingVideo;

    if (renderVideo) {

        try {
            const newVideo = new Video({ userId, privacy, ...videoData });
            const savedVideo = await newVideo.save();
            const videoId = savedVideo._id;
            const videoUrl = videoData.videoUrl;


            // Sube el video a Mux
            const MuxData = await mux.Video.Assets.create({
                input: videoUrl,
                "playback_policy": [
                    "public"
                ],
                "max_resolution_tier": "1080p",
                "encoding_tier": "smart"
            });

            const playbackId = MuxData.playback_ids[0].id;
            console.log("MuxData:", MuxData);
            console.log("playbackId:", playbackId);

            await Video.findByIdAndUpdate(videoId, {
                videoUrlStream: playbackId,
            });

            // Actualiza los URLs de los subtítulos en el documento de Video
            const updatedSubtitles = await Promise.all(videoData.subtitles.map(async (subtitle) => {
                // Sube el archivo de subtítulos a Cloudinary
                const cloudinaryResponse = await cloudinary.uploader.upload(subtitle.url, {
                    resource_type: 'raw', // Indica que el recurso no es una imagen
                    public_id: `subtitle_${videoId}_${subtitle.name}`,
                });

                // Retorna un objeto actualizado para este subtítulo
                return {
                    name: subtitle.name,
                    url: cloudinaryResponse.secure_url,
                };
            }));

            await Video.findByIdAndUpdate(videoId, {
                subtitles: updatedSubtitles,
            });

            res.status(200).json(savedVideo);
        } catch (err) {
            console.error("Error al añadir video:", err);
            next(err);
        }

    } else {

        try {
            const newVideo = new Video({ userId, privacy, ...videoData });
            const savedVideo = await newVideo.save();

            const videoId = savedVideo._id;

            // Actualiza los URLs de los subtítulos en el documento de Video
            const updatedSubtitles = await Promise.all(videoData.subtitles.map(async (subtitle) => {
                // Sube el archivo de subtítulos a Cloudinary
                const cloudinaryResponse = await cloudinary.uploader.upload(subtitle.url, {
                    resource_type: 'raw', // Indica que el recurso no es una imagen
                    public_id: `subtitle_${videoId}_${subtitle.name}`,
                });

                // Retorna un objeto actualizado para este subtítulo
                return {
                    name: subtitle.name,
                    url: cloudinaryResponse.secure_url,
                };
            }));

            await Video.findByIdAndUpdate(videoId, {
                subtitles: updatedSubtitles,
            });


            res.status(200).json(savedVideo);

        } catch (err) {
            console.error("Error al añadir video:", err);
            next(err);
        }
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
        const videoId = req.params.id;

        // Obtener la lista de usuarios que tienen el video en su historial
        const usersWithVideoInHistory = await User.find({ 'videoHistory.videoId': videoId });

        // Obtener la lista de usuarios que tienen el video en sus playlists
        const usersWithVideoInPlaylists = await User.find({ 'playlists.videos': videoId });

        // Obtener la lista de usuarios que tienen el video en su videoProgress
        const usersWithVideoInVideoProgress = await User.find({ [`videoProgress.${videoId}`]: { $exists: true } });

        // Eliminar el video del historial de cada usuario
        await Promise.all(
            usersWithVideoInHistory.map(async (user) => {
                user.videoHistory = user.videoHistory.filter(
                    (videoItem) => videoItem.videoId.toString() !== videoId
                );
                await user.save();
            })
        );

        // Eliminar el video de cada playlist de cada usuario
        await Promise.all(
            usersWithVideoInPlaylists.map(async (user) => {
                try {
                    // Verificar si el usuario aún existe en la base de datos
                    const existingUser = await User.findById(user._id);
                    if (!existingUser) {
                        console.warn(`User with id ${user._id} not found. Skipping.`);
                        return;
                    }

                    // Verificar que el usuario tenga listas de reproducción antes de intentar acceder
                    if (existingUser.playlists && Array.isArray(existingUser.playlists)) {
                        existingUser.playlists.forEach((playlist) => {
                            // Verificar que la playlist tenga videos antes de intentar acceder
                            if (playlist.videos && Array.isArray(playlist.videos)) {
                                // Filtrar los videos que no coinciden con el videoId
                                playlist.videos = playlist.videos.filter((playlistVideoId) => playlistVideoId.toString() !== videoId);
                            }
                        });

                        // Guardar el usuario solo si se han realizado cambios en las listas de reproducción
                        const playlistsModified = existingUser.playlists.some((playlist) => playlist.isModified('videos'));
                        if (playlistsModified) {
                            await existingUser.save();
                        }
                    }
                } catch (error) {
                    console.error(`Error updating playlists for user ${user._id}:`, error);
                }
            })
        );
        // Eliminar el video del videoProgress de cada usuario
        await Promise.all(
            usersWithVideoInVideoProgress.map(async (user) => {
                // Utilizar $unset para eliminar la propiedad del video en videoProgress
                const unsetQuery = { $unset: { [`videoProgress.${videoId}`]: 1 } };
                await User.findByIdAndUpdate(user._id, unsetQuery, { new: true });
            })
        );

        // Borrar el video
        const video = await Video.findById(videoId);
        if (!video) return next(createError(404, "Video not found!"));

        if (req.user.id === video.userId) {
            await Video.findByIdAndDelete(videoId);
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

export const addAllowedUserToPrivateVideo = async (req, res, next) => {
    const videoId = req.params.id;
    const userEmail = req.body.email;
    if (!userEmail) {
        return res.status(400).json({ message: "Invalid or missing email in the request body." });
    }


    try {
        const video = await Video.findById(videoId);
        if (!video) return next(createError(404, "Video not found!"));

        // Check if the user making the request is the owner of the video
        if (req.user.id !== video.userId) {
            return next(createError(403, "You can only modify your own video!"));
        }

        // Check if the user is already in the allowedUsers list
        if (video.allowedUsers.includes(userEmail)) {
            return res.status(400).json({ message: "User is already allowed." });
        }

        // Add the user's email to the allowedUsers array
        video.allowedUsers.push(userEmail);

        // Save the updated video
        const updatedVideo = await video.save();

        res.status(200).json(updatedVideo);
    } catch (err) {
        console.error("Error adding allowed user to video:", err);
        next(err);
    }
};

export const removeAllowedUserFromPrivateVideo = async (req, res, next) => {
    const videoId = req.params.id;
    const userEmail = req.body.email;
    if (!userEmail) {
        return res.status(400).json({ message: "Invalid or missing email in the request body." });
    }

    try {
        const video = await Video.findById(videoId);
        if (!video) return next(createError(404, "Video not found!"));

        // Check if the user making the request is the owner of the video
        if (req.user.id !== video.userId) {
            return next(createError(403, "You can only modify your own video!"));
        }

        // Check if the user is in the allowedUsers list
        const userIndex = video.allowedUsers.indexOf(userEmail);
        if (userIndex === -1) {
            return res.status(400).json({ message: "User is not in the allowed list." });
        }

        // Remove the user's email from the allowedUsers array
        video.allowedUsers.splice(userIndex, 1);

        // Save the updated video
        const updatedVideo = await video.save();

        res.status(200).json(updatedVideo);
    } catch (err) {
        console.error("Error removing allowed user from video:", err);
        next(err);
    }
};

export const getAllowedUsersForVideo = async (req, res, next) => {
    const videoId = req.params.id;

    try {
        const video = await Video.findById(videoId);
        if (!video) return next(createError(404, "Video not found!"));
        res.status(200).json({ allowedUsers: video.allowedUsers });
    } catch (err) {
        console.error("Error getting allowed users for video:", err);
        next(err);
    }
};




export const random = async (req, res, next) => {
    try {
        const videos = await Video.aggregate([
            { $match: { privacy: 'public' } },
            { $sample: { size: 40 } }
        ]);
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};


export const trend = async (req, res, next) => {
    try {
        const videos = await Video.find({ privacy: 'public' }).sort({ views: -1 });
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
                return await Video.find({ userId: channelId, privacy: 'public' });
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
        const videos = await Video.find({ tags: { $in: tags }, privacy: 'public' }).limit(20);
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
            privacy: 'public',
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
                    userId: { $in: subscribedChannels },
                    privacy: 'public' // Agrega esta condición
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
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const videos = await Video.aggregate([
            {
                $match: {
                    privacy: 'public', // Filtrar por privacidad pública
                    createdAt: {
                        $gte: startOfMonth,
                        $lte: endOfMonth,
                    },
                },
            },
            {
                $addFields: {
                    likesCount: { $size: "$likes" },
                    dislikesCount: { $size: "$dislikes" },
                },
            },
            {
                $sort: {
                    likesCount: -1,
                    dislikesCount: 1, // Ordenar por menos dislikes
                },
            },
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
                {
                    privacy: 'public', // Filtra por videos con privacy 'public'
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