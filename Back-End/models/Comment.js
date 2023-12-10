import mongoose, { Mongoose } from "mongoose";

const ReportSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
}, { timestamps: true });
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
    edited: {
        type: Boolean,
        default: false,
    },
    editedAt: {
        type: Date,
        default: null,
    },
    reports: {
        type: [ReportSchema],
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
    edited: {
        type: Boolean,
        default: false,
    },
    editedAt: {
        type: Date,
        default: null,
    },
    reports: {
        type: [ReportSchema],
        default: [],
    },
    replies: [ReplySchema],
}, { timestamps: true });


export default mongoose.model("Comment", CommentSchema);