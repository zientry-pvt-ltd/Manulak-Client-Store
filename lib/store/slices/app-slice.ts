import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  searchQuery: string | null;
}

const initialState: AppState = {
  searchQuery: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setSearchQuery } = appSlice.actions;
export default appSlice.reducer;
