import { HolidayResult, TimeZone } from "./types";
import Holidays from "date-holidays";

export const checkHoliday = (
  date: Date,
  countryCode: string
): HolidayResult => {
  const hd = new Holidays(countryCode);
  const holiday = hd.isHoliday(date);

  if (!holiday) {
    return { isHoliday: false };
  }

  return {
    isHoliday: true,
    name: holiday[0]?.name,
    type: holiday[0]?.type,
  };
};
export const updateTimeZonesWithHolidays = (
  timeZones: TimeZone[],
  date: Date
): TimeZone[] => {
  return timeZones.map((timezone) => {
    const countryCode = timezone.code.split("/")[0];
    const holidayResult = checkHoliday(date, countryCode);
    console.log(countryCode, holidayResult);
    return {
      ...timezone,
      isHoliday: holidayResult.isHoliday,
      holidayName: holidayResult.name,
      holidayType: holidayResult.type,
    };
  });
};
