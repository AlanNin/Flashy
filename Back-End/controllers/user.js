import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js"
import Comment from "../models/Comment.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';

const sendVerificationEmail = async (user) => {
    const verificationToken = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '1d' });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verificación de Cuenta',
        html: `<p>¡Gracias por registrarte! Haz clic en el siguiente enlace para verificar tu cuenta: <a href="${process.env.APP_URL}/confirm/${verificationToken}">Verificar cuenta</a></p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
    }
};

export const sendVerificationEmailRequest = async (req, res, next) => {
    try {

        const userId = req.user.id;

        const user = await User.findOne({ _id: userId });

        if (!user) {
            // Manejar el caso en que el usuario no se encuentre
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verifica si el correo ya está verificado
        if (user.isVerified) {
            return res.status(400).json({ error: 'El correo ya ha sido verificado' });
        }

        sendVerificationEmail(user, (error, successMessage) => {
            if (error) {
                return res.status(500).json({ error: 'Error al enviar el correo de verificación' });
            }
            res.status(200).json(successMessage);
        });

    } catch (error) {
        next(error);
    }
};

export const confirmAccount = async (req, res) => {
    try {
        const token = req.params.token;

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT);
        const newEmail = decoded.newEmail;

        // Verificar si el usuario ya está verificado
        if (decoded.isVerified) {
            // Puedes redirigir al usuario a una página de éxito o mostrar un mensaje
            return res.send('La cuenta ya ha sido verificada anteriormente.');
        }

        // Actualizar el campo isVerified del usuario en la base de datos
        const user = await User.findById(decoded.id);
        if (!user) {
            throw createError(404, 'Usuario no encontrado.');
        }

        if (!newEmail || newEmail === undefined) {
            user.isVerified = true;
        }

        await user.save();

        // Puedes redirigir al usuario a una página de éxito o mostrar un mensaje
        res.json({ success: true, message: 'Cuenta verificada con éxito.' });
    } catch (error) {
        // Manejar el error, por ejemplo, mostrar un mensaje de error o redirigir a una página de error
        console.error('Error en confirmAccount:', error);
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
};

const sendVerificationChangeEmail = async (userId, newEmail) => {
    const verificationToken = jwt.sign({ id: userId, newEmail: newEmail }, process.env.JWT, { expiresIn: '1d' });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: newEmail,
        subject: 'Verificar cambio de correo electrónico',
        html: `<p>¡Haz clic en el siguiente enlace para verificar tu nuevo correo electrónico: <a href="${process.env.APP_URL}/confirmEmail/${verificationToken}">Verificar correo</a></p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
    }
};

export const confirmEmailChange = async (req, res) => {
    try {
        const token = req.params.token;

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT);

        const newEmail = decoded.newEmail;

        // Actualizar el campo isVerified del usuario en la base de datos
        const user = await User.findById(decoded.id);
        if (!user) {
            throw createError(404, 'Usuario no encontrado.');
        }

        user.email = newEmail;
        await user.save();

        // Puedes redirigir al usuario a una página de éxito o mostrar un mensaje
        res.json({ success: true, message: 'Correo actualizado con éxito.' });
    } catch (error) {
        // Manejar el error, por ejemplo, mostrar un mensaje de error o redirigir a una página de error
        console.error('Error en confirmEmailChange:', error);
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
};

export const update = async (req, res, next) => {
    const { id } = req.params;
    const { currentPassword, newPassword, ...otherUpdates } = req.body;
    const userId = req.user.id;

    try {

        let updateData = {};

        // Verificar si se proporcionó una nueva contraseña y si el usuario existe
        if (newPassword) {
            const currentUser = await User.findById(id);
            if (!currentUser) {
                return next(createError(404, "Usuario no encontrado"));
            }

            // Verificar si la contraseña actual es correcta
            const isCorrectPassword = await bcrypt.compare(currentPassword, currentUser.password);

            if (!isCorrectPassword) {
                console.error("Credenciales incorrectas");
                return next(createError(401, "Credenciales incorrectas"));
            }

            // Encriptar la nueva contraseña
            const saltRounds = 10;
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

            updateData.password = hashedNewPassword;
        }

        if (otherUpdates.email) {

            const newEmail = otherUpdates.email;

            sendVerificationChangeEmail(userId, newEmail);
        }

        const { email, ...remainingUpdates } = otherUpdates;

        // Incluir otras actualizaciones en los datos de actualización
        updateData = { ...updateData, ...remainingUpdates };

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json(updatedUser);

    } catch (error) {
        next(error);
        console.log(error);
    }
};


