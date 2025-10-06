
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
        smsNotifications: false,
        // Privacy Settings
        publicProfile: true,
        showPhoneNumber: true,
        showLocation: true,
        analyticsEnabled: true,
        photoAccess: true,
        locationTracking: true,
        marketingEmails: false,
        smsMessages: false,
        phoneCalls: false,
        // Notification Settings
        notificationSound: true,
        notificationVibration: true,
        adPostedNotification: true,
        adViewNotification: false,
        rentalRequestNotification: true,
        adExpiryNotification: true,
        messageNotification: true,
        emailNotification: false,
        smsNotification: false,
        paymentNotification: true,
        paymentReminderNotification: false,
        promotionalNotification: false,
        appUpdateNotification: true,
        // Theme Settings
        autoTheme: false,
        highContrast: false,
        reduceMotion: false,
        largeText: false
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
            if (state.settings && typeof state.settings === 'object' && settingName) {
                state.settings[settingName] = !state.settings[settingName];
            }
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
