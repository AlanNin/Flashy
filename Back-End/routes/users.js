import express from "express";
import cors from "cors";
import {
    update,
    upsertUserDescription,
    remove,
    getUser,
    subscribe,
    unsubscribe,
    like,
    dislike,
    likeComment,
    dislikeComment,
    likeReply,
    dislikeReply,
    updateVideoHistory,
    getVideoHistory,
    deleteVideoFromHistory,
    clearAllWatchHistory,
    addVideoToPlaylist,
    deletePlaylist,
    deleteVideoFromPlaylist,
    getVideosFromPlaylist,
    getAllUserPlaylists,
    getAllUserPlaylistsAndFollowed,
    getPublicPlaylists,
    checkPlaylistExists,
    updatePlaylist,
    deletePlaylistDescription,
    addPlaylist,
    getVideoIdsFromPlaylist,
    followPlaylist,
    unfollowPlaylist,
    getPlaylistById,
    sendVerificationEmailRequest,
    confirmAccount,
    confirmEmailChange,
    sendRecoverPasswordRequest,
    confirmRecoverPasswordCode,
    recoverPasswordUpdatePassword,
    sendRecoverUsernameRequest,
    getNotifications,
    markNotificationAsRead,
    incrementNewNotifications,
    resetNewNotifications,
    getSubscribers,
    toggleNotificationsEnabled,
    getUserByUsername,
    getAllPlaylists,
    toggleWatchHistoryPaused,
} from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));


// UPDATE USER
router.put("/:id/update", verifyToken, update)

// AÑADIR O EDITAR DESCRIPCIÓN DEL USUARIO
router.post('/updateDescription/', verifyToken, upsertUserDescription);

// REMOVE USER
router.delete("/:id/remove", verifyToken, remove)

// GET A USER
router.get("/find/:id", getUser)

// GET A USER BY USERNAME
router.get("/findbyusername/:username", getUserByUsername)

// SUBSCRIBE A USER
router.put("/sub/:id", verifyToken, subscribe)

// UNSUBSCRIBE A USER
router.put("/unsub/:id", verifyToken, unsubscribe)

// LIKE A VIDEO
router.put("/like/:videoId", verifyToken, like)

// DISLIKE A VIDEO
router.put("/dislike/:videoId", verifyToken, dislike)

// LIKE A COMMENT
router.put("/likecomment/:commentId", verifyToken, likeComment);

// DISLIKE A COMMENT
router.put("/dislikecomment/:commentId", verifyToken, dislikeComment);

// LIKE A REPLY
router.put('/likereply/:commentId/:replyId', verifyToken, likeReply);

// DISLIKE A REPLY
router.put('/dislikereply/:commentId/:replyId', verifyToken, dislikeReply);

// UPDATE VIDEO HISTORY
router.put("/:userId/videos/:videoId/history", updateVideoHistory);

// GET VIDEO HISTORY
router.get('/:id/history', verifyToken, getVideoHistory);

// DELETE A SPECIFIC VIDEO FROM WATCH HISTORY
router.delete('/:userId/videos/:videoId/history', verifyToken, deleteVideoFromHistory);

// CLEAR ALL WATCH HISTORY
router.delete('/:id/history/clear', verifyToken, clearAllWatchHistory);

// ADD PLAYLIST
router.post("/:userId/playlists", verifyToken, addPlaylist);

// ADD VIDEO TO PLAYLIST
router.put("/:userId/playlists/videos/:videoId", verifyToken, addVideoToPlaylist);

// DELETE PLAYLIST
router.delete("/playlists/:playlistId/delete", verifyToken, deletePlaylist);

// DELETE VIDEO FROM PLAYLIST
router.delete("/playlists/:playlistId/videos/:videoId/delete", verifyToken, deleteVideoFromPlaylist);

// GET PLAYLISTS BY ID
router.get('/playlists/:playlistId', getPlaylistById);

// GET ALL PLAYLISTS CREATED BY USER AND FOLLOWED
router.get("/:userId/playlists", verifyToken, getAllUserPlaylists);

// GET ALL PLAYLISTS CREATED BY USER AND FOLLOWED
router.get("/:userId/playlists-followed", verifyToken, getAllUserPlaylistsAndFollowed);

// GET ALL PLAYLISTS CREATED BY USER
router.get("/playlists/", verifyToken, getAllPlaylists);

// GET PUBLIC PLAYLISTS
router.get("/:userId/playlists/public", verifyToken, getPublicPlaylists);

// GET VIDEOS FROM PLAYLIST
router.get("/:userId/playlists/:playlistId/videos", getVideosFromPlaylist);

// GET VIDEO IDS FROM PLAYLIST
router.get("/:userId/playlists/:playlistId/videosId", verifyToken, getVideoIdsFromPlaylist);

// UPDATE PLAYLIST
router.put("/playlists/:playlistId/update", verifyToken, updatePlaylist);

// DELETE PLAYLIST DESCRIPTION
router.delete('/playlists/:playlistId/delete-description', verifyToken, deletePlaylistDescription);

// FOLLOW A PLAYLIST
router.post('/playlists/follow/:playlistId/', verifyToken, followPlaylist);

// UNFOLLOW A PLAYLIST
router.delete("/playlists/unfollow/:playlistId", verifyToken, unfollowPlaylist);

// CHECK IF PLAYLIST EXISTS
router.post("/:userId/playlists/check/:playlistId", verifyToken, checkPlaylistExists);

// CONFIRM ACCOUNT REQUEST
router.post('/emailVerification', verifyToken, sendVerificationEmailRequest);

// CONFIRM ACCOUNT
router.get('/confirm/:token', confirmAccount);

// CONFIRM EMAIL CHANGE REQUEST
router.get('/confirmEmailChange/:token', confirmEmailChange);

// RECOVER PASSWORD REQUEST
router.post('/recoverpassword', sendRecoverPasswordRequest);

// CONFIRM RECOVER PASSWORD REQUEST
router.get('/confirmRecoverCode', confirmRecoverPasswordCode);

// RECOVER PASSWORD SET NEW PASSWORD
router.post('/recoverPasswordUpdatePassword', recoverPasswordUpdatePassword);

// RECOVER USERNAME REQUEST
router.post('/recoverusername', sendRecoverUsernameRequest);

// GET NOTIFICATIONS
router.get('/notifications', verifyToken, getNotifications);

// MARK NOTIFICATION AS READ
router.put("/notifications/:notificationId/mark-as-read", verifyToken, markNotificationAsRead);

// INCREMENT NEW NOTIFICATIONS
router.put('/notifications/increment-new-notifications', verifyToken, incrementNewNotifications);

// CLEAR NEW NOTIFICATIONS
router.put('/notifications/reset-new-notifications', verifyToken, resetNewNotifications);

// GET USER SUSCRIBERS
router.get('/:userId/subscribers', getSubscribers);

// TOGGLE NOTIFICATIONS
router.post('/toggle-notifications', verifyToken, toggleNotificationsEnabled);

// TOGGLE NOTIFICATIONS
router.post('/toggle-watchHistoryPaused', verifyToken, toggleWatchHistoryPaused);

export default router;