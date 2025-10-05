
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: {},
    isAuthenticated: false,
    theme: 'light', // 'light' or 'dark'
    settings: {
        notifications: true,
        soundEnabled: true,
        vibrationEnabled: true,
        darkMode: false,
        locationServices: true,
        autoSync: true,
        pushNotifications: true,
        emailNotifications: false,
        smsNotifications: false
    }
};

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        setUser: (state, action) => {
            // Create a new user object to ensure proper re-rendering
            state.user = { ...action.payload };
            state.isAuthenticated = Object.keys(action.payload).length > 0;
        },
        clearUser: (state) => {
            state.user = {};
            state.isAuthenticated = false;
        },
        refreshUser: (state) => {
            // Force a refresh by creating a new reference
            state.user = { ...state.user };
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        updateSettings: (state, action) => {
            state.settings = { ...state.settings, ...action.payload };
        },
        toggleSetting: (state, action) => {
            const settingName = action.payload;
            state.settings[settingName] = !state.settings[settingName];
        },

     
       



    },
});

export const {
    setUser,
    clearUser,
    refreshUser,
    setTheme,
    updateSettings,
    toggleSetting
} = homeSlice.actions;

export default homeSlice.reducer;