export const remove = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            // Obtén el usuario
            const user = await User.findById(req.params.id);

            if (!user) {
                return next(createError(404, 'Usuario no encontrado.'));
            }

            // Elimina todos los videos del usuario
            await Video.deleteMany({ userId: req.params.id });

            // Elimina todos los comentarios del usuario
            await Comment.deleteMany({ userId: req.params.id });

            // Elimina al usuario
            await User.findByIdAndDelete(req.params.id);

            res.status(200).json('¡El usuario y sus datos relacionados han sido eliminados!');
        } catch (error) {
            next(error);
        }
    } else {
        return next(createError(403, '¡No puedes eliminar este usuario!'));
    }
};

const sendRecoverPassword = async (user) => {

    const recoveryCode = Math.floor(100000 + Math.random() * 900000);

    if (!user) {
        console.error('Usuario no encontrado.');
        return;
    }

    user.recoveryCode = recoveryCode;

    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Código de recuperación de contraseña',
        html: `<p>Tu código de recuperación de contraseña es: <strong>${recoveryCode}</strong></p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
    }
};


export const sendRecoverPasswordRequest = async (req, res, next) => {
    try {

        const userEmail = req.body.email;

        const user = await User.findOne({ email: userEmail });

        if (!user) {
            // Manejar el caso en que el usuario no se encuentre
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        sendRecoverPassword(user, (error, successMessage) => {
            if (error) {
                return res.status(500).json({ error: 'Error al enviar el correo de verificación' });
            }
            res.status(200).json(successMessage);
        });

    } catch (error) {
        next(error);
    }
};

export const confirmRecoverPasswordCode = async (req, res) => {
    const enteredCode = req.query.code;
    const userEmail = req.query.email;

    try {
        if (!userEmail) {
            throw createError(400, 'El correo electrónico es requerido.');
        }

        const user = await User.findOne({ email: userEmail });

        if (!user) {
            throw createError(404, 'Usuario no encontrado.');
        }

        if (enteredCode !== user.recoveryCode) {
            return res.json({ success: false, message: 'Código de recuperación incorrecto.' });
        }



        res.json({ success: true, message: 'Contraseña recuperada con éxito.' });
    } catch (error) {
        console.error('Error en confirmRecoverPasswordCode:', error);
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
};

export const recoverPasswordUpdatePassword = async (req, res, next) => {
    const userEmail = req.body.email;
    const newPassword = req.body.newPassword;

    try {
        // Verificar si se proporcionó una nueva contraseña y si el usuario existe
        if (!newPassword) {
            return next(createError(400, 'La nueva contraseña es requerida.'));
        }

        const currentUser = await User.findOne({ email: userEmail });

        if (!currentUser) {
            return next(createError(404, 'Usuario no encontrado.'));
        }

        // Encriptar la nueva contraseña
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Actualizar la contraseña en la base de datos
        const updatedUser = await User.findByIdAndUpdate(
            currentUser._id,
            { password: hashedNewPassword, recoveryCode: null },
            { new: true }
        );

        res.status(200).json({ success: true, user: updatedUser });

    } catch (error) {
        next(error);
        console.error(error);
    }
};

const sendRecoverUsername = async (user) => {

    if (!user) {
        console.error('Usuario no encontrado.');
        return;
    }

    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Recuperación de nombre de usuario',
        html: (() => {
            if (user.fromGoogle) {
                return `<p>Esta cuenta fue creada con Google</p>`;
            } else if (user.fromFacebook) {
                return `<p>Esta cuenta fue creada con Facebook</p>`;
            } else {
                return `<p>Tu nombre de usuario en Flashy es: <strong>${user.name}</strong></p>`;
            }
        })(),
    };

    try {
        const info = await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error('Error al enviar el correo de recuparación:', error);
    }
};


export const sendRecoverUsernameRequest = async (req, res, next) => {
    try {

        const userEmail = req.body.email;

        const user = await User.findOne({ email: userEmail });

        if (!user) {
            // Manejar el caso en que el usuario no se encuentre
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        sendRecoverUsername(user, (error, successMessage) => {
            if (error) {
                return res.status(500).json({ error: 'Error al enviar el correo de verificación' });
            }
            res.status(200).json(successMessage);
        });

    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

// GET USER BY USERNAME
export const getUserByUsername = async (req, res, next) => {
    try {
        const userName = req.params.username; // Assuming the parameter in the route is the username

        // Find the user by name
        const user = await User.findOne({ name: userName });

        if (!user) {
            return next(createError(404, "User not found!"));
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};


export const subscribe = async (req, res, next) => {
    try {
        // Verifica si el usuario ya está suscrito
        const isAlreadySubscribed = await User.exists({
            _id: req.params.id,
            subscribers: req.user.id,
        });

        if (!isAlreadySubscribed) {
            // Añade el ID del usuario suscrito al array de subscribers
            await User.findByIdAndUpdate(req.params.id, {
                $push: { subscribers: req.user.id },
            });

            // Añade el ID del usuario que realiza la suscripción al array subscribedUsers
            await User.findByIdAndUpdate(req.user.id, {
                $push: { subscribedUsers: req.params.id },
            });

            res.status(200).json("Subscription successful.");
        } else {
            res.status(400).json("User is already subscribed.");
        }
    } catch (err) {
        next(err);
        console.error(err);
    }
};


export const unsubscribe = async (req, res, next) => {
    try {
        // Remueve el ID del usuario que realiza la desuscripción del array subscribedUsers
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: req.params.id },
        });

        // Remueve el ID del usuario que se está desuscribiendo del array subscribers
        await User.findByIdAndUpdate(req.params.id, {
            $pull: { subscribers: req.user.id },
        });

        res.status(200).json("Unsubscription successful.");
    } catch (err) {
        next(err);
        console.error(err);
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

        return res.status(200).json("Historial de video actualizado exitosamente.");
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

        // Find the video in the user's history
        const videoIndex = user.videoHistory.findIndex(item => item.videoId.toString() === videoId);

        if (videoIndex !== -1) {
            // If the video is in the history, remove it
            const deletedVideo = user.videoHistory.splice(videoIndex, 1)[0];

            // Delete video progress
            if (deletedVideo) {
                const videoProgressKey = deletedVideo.videoId.toString();
                if (user.videoProgress.has(videoProgressKey)) {
                    user.videoProgress.delete(videoProgressKey);
                }
            }

            // Save the changes
            await user.save();

            res.status(200).json("Video removed from history and progress deleted successfully.");
        } else {
            res.status(404).json("Video not found in history.");
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

        // Get all video ids in the user's watch history
        const videoIdsInHistory = user.videoHistory.map(item => item.videoId.toString());

        // Clear all videos from the user's watch history
        user.videoHistory = [];

        // Delete video progress for all videos in the watch history
        videoIdsInHistory.forEach(videoId => {
            const videoProgressKey = videoId.toString();
            if (user.videoProgress.has(videoProgressKey)) {
                user.videoProgress.delete(videoProgressKey);
            }
        });

        // Save changes
        await user.save();

        res.status(200).json("Historial de videos borrado exitosamente y progreso eliminado.");
    } catch (error) {
        next(error);
    }
};


// ADD PLAYLIST
export const addPlaylist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const playlistData = req.body;
        const creatorName = req.body.creator;
        const playlistName = playlistData.name;
        const playlistImageURL = playlistData.image;
        const privacy = playlistData.privacy;

        const user = await User.findById(userId);

        // Crear la nueva playlist sin agregar video
        const newPlaylist = {
            name: playlistName,
            image: playlistImageURL,
            videos: [],
            creatorId: userId,
            creator: creatorName,
            privacy: privacy,
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

            // Actualizar el campo lastUpdated de la playlist
            playlist.lastUpdated = new Date();

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

            // Actualizar el campo lastUpdated de la playlist
            playlist.lastUpdated = new Date();

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
        const playlistId = req.params.playlistId;
        const { name, privacy, image, description } = req.body;

        const user = await User.findById(userId);

        // Buscar la playlist por ID
        const playlistToUpdate = user.playlists.find(
            (p) => p._id.toString() === playlistId
        );

        if (playlistToUpdate) {
            // Validar el valor de privacy
            const validPrivacyOptions = ['public', 'private', 'unlisted']; // Opciones válidas
            if (privacy && !validPrivacyOptions.includes(privacy)) {
                return res
                    .status(400)
                    .json({ error: 'La privacidad ingresada no es válida.' });
            }

            // Actualizar los datos de la playlist
            updateName(playlistToUpdate, name);
            updatePrivacy(playlistToUpdate, privacy);
            updateImage(playlistToUpdate, image);
            updateDescription(playlistToUpdate, description);

            // Guardar los cambios
            await user.save();

            res.status(200).json({ message: 'Playlist actualizada exitosamente.' });
        } else {
            res.status(404).json({ error: 'Playlist no encontrada.' });
        }
    } catch (error) {
        next(error);
    }
};

const updateName = (playlist, name) => {
    if (name) {
        playlist.name = name;
    }
};

const updatePrivacy = (playlist, privacy) => {
    if (privacy) {
        playlist.privacy = privacy;
    }
};

const updateImage = (playlist, image) => {
    if (image) {
        playlist.image = image;
    }
};

const updateDescription = (playlist, description) => {
    if (description) {
        playlist.description = description;
    }
};

// DELETE PLAYLIST DESCRIPTION
export const deletePlaylistDescription = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const playlistId = req.params.playlistId;

        const user = await User.findById(userId);

        // Buscar la playlist en las playlists del usuario
        const playlistIndex = user.playlists.findIndex(playlist => playlist._id.equals(playlistId));

        if (playlistIndex !== -1) {
            // Eliminar la descripción de la playlist
            user.playlists[playlistIndex].description = undefined;

            await user.save();

            res.status(200).json({ message: 'Playlist description deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Playlist not found.' });
        }
    } catch (error) {
        next(error);
    }
};

// GET VIDEOS FROM PLAYLIST
export const getVideosFromPlaylist = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const playlistId = req.params.playlistId;

        const user = await User.findById(userId);

        // Find the playlist by ID
        const playlist = user.playlists.find(p => p._id.toString() === playlistId);

        if (playlist) {
            // Get video details for each video in the playlist
            const videos = await Video.find({ _id: { $in: playlist.videos } });

            res.status(200).json({ videos });
        } else {
            res.status(404).json({ error: "Playlist not found." });
        }
    } catch (error) {
        next(error);
    }
};

// GET PLAYLIST BY ID
export const getPlaylistById = async (req, res, next) => {
    try {
        const playlistId = req.params.playlistId;

        // Buscar la playlist por su ID
        const playlist = await User.findOne({ "playlists._id": playlistId })
            .select(`playlists.$`)
            .exec();

        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found." });
        }

        const foundPlaylist = playlist.playlists[0];

        // Obtener información completa de los videos en la playlist
        const videos = await Video.find({ _id: { $in: foundPlaylist.videos } });
        const videosLength = videos.length;
        const lastVideo = videos[videos.length - 1];
        const defaultImage = lastVideo ? lastVideo.imgUrl : null;

        const playlistImage = foundPlaylist.image || defaultImage || 'https://firebasestorage.googleapis.com/v0/b/flashy-webapp.appspot.com/o/LogoFlashyP.png?alt=media&token=69ce369f-fb70-4cba-8642-3c8f66278976';

        // Verificar si la privacidad de la playlist no es "privada"
        if (foundPlaylist.privacy === 'private') {

            const playlistDetails = {
                privacy: foundPlaylist.privacy,
            };

            res.status(200).json(playlistDetails);
        }

        const playlistDetails = {
            _id: foundPlaylist._id,
            name: foundPlaylist.name,
            image: playlistImage,
            privacy: foundPlaylist.privacy,
            description: foundPlaylist.description,
            followers: foundPlaylist.followers,
            creatorId: foundPlaylist.creatorId,
            creator: foundPlaylist.creator,
            createdAt: foundPlaylist.createdAt,
            lastUpdated: foundPlaylist.lastUpdated,
            videosLength,
        };

        res.status(200).json(playlistDetails);
    } catch (error) {
        next(error);
    }
};

// GET VIDEO IDS FROM PLAYLIST
export const getVideoIdsFromPlaylist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const playlistId = req.params.playlistId;

        const user = await User.findById(userId);

        // Find the playlist by ID
        const playlist = user.playlists.find(p => p._id.toString() === playlistId);

        if (playlist) {
            // Extract only the videoIds from the playlist
            const videoIds = playlist.videos.map(videoId => videoId.toString());

            res.status(200).json({ videoIds });
        } else {
            res.status(404).json({ error: "Playlist not found." });
        }
    } catch (error) {
        next(error);
    }
};

// GET ALL PLAYLISTS CREATED BY USER
export const getAllUserPlaylists = async (req, res, next) => {
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

            const playlistImage = playlist.image || defaultImage || 'https://firebasestorage.googleapis.com/v0/b/flashy-webapp.appspot.com/o/LogoFlashyP.png?alt=media&token=69ce369f-fb70-4cba-8642-3c8f66278976';

            return {
                _id: playlist._id,
                name: playlist.name,
                image: playlistImage,
                privacy: playlist.privacy,
                description: playlist.description,
                followers: playlist.followers,
                creatorId: userId,
                creator: playlist.creator,
                createdAt: playlist.createdAt,
                lastUpdated: playlist.lastUpdated,
                videosLength,
            };
        }));

        res.status(200).json(playlistsWithDetails);
    } catch (error) {
        next(error);
    }
};

// GET ALL PLAYLISTS OF A USER, INCLUDING FOLLOWED
export const getAllUserPlaylistsAndFollowed = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        // Obtener información completa de las playlists del usuario
        const userPlaylists = await Promise.all(user.playlists.map(async (playlist) => {
            const videos = await Video.find({ _id: { $in: playlist.videos } });
            const videosLength = videos.length;
            const lastVideo = videos[videos.length - 1];
            const defaultImage = lastVideo ? lastVideo.imgUrl : null;

            const playlistImage = playlist.image || defaultImage || 'https://firebasestorage.googleapis.com/v0/b/flashy-webapp.appspot.com/o/LogoFlashyP.png?alt=media&token=69ce369f-fb70-4cba-8642-3c8f66278976';

            return {
                _id: playlist._id,
                name: playlist.name,
                image: playlistImage,
                privacy: playlist.privacy,
                description: playlist.description,
                followers: playlist.followers,
                creatorId: userId,
                creator: playlist.creator,
                createdAt: playlist.createdAt,
                lastUpdated: playlist.lastUpdated,
                videosLength,
            };
        }));

        // Obtener información completa de las playlists seguidas por el usuario
        const followedPlaylists = await Promise.all(user.followedPlaylists.map(async (followedPlaylist) => {
            const playlistId = followedPlaylist.playlistId;

            const foundUser = await User.findOne({ "playlists._id": playlistId })
                .select(`playlists.$`)
                .exec();

            if (!foundUser) {
                return null;
            }

            const foundPlaylist = foundUser.playlists[0];
            const videos = await Video.find({ _id: { $in: foundPlaylist.videos } });
            const videosLength = videos.length;
            const lastVideo = videos[videos.length - 1];
            const defaultImage = lastVideo ? lastVideo.imgUrl : null;

            const playlistImage = foundPlaylist.image || defaultImage || 'https://firebasestorage.googleapis.com/v0/b/flashy-webapp.appspot.com/o/LogoFlashyP.png?alt=media&token=69ce369f-fb70-4cba-8642-3c8f66278976';

            return {
                _id: foundPlaylist._id,
                name: foundPlaylist.name,
                image: playlistImage,
                privacy: foundPlaylist.privacy,
                description: foundPlaylist.description,
                followers: foundPlaylist.followers,
                creatorId: foundPlaylist.creatorId,
                creator: foundPlaylist.creator,
                createdAt: followedPlaylist.followDate,
                lastUpdated: foundPlaylist.lastUpdated,
                videosLength,
            };
        }));

        // Filtrar las playlists nulas (caso en el que la playlist seguida no existe)
        const validFollowedPlaylists = followedPlaylists.filter((playlist) => playlist !== null);

        // Combinar las playlists del usuario y las seguidas
        const allPlaylists = [...userPlaylists, ...validFollowedPlaylists];

        allPlaylists.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        res.status(200).json(allPlaylists);
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

// FOLLOW A PLAYLIST
export const followPlaylist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const playlistId = req.params.playlistId;
        const playlistOwner = await User.findOne({ "playlists._id": playlistId });
        const playlistToFollow = playlistOwner.playlists.id(playlistId);
        const user = await User.findById(userId);


        if (!playlistOwner) {
            return res.status(404).json({ error: "Playlist owner not found." });
        }
        if (userId === playlistOwner._id.toString()) {
            return res.status(400).json({ error: "Cannot follow your own playlist." });
        }
        if (!playlistToFollow) {
            return res.status(404).json({ error: "Playlist not found." });
        }
        if (user.followedPlaylists.some(entry => entry.playlistId.equals(playlistId))) {
            return res.status(400).json({ error: "Already following this playlist." });
        }

        // Añadir la playlist a las seguidas por el usuario con followDate
        user.followedPlaylists.push({
            playlistId: playlistId,
            followDate: new Date(),
        });

        await user.save();

        playlistToFollow.followers.push(userId);
        await playlistOwner.save();

        res.status(200).json({ message: "Playlist followed successfully." });
    } catch (error) {
        next(error);
    }
};

// UNFOLLOW A PLAYLIST
export const unfollowPlaylist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const playlistId = req.params.playlistId;

        const user = await User.findById(userId);

        // Buscar la entrada de la playlist que el usuario está siguiendo
        const playlistEntry = user.followedPlaylists.find(entry => entry.playlistId.equals(playlistId));

        if (!playlistEntry) {
            return res.status(400).json({ error: "Not following this playlist." });
        }

        // Eliminar la playlist de las seguidas por el usuario
        user.followedPlaylists = user.followedPlaylists.filter(entry => !entry.playlistId.equals(playlistId));
        await user.save();

        // Encuentra al propietario de la playlist
        const playlistOwner = await User.findOne({ "playlists._id": playlistId });

        if (!playlistOwner) {
            return res.status(404).json({ error: "Playlist owner not found." });
        }

        // Encuentra la playlist específica dentro del propietario
        const playlistToUnfollow = playlistOwner.playlists.id(playlistId);

        if (!playlistToUnfollow) {
            return res.status(404).json({ error: "Playlist not found." });
        }

        // Eliminar el ID del usuario del array de seguidores de la playlist
        playlistToUnfollow.followers = playlistToUnfollow.followers.filter(followerId => followerId !== userId);

        // Guarda los cambios en el propietario de la playlist
        await playlistOwner.save();

        res.status(200).json({ message: "Playlist unfollowed successfully." });
    } catch (error) {
        next(error);
    }
};

// CHECK IF PLAYLIST EXISTS
export const checkPlaylistExists = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const playlistIdToCheck = req.params.playlistId;

        const user = await User.findById(userId);

        // Verificar si user.playlists está definido y contiene elementos antes de realizar la comparación
        const playlistExists = user.playlists && user.playlists.some(p => p._id && p._id.equals(playlistIdToCheck));

        res.status(200).json({ playlistExists });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// GET NOTIFICATIONS
export const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Buscar el usuario por ID
        const user = await User.findById(userId);

        if (user) {
            // Obtener las notificaciones del usuario y ordenarlas por fecha descendente
            const notifications = user.notifications.sort((a, b) => b.createdAt - a.createdAt);

            res.status(200).json({ notifications });
        } else {
            res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        next(error);
        console.error(error);
    }
};

// MARK NOTIFICATION AS READ
export const markNotificationAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const notificationId = req.params.notificationId; // Assuming you have a route parameter for the notificationId

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Find the notification by ID
        const notification = user.notifications.find(notification => notification._id.toString() === notificationId);

        if (!notification) {
            return res.status(404).json({ error: "Notification not found." });
        }

        // Update the read field to true
        notification.read = true;

        // Save the updated user
        await user.save();

        res.status(200).json({ success: true, message: "Notification marked as read." });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// UPDATE NEW NOTIFICATIONS
export const incrementNewNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Increment the newNotifications field by 1
        user.newNotifications += 1;

        // Save the updated user
        await user.save();

        res.status(200).json({ success: true, message: 'New notification count incremented.' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// CLEAR NEW NOTIFICATIONS
export const resetNewNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Reset the newNotifications field to 0
        user.newNotifications = 0;

        // Save the updated user
        await user.save();

        res.status(200).json({ success: true, message: 'New notification count reset to 0.' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// GET USER SUSCRIBERS
export const getSubscribers = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        // Find the user by ID
        const user = await User.findById(userId);

        if (user) {
            // Return the array of subscriber IDs
            res.status(200).json({ subscribers: user.subscribers });
        } else {
            res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        next(error);
        console.error(error);
    }
};

// TOGGLE NOTIFICATIONS
export const toggleNotificationsEnabled = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Encuentra el usuario por su ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Alterna el valor de notificationsEnabled
        user.notificationsEnabled = !user.notificationsEnabled;

        // Guarda el usuario actualizado
        await user.save();

        // Devuelve la respuesta
        res.status(200).json({ success: true, notificationsEnabled: user.notificationsEnabled });
    } catch (error) {
        console.error(error);
        next(error);
    }
};