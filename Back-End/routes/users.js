import express from "express";
import cors from "cors";
import {
    update,
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
    getAllPlaylists,
    getPublicPlaylists,
    checkPlaylistExists,
    updatePlaylist,
    addPlaylist,
    getVideoIdsFromPlaylist,
} from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();
router.use(cors());

// UPDATE USER
router.put("/:id", verifyToken, update)

// REMOVE USER
router.delete("/:id", verifyToken, remove)

// GET A USER
router.get("/find/:id", getUser)

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
router.put("/:userId/videos/:videoId/history", verifyToken, updateVideoHistory);

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
router.delete("/:userId/playlists/:playlistId", verifyToken, deletePlaylist);

// DELETE VIDEO FROM PLAYLIST
router.delete("/:userId/playlists/:playlistId/videos/:videoId", verifyToken, deleteVideoFromPlaylist);

// GET ALL PLAYLISTS
router.get("/:userId/playlists", verifyToken, getAllPlaylists);

// GET PUBLIC PLAYLISTS
router.get("/:userId/playlists/public", verifyToken, getPublicPlaylists);

// GET VIDEOS FROM PLAYLIST
router.get("/:userId/playlists/:playlistId/videos", verifyToken, getVideosFromPlaylist);

// GET VIDEO IDS FROM PLAYLIST
router.get("/:userId/playlists/:playlistId/videosId", verifyToken, getVideoIdsFromPlaylist);

// UPDATE PLAYLIST
router.put("/:userId/playlists/update", verifyToken, updatePlaylist);

// CHECK IF PLAYLIST EXISTS
router.post("/:userId/playlists/check/:name", verifyToken, checkPlaylistExists);


export default router;