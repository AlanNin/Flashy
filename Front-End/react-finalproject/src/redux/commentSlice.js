// commentSlice.js

import { createSlice } from '@reduxjs/toolkit';

const commentSlice = createSlice({
    name: 'comment',
    initialState: {
        comments: [],
    },
    reducers: {
        toggleLike: (state, action) => {
            const { userId, commentId } = action.payload;

            if (!state.comments) {
                state.comments = [];
            }

            const comment = state.comments.find((c) => c._id === commentId);

            if (comment) {
                const userLiked = comment.likes.includes(userId);
                const userDisliked = comment.dislikes.includes(userId);

                if (userLiked) {
                    comment.likes = comment.likes.filter((id) => id !== userId);
                } else {
                    comment.likes.push(userId);

                    if (userDisliked) {
                        comment.dislikes = comment.dislikes.filter((id) => id !== userId);
                    }
                }
            }
        },
    },
});

export const { toggleLike } = commentSlice.actions;
export default commentSlice.reducer;
