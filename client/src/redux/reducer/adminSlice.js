import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin: null,
}
export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setAdmin: (state, action) => {
            state.admin = action.payload;
        },
        removeAdmin: (state) => {
            state.admin = null;
        }

    },
});

export const { setAdmin ,removeAdmin} = adminSlice.actions;
export default adminSlice.reducer;