// src/store/slices/languageSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Language = "en" | "zh" | "ja";

interface LanguageState {
  language: Language;
}

const initialState: LanguageState = {
  language: "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export const languageReducer = languageSlice.reducer;
