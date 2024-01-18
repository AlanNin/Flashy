import User from "../models/User.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";
import Mux from '@mux/mux-node';
import { v2 as cloudinary } from 'cloudinary';
import { io } from '../index.js';

const accessToken = process.env.MuxAccessToken;
const secret = process.env.MuxSecret;

const mux = new Mux(accessToken, secret);

cloudinary.config({
    cloud_name: process.env.CloudinaryCloudName,
    api_key: process.env.CloudinaryApiKey,
    api_secret: process.env.CloudinaryApiSecret
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

            await Video.findByIdAndUpdate(videoId, {
                videoUrlStream: playbackId,
            });


            if (videoData.subtitles && videoData.subtitles.length > 0) {
                const updatedSubtitles = await Promise.all(videoData.subtitles.map(async (subtitle) => {
                    try {
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
                    } catch (uploadError) {
                        console.error(`Error uploading subtitle "${subtitle.name}":`, uploadError);
                        // Puedes manejar el error de carga de subtítulos aquí
                        // Puedes retornar el subtítulo original sin cambios o hacer otra lógica de manejo de errores
                        return subtitle;
                    }
                }));

                // Actualiza solo si hay subtítulos
                if (updatedSubtitles.length > 0) {
                    await Video.findByIdAndUpdate(videoId, {
                        subtitles: updatedSubtitles,
                    });
                }
            }

            if (savedVideo.privacy === 'public') {
                // Notifica a los suscriptores
                const creator = await User.findById(userId);
                const subscribers = await User.find({ _id: { $in: creator.subscribers } });

                const notificationPromises = subscribers.map(async (subscriber) => {
                    subscriber.notifications.push({
                        videoId,
                    });

                    subscriber.newNotifications += 1;

                    await subscriber.save();
                });

                await Promise.all(notificationPromises);

                io.emit('newVideo', { videoId, userId: savedVideo.userId });
            }

            await User.findByIdAndUpdate(userId, {
                $inc: { videosPosted: 1 }
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

            if (videoData.subtitles && videoData.subtitles.length > 0) {
                const updatedSubtitles = await Promise.all(videoData.subtitles.map(async (subtitle) => {
                    try {
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
                    } catch (uploadError) {
                        console.error(`Error uploading subtitle "${subtitle.name}":`, uploadError);
                        // Puedes manejar el error de carga de subtítulos aquí
                        // Puedes retornar el subtítulo original sin cambios o hacer otra lógica de manejo de errores
                        return subtitle;
                    }
                }));

                // Actualiza solo si hay subtítulos
                if (updatedSubtitles.length > 0) {
                    await Video.findByIdAndUpdate(videoId, {
                        subtitles: updatedSubtitles,
                    });
                }
            }

            if (savedVideo.privacy === 'public') {
                // Notifica a los suscriptores
                const creator = await User.findById(userId);
                const subscribers = await User.find({ _id: { $in: creator.subscribers } });

                const notificationPromises = subscribers.map(async (subscriber) => {
                    subscriber.notifications.push({
                        videoId,
                    });

                    subscriber.newNotifications += 1;

                    await subscriber.save();
                });

                await Promise.all(notificationPromises);



                io.emit('newVideo', { videoId, userId: savedVideo.userId });
            }

            await User.findByIdAndUpdate(userId, {
                $inc: { videosPosted: 1 }
            });

            res.status(200).json(savedVideo);

        } catch (err) {
            console.error("Error al añadir video:", err);
            next(err);
        }
    }

};

export const updateVideo = async (req, res, next) => {
    const userId = req.user.id;
    const videoId = req.params.id;
    const { privacy, ...videoData } = req.body;

    try {
        // Verificar si el usuario tiene permisos para actualizar el video
        const existingVideo = await Video.findById(videoId);
        if (!existingVideo || existingVideo.userId.toString() !== userId) {
            throw createError(403, "No tienes permisos para actualizar este video.");
        }

        // Actualizar información del video
        await Video.findByIdAndUpdate(videoId, { privacy, ...videoData });

        // Actualizar subtítulos si se proporcionan
        if (videoData.subtitles && videoData.subtitles.length > 0) {
            const updatedSubtitles = await Promise.all(videoData.subtitles.map(async (subtitle) => {
                try {
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
                } catch (uploadError) {
                    console.error(`Error uploading subtitle "${subtitle.name}":`, uploadError);
                    // Puedes manejar el error de carga de subtítulos aquí
                    // Puedes retornar el subtítulo original sin cambios o hacer otra lógica de manejo de errores
                    return subtitle;
                }
            }));

            // Actualiza solo si hay subtítulos
            if (updatedSubtitles.length > 0) {
                await Video.findByIdAndUpdate(videoId, {
                    subtitles: updatedSubtitles,
                });
            }
        }

        res.status(200).json({ message: "Video actualizado correctamente." });
    } catch (err) {
        console.error("Error al actualizar el video:", err);
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

        // Obtener la lista de usuarios que tienen notificaciones relacionadas con el video
        const usersWithVideoNotifications = await User.find({ 'notifications.videoId': videoId });

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

        // Eliminar las notificaciones del video para cada usuario
        await Promise.all(
            usersWithVideoNotifications.map(async (user) => {
                user.notifications = user.notifications.filter(
                    (notification) => notification.videoId.toString() !== videoId
                );
                await user.save();
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

            await User.findByIdAndUpdate(video.userId, {
                $inc: { videosposted: -1 }
            });

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

export const findByTag = async (req, res, next) => {
    const tags = req.params.tag;
    try {
        const videos = await Video.find({ tags: { $in: tags }, privacy: 'public' }).limit(20);
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

// SEARCH VIDEOS AND PLAYLIST
export const search = async (req, res, next) => {
    const query = req.query.q;

    try {
        const usersWithPlaylists = await User.find({
            'playlists': {
                $elemMatch: {
                    $and: [
                        { name: { $regex: query, $options: "i" } },
                        { privacy: 'public' }
                    ]
                }
            }
        }).limit(40);

        const playlists = [];

        for (const user of usersWithPlaylists) {
            for (const playlist of user.playlists) {
                if (playlist.name.match(new RegExp(query, 'i'))) {
                    const videosLength = playlist.videos.length;

                    // Logica para manejar las imágenes
                    const lastVideoId = videosLength > 0 ? playlist.videos[videosLength - 1] : null;

                    let defaultImage = null;

                    if (lastVideoId) {
                        const lastVideo = await Video.findById(lastVideoId);
                        defaultImage = lastVideo ? lastVideo.imgUrl : null;
                    }

                    const playlistImage = playlist.image || defaultImage || 'https://firebasestorage.googleapis.com/v0/b/flashy-webapp.appspot.com/o/LogoFlashyP.png?alt=media&token=69ce369f-fb70-4cba-8642-3c8f66278976';

                    playlist.image = playlistImage;

                    playlists.push(playlist);
                }
            }
        }

        // Busca videos coincidentes
        const matchingVideos = await Video.find({
            $and: [
                {
                    $or: [
                        { title: { $regex: query, $options: "i" } },
                        { tags: { $in: [query] } }
                    ]
                },
                { privacy: 'public' }
            ]
        }).limit(40);

        // Busca usuarios coincidentes
        const matchingUsers = await User.find({
            $or: [
                { displayname: { $regex: query, $options: "i" } },
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        }).limit(40);

        res.status(200).json({
            playlists,
            videos: matchingVideos,
            users: matchingUsers,
        });
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
        // Calculate the date a month ago
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        // Aggregate to find the top videos based on likes and dislikes within the last month
        const videos = await Video.aggregate([
            {
                $match: {
                    createdAt: { $gte: oneMonthAgo }, // Videos within the last month
                },
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    title: 1,
                    desc: 1,
                    imgUrl: 1,
                    imgUrlVertical: 1,
                    imgUrlLandscape: 1,
                    videoUrl: 1,
                    duration: 1,
                    views: 1,
                    tags: 1,
                    likes: 1,
                    dislikes: 1,
                    privacy: 1,
                    allowedUsers: 1,
                    language: 1,
                    subtitles: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1,
                },
            },
            {
                $addFields: {
                    likesCount: { $size: "$likes" }, // Count likes
                    dislikesCount: { $size: "$dislikes" }, // Count dislikes
                },
            },
            {
                $sort: {
                    likesCount: -1, // Sort by most likes
                    dislikesCount: 1, // Secondary sort by least dislikes
                },
            },
            {
                $limit: 10, // Get the top 10 videos
            },
        ]);

        res.status(200).json(videos);
    } catch (err) {
        next(err);
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

// GET All VIDEOS FROM USER 
export const getAllUserVideos = async (req, res, next) => {
    const userId = req.user.id;
    const { sort } = req.query;

    try {
        let userVideos;

        switch (sort) {
            case 'latest':
                userVideos = await Video.find({ userId: userId }).sort({ createdAt: -1 });
                break;
            case 'popular':
                userVideos = await Video.find({ userId: userId }).sort({ views: -1 });
                break;
            case 'oldest':
                userVideos = await Video.find({ userId: userId }).sort({ createdAt: 1 });
                break;
            default:
                userVideos = await Video.find({ userId: userId });
        }

        res.status(200).json(userVideos);
    } catch (err) {
        next(err);
    }
};



// GET PUBLIC VIDEOS FROM USER 
export const getAllPublicUserVideos = async (req, res, next) => {
    const userId = req.params.userId;
    const { sort } = req.query; // Obtén el parámetro de consulta "sort"

    try {
        let userPublicVideos;

        // Verifica el valor de "sort" y aplica la ordenación correspondiente
        switch (sort) {
            case 'latest':
                userPublicVideos = await Video.find({ userId: userId, privacy: 'public' }).sort({ createdAt: -1 });
                break;
            case 'popular':
                userPublicVideos = await Video.find({ userId: userId, privacy: 'public' }).sort({ views: -1 });
                break;
            case 'oldest':
                userPublicVideos = await Video.find({ userId: userId, privacy: 'public' }).sort({ createdAt: 1 });
                break;
            default:
                // Si no se proporciona un valor válido para "sort", devolver todos los videos públicos sin ordenar
                userPublicVideos = await Video.find({ userId: userId, privacy: 'public' });
        }

        res.status(200).json(userPublicVideos);
    } catch (err) {
        next(err);
    }
};
