import mongoose, { Mongoose } from "mongoose";

const VideoHistorySchema = new mongoose.Schema({
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
    },
    lastWatchedAt: {
        type: Date,
        default: Date.now,
    },
});

const PlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
        required: false,
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    creator: {
        type: String,
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
    }],
    followers: {
        type: [String],
        default: [],
    },
    privacy: {
        type: String,
        enum: ['public', 'private', 'unlisted'],
        default: 'public',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    displayname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    img: {
        type: String,
    },
    subscribers: {
        type: Number,
        default: 0
    },
    subscribedUsers: {
        type: [String],
    },
    videoProgress: {
        type: Map,
        of: Number,
        default: {},
    },
    videoHistory: {
        type: [VideoHistorySchema],
        default: [],
    },
    playlists: {
        type: [PlaylistSchema],
        default: function () {
            const userName = this.parent().displayname;
            const userId = this.parent()._id;
            return [{
                name: "Watch Later",
                videos: [],
                privacy: "private",
                creatorId: userId,
                creator: userName,
                createdAt: new Date(),
            }];
        },
    },
    followedPlaylists: [{
        playlistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Playlist',
        },
        followDate: {
            type: Date
        },
    }],
}, { timestamps: true }
);

export default mongoose.model("User", UserSchema);