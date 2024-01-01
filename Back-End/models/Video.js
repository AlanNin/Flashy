import mongoose from "mongoose";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath('D:/VS Studio Main (Codes)/ffmpeg-6.1-essentials_build/bin/ffmpeg.exe');
ffmpeg.setFfprobePath('D:/VS Studio Main (Codes)/ffmpeg-6.1-essentials_build/bin/ffprobe.exe');

const VideoSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        required: true,
    },
    imgUrlVertical: {
        type: String,
        required: true,
    },
    imgUrlLandscape: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    videoUrlStream: {
        type: String,
    },
    thumbnails: {
        type: String,
    },
    duration: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    tags: {
        type: [String],
        default: [],
    },
    likes: {
        type: [String],
        default: [],
    },
    dislikes: {
        type: [String],
        default: [],
    },
    privacy: {
        type: String,
        enum: ['public', 'private', 'unlisted'],
        default: 'public',
    },
    allowedUsers: {
        type: [String],
        default: [],
    },
    language: {
        type: String,
        required: true,
    },
    subtitles: [
        {
            name: {
                type: String,
            },
            url: {
                type: String,
            },
        }
    ],
}, { timestamps: true });


VideoSchema.pre("save", async function (next) {
    try {
        const { videoUrl } = this;

        const ffprobeData = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(videoUrl, (err, data) => {
                if (err) {
                    console.error("Error obteniendo la duración:", err);
                    resolve({ format: { duration: 0 } });
                } else {
                    resolve(data);
                }
            });
        });

        this.duration = Math.floor(ffprobeData.format.duration);

        next();
    } catch (error) {
        console.error("Error en la función pre-save:", error);
        next(error);
    }
});

export default mongoose.model("Video", VideoSchema);
