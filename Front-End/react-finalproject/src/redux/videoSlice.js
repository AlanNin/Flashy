import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentVideo: null,
    loading: false,
    error: false,
};

export const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        fetchStart: (state) => {
            state.loading = true;
        },
        fetchSuccess: (state, action) => {
            state.loading = false;
            state.currentVideo = action.payload;
        },
        fetchFailure: (state) => {
            state.loading = false;
            state.error = true;
        },
        like: (state, action) => {
            const userId = action.payload;
            const currentVideo = { ...state.currentVideo };

            const likeIndex = currentVideo.likes.findIndex((id) => id === userId);
            if (likeIndex !== -1) {
                currentVideo.likes.splice(likeIndex, 1);
            } else {
                currentVideo.likes.push(userId);
                const dislikeIndex = currentVideo.dislikes.findIndex((id) => id === userId);
                if (dislikeIndex !== -1) {
                    currentVideo.dislikes.splice(dislikeIndex, 1);
                }
            }

            state.currentVideo = currentVideo;
        },

        dislike: (state, action) => {
            const userId = action.payload;
            const currentVideo = { ...state.currentVideo };

            const dislikeIndex = currentVideo.dislikes.findIndex((id) => id === userId);
            if (dislikeIndex !== -1) {
                currentVideo.dislikes.splice(dislikeIndex, 1);
            } else {
                currentVideo.dislikes.push(userId);
                const likeIndex = currentVideo.likes.findIndex((id) => id === userId);
                if (likeIndex !== -1) {
                    currentVideo.likes.splice(likeIndex, 1);
                }
            }

            state.currentVideo = currentVideo;
        },
    },
});

export const { fetchStart, fetchSuccess, fetchFailure, like, dislike } =
    videoSlice.actions;

export default videoSlice.reducer;