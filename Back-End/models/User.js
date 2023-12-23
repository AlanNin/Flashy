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
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
    }],
    privacy: {
        type: String,
        enum: ['public', 'private', 'unlisted'],
        default: 'public',
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
        default: [{
            name: "Watch Later",
            videos: [],
            privacy: "private",
        }],
    },
}, { timestamps: true }
);

export default mongoose.model("User", UserSchema);