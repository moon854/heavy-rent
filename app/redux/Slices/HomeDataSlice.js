
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: {},
    isAuthenticated: false,

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

     
       



    },
});

export const {
    setUser,
    clearUser,
    refreshUser,


} = homeSlice.actions;

export default homeSlice.reducer;
