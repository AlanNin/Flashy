import mongoose, { Mongoose } from "mongoose";

const ReplySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    replyTo: {
        type: String,
        required: false,
    },
    desc: {
        type: String,
        required: true,
    },
    likes: {
        type: [String],
        default: [],
    },
    dislikes: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

const CommentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    videoId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    likes: {
        type: [String],
        default: [],
    },
    dislikes: {
        type: [String],
        default: [],
    },
    replies: [ReplySchema],
}, { timestamps: true });


export default mongoose.model("Comment", CommentSchema);