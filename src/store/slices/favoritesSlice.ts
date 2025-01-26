// src/store/slices/favoritesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoritesState {
  favorites: Set<string>;
}

const initialState: FavoritesState = {
  favorites: new Set<string>(),
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    loadFavorites(state, action: PayloadAction<string[]>) {
      state.favorites = new Set(action.payload);
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      if (state.favorites.has(action.payload)) {
        state.favorites.delete(action.payload);
      } else {
        state.favorites.add(action.payload);
      }
    },
  },
});

export const { loadFavorites, toggleFavorite } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
