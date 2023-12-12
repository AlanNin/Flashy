import mongoose, { Mongoose } from "mongoose";

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
        type: Map, // Puedes usar un Map para almacenar el progreso de cada video
        of: Number, // El valor será el porcentaje de progreso del video
        default: {},
    },
}, { timestamps: true }
);

export default mongoose.model("User", UserSchema);