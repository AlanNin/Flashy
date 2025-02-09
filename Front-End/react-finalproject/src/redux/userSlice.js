import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    error: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
        },
        loginFailure: (state) => {
            state.loading = false;
            state.error = true;
        },
        logout: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },
        userUpdated: (state, action) => {
            state.currentUser = action.payload;
        },
        userVerified: (state, action) => {
            state.currentUser = action.payload;
        },
        userToggleWatchHistoryPaused: (state, action) => {
            state.currentUser = {
                ...state.currentUser,
                isWatchHistoryPaused: action.payload.isWatchHistoryPaused,
            };
        },
        userUpdateNotifications: (state, action) => {
            state.currentUser.newNotifications += 1;
        },
        userClearNotifications: (state, action) => {
            state.currentUser.newNotifications = 0;
        },
        userToggleNotifications: (state, action) => {
            state.currentUser.notificationsEnabled = !state.currentUser.notificationsEnabled;
        },
        subscription: (state, action) => {
            if (state.currentUser.subscribedUsers.includes(action.payload)) {
                state.currentUser.subscribedUsers.splice(
                    state.currentUser.subscribedUsers.findIndex(
                        (channelId) => channelId === action.payload
                    ),
                    1
                );
            } else {
                state.currentUser.subscribedUsers.push(action.payload);
            }
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, userUpdated, userVerified, userUpdateNotifications, userClearNotifications, userToggleNotifications, userToggleWatchHistoryPaused, subscription } =
    userSlice.actions;

export default userSlice.reducer;