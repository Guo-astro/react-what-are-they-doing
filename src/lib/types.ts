// types.ts (or similar file for data definitions and utilities)
export interface TimeZone {
  country: string;
  utc: string;
  code: string;
  startTime: string;
  endTime: string;
}

export interface HolidayResult {
  isHoliday: boolean;
  name?: string;
  type?: string;
}
