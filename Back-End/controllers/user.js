import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js"
import Comment from "../models/Comment.js";
import Reply from "../models/Comment.js";
import { v4 as uuidv4 } from 'uuid';

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

// MANAGE USER HISTORY
export const updateVideoHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const videoId = req.params.videoId;

        const user = await User.findById(userId);

        // Buscar el video en el historial del usuario
        const videoIndex = user.videoHistory.findIndex(item => item.videoId.toString() === videoId);

        if (videoIndex !== -1) {
            // Si el video ya está en el historial, actualizar la última vez que fue visto
            user.videoHistory[videoIndex].lastWatchedAt = Date.now();
        } else {
            // Si el video no está en el historial, agregarlo
            user.videoHistory.push({
                videoId: videoId,
                lastWatchedAt: Date.now(),
            });
        }

        // Guardar los cambios
        await user.save();

        res.status(200).json("Historial de video actualizado exitosamente.");
    } catch (error) {
        next(error);
    }
};


// GET HISTORY VIDEOS
export const getVideoHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Buscar el usuario por ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Obtener el historial de videos del usuario con la información completa de cada video
        const videoHistory = await Video.populate(user.videoHistory, { path: 'videoId' });

        res.status(200).json(videoHistory);
    } catch (error) {
        next(error);
    }
};

// DELETE VIDEO FROM USER HISTORY
export const deleteVideoFromHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const videoId = req.params.videoId;

        const user = await User.findById(userId);

        // Buscar el video en el historial del usuario
        const videoIndex = user.videoHistory.findIndex(item => item.videoId.toString() === videoId);

        if (videoIndex !== -1) {
            // Si el video está en el historial, eliminarlo
            user.videoHistory.splice(videoIndex, 1);

            // Guardar los cambios
            await user.save();

            res.status(200).json("Video eliminado del historial exitosamente.");
        } else {
            res.status(404).json("Video no encontrado en el historial.");
        }
    } catch (error) {
        next(error);
    }
};

// CLEAR ALL WATCH HISTORY
export const clearAllWatchHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Clear all videos from the user's watch history
        user.videoHistory = [];

        // Save changes
        await user.save();

        res.status(200).json("Historial de videos borrado exitosamente.");
    } catch (error) {
        next(error);
    }
};

// ADD PLAYLIST
export const addPlaylist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userEmail = req.body.email;
        const playlistData = req.body;
        const playlistName = playlistData.name;
        const playlistImageURL = playlistData.image;
        const privacy = playlistData.privacy;
        const allowedUsersPlaylist = playlistData.allowedUsersPlaylist || [];

        const user = await User.findById(userId);

        // Verificar si ya existe una playlist con el mismo nombre
        const playlistExists = user.playlists.some(p => p.name === playlistName);

        if (playlistExists) {
            return res.status(400).json({ error: "Ya existe una playlist con el mismo nombre." });
        }

        // Agregar el email del usuario que hace la solicitud al array
        if (!allowedUsersPlaylist.includes(userEmail)) {
            allowedUsersPlaylist.push(userEmail);
        }

        // Crear la nueva playlist sin agregar video
        const newPlaylist = {
            name: playlistName,
            image: playlistImageURL,
            videos: [],
            privacy: privacy,
            allowedUsersPlaylist: allowedUsersPlaylist,
        };

        user.playlists.push(newPlaylist);

        // Guardar los cambios
        await user.save();

        res.status(200).json({ message: "Playlist creada exitosamente." });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// ADD VIDEO TO PLAYLIST
export const addVideoToPlaylist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const videoId = req.params.videoId;
        const playlistData = req.body;
        const playlistId = playlistData.playlistId;

        const user = await User.findById(userId);

        // Buscar la playlist por ID
        const playlist = user.playlists.find(p => p._id.toString() === playlistId);

        if (playlist) {
            // Si la playlist existe, agregar el video
            playlist.videos.push(videoId);

            // Guardar los cambios
            await user.save();

            res.status(200).json({ message: "Video agregado a la playlist exitosamente." });
        } else {
            // Si la playlist no existe, retornar un error
            res.status(404).json({ error: "La playlist no existe." });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};


// DELETE PLAYLIST
export const deletePlaylist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const playlistId = req.params.playlistId;

        const user = await User.findById(userId);

        // Filtrar las playlists para excluir la que se desea eliminar
        user.playlists = user.playlists.filter(p => p._id.toString() !== playlistId);

        // Guardar los cambios
        await user.save();

        res.status(200).json({ message: "Playlist eliminada exitosamente." });
    } catch (error) {
        next(error);
    }
};

