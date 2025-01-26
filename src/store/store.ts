// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { favoritesReducer } from "./slices/favoritesSlice";
import { languageReducer } from "./slices/languageSlice";
import { timeZoneReducer } from "./slices/timeZoneSlice";

const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    language: languageReducer,
    timeZone: timeZoneReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
