// src/store/slices/timeZoneSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TimeZoneState {
  referenceDate: Date;
  isoInput: string;
  selectedMeetingTime: string;
}

const initialState: TimeZoneState = {
  referenceDate: new Date(),
  isoInput: "",
  selectedMeetingTime: "12:00",
};

const timeZoneSlice = createSlice({
  name: "timeZone",
  initialState,
  reducers: {
    setReferenceDate(state, action: PayloadAction<Date>) {
      state.referenceDate = action.payload;
    },
    setIsoInput(state, action: PayloadAction<string>) {
      state.isoInput = action.payload;
    },
    setSelectedMeetingTime(state, action: PayloadAction<string>) {
      state.selectedMeetingTime = action.payload;
    },
  },
});

export const { setReferenceDate, setIsoInput, setSelectedMeetingTime } =
  timeZoneSlice.actions;
export const timeZoneReducer = timeZoneSlice.reducer;
