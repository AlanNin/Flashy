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
    description: {
        type: String,
    },
    videosPosted: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isWatchHistoryPaused: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
    },
    img: {
        type: String,
    },
    banner: {
        type: String,
    },
    fromFacebook: {
        type: Boolean,
        default: false,
    },
    fromGoogle: {
        type: Boolean,
        default: false,
    },
    recoveryCode: {
        type: String,
    },
    subscribers: {
        type: [String],
    },
    subscribedUsers: {
        type: [String],
    },
    newNotifications: {
        type: Number,
        default: 0
    },
    notificationsEnabled: {
        type: Boolean,
        default: true,
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
    notifications: [{
        videoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        read: {
            type: Boolean,
            default: false,
        },
    }],
}, { timestamps: true }
);

export default mongoose.model("User", UserSchema);