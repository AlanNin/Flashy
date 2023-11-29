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
}, { timestamps: true });

// Antes de guardar el video, calcular y almacenar la duración
VideoSchema.pre("save", async function (next) {
    try {
        const { videoUrl } = this;

        // Obtener la duración del video utilizando fluent-ffmpeg
        const ffprobeData = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(videoUrl, (err, data) => {
                if (err) {
                    console.error("Error obteniendo la duración:", err);
                    resolve({ format: { duration: 0 } }); // Establecer duración en 0 en caso de error
                } else {
                    resolve(data);
                }
            });
        });

        // Almacenar la duración en minutos (puedes ajustar según tus necesidades)
        this.duration = Math.floor(ffprobeData.format.duration / 60);

        next();
    } catch (error) {
        console.error("Error en la función pre-save:", error);
        next(error);
    }
});

export default mongoose.model("Video", VideoSchema);
