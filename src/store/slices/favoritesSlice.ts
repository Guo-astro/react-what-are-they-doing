import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoritesState {
  favorites: string[];
}

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    loadFavorites(state, action: PayloadAction<string[]>) {
      state.favorites = action.payload;
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      const index = state.favorites.indexOf(action.payload);
      if (index !== -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
    },
  },
});

export const { loadFavorites, toggleFavorite } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