// DELETE VIDEO FROM PLAYLIST
export const deleteVideoFromPlaylist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const playlistId = req.params.playlistId;
        const videoId = req.params.videoId;

        const user = await User.findById(userId);

        // Buscar la playlist por ID
        const playlist = user.playlists.find(p => p._id.toString() === playlistId);

        if (playlist) {
            // Filtrar los videos para excluir el que se desea eliminar
            playlist.videos = playlist.videos.filter(v => v.toString() !== videoId);

            // Guardar los cambios
            await user.save();

            res.status(200).json({ message: "Video eliminado de la playlist exitosamente." });
        } else {
            res.status(404).json({ error: "Playlist no encontrada." });
        }
    } catch (error) {
        next(error);
    }
};

// UPDATE PLAYLIST
export const updatePlaylist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { playlistId, name, privacy, image } = req.body;

        const user = await User.findById(userId);

        // Buscar la playlist por ID
        const playlistToUpdate = user.playlists.find(p => p._id.toString() === playlistId);

        if (playlistToUpdate) {
            // Validar el valor de privacy
            const validPrivacyOptions = ['public', 'private', 'unlisted']; // Opciones válidas
            if (privacy && !validPrivacyOptions.includes(privacy)) {
                return res.status(400).json({ error: "La privacidad ingresada no es válida." });
            }

            // Actualizar los datos de la playlist si se proporcionan
            if (name) {
                playlistToUpdate.name = name;
            }
            if (privacy) {
                playlistToUpdate.privacy = privacy;
            }
            if (image) {
                playlistToUpdate.image = image;
            }

            // Guardar los cambios
            await user.save();

            res.status(200).json({ message: "Playlist actualizada exitosamente." });
        } else {
            res.status(404).json({ error: "Playlist no encontrada." });
        }
    } catch (error) {
        next(error);
    }
};

// GET VIDEOS FROM PLAYLIST
export const getVideosFromPlaylist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const playlistId = req.params.playlistId;
        const shareToken = req.query.shareToken; // Obtener el token de compartición de la consulta

        const user = await User.findById(userId);

        // Buscar la playlist por ID
        const playlist = user.playlists.find(p => p._id.toString() === playlistId);

        if (playlist) {
            // Verificar la privacidad de la playlist
            if (playlist.privacy === 'public' ||
                (playlist.privacy === 'unlisted' && shareToken === playlist.shareToken)) {
                // Consultar la información completa de cada video usando los IDs
                const videos = await Video.find({ _id: { $in: playlist.videos } });

                res.status(200).json(videos);
            } else {
                // La playlist no es accesible
                res.status(403).json({ error: "Acceso no autorizado a la playlist." });
            }
        } else {
            res.status(404).json({ error: "Playlist no encontrada." });
        }
    } catch (error) {
        next(error);
    }
};


// GET ALL PLAYLISTS
export const getAllPlaylists = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        const playlistsWithDetails = await Promise.all(user.playlists.map(async (playlist) => {
            // Obtener la información completa de cada video usando los IDs
            const videos = await Video.find({ _id: { $in: playlist.videos } });
            const videosLength = videos.length;

            // Configurar la imagen por defecto como la imagen del último video agregado
            const lastVideo = videos[videos.length - 1];
            const defaultImage = lastVideo ? lastVideo.imgUrl : null;

            return {
                _id: playlist._id,
                name: playlist.name,
                image: playlist.image || defaultImage,
                privacy: playlist.privacy,
                videosLength,
            };
        }));

        res.status(200).json(playlistsWithDetails);
    } catch (error) {
        next(error);
    }
};

// GET PUBLIC PLAYLISTS
export const getPublicPlaylists = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        // Filtrar las playlists para incluir solo las públicas
        const publicPlaylists = user.playlists.filter(playlist => playlist.privacy === 'public');

        const playlistsWithDetails = await Promise.all(publicPlaylists.map(async (playlist) => {
            // Obtener la información completa de cada video usando los IDs
            const videos = await Video.find({ _id: { $in: playlist.videos } });
            const videosLength = videos.length;

            // Configurar la imagen por defecto como la imagen del último video agregado
            const lastVideo = videos[videos.length - 1];
            const defaultImage = lastVideo ? lastVideo.imgUrl : null;

            return {
                _id: playlist._id,
                name: playlist.name,
                image: playlist.image || defaultImage,
                privacy: playlist.privacy,
                videosLength,
            };
        }));

        res.status(200).json(playlistsWithDetails);
    } catch (error) {
        next(error);
    }
};

// CHECK IF PLAYLIST EXISTS
export const checkPlaylistExists = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const playlistNameToCheck = req.params.name.toLowerCase();  // Convertir a minúsculas

        const user = await User.findById(userId);

        // Verificar si user.playlists está definido y contiene elementos antes de realizar la comparación
        const playlistExists = user.playlists && user.playlists.some(p => p.name && p.name.toLowerCase() === playlistNameToCheck);

        res.status(200).json({ playlistExists });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
