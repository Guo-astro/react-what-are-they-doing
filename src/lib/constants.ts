import i18n from "i18n-iso-countries";
import iso_en from "i18n-iso-countries/langs/en.json";
import iso_zh from "i18n-iso-countries/langs/zh.json";
import iso_ja from "i18n-iso-countries/langs/ja.json";
import { getAllCountries, getTimezone } from "countries-and-timezones";
import { getCountryCallingCode } from "libphonenumber-js";
import Holidays from "date-holidays";
import { nanoid } from "nanoid";

// TypeScript interfaces
export interface TimeZone {
  id: string;
  country: string;
  countryName: string;
  utc: string;
  code: string;
  timeZone: string; // Added property
  startTime: string;
  endTime: string;
  isHoliday?: boolean;
  holidayName?: string;
  holidayType?: string;
}

// Initialize i18n
i18n.registerLocale(iso_en);
i18n.registerLocale(iso_zh);
i18n.registerLocale(iso_ja);

// Utility functions
const getUtcOffsetString = (offsetMinutes: number): string => {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absMinutes = Math.abs(offsetMinutes);
  return `UTC${sign}${String(Math.floor(absMinutes / 60)).padStart(
    2,
    "0"
  )}:${String(absMinutes % 60).padStart(2, "0")}`;
};

// Country and timezone data initialization
const countries = getAllCountries();
export const countryNames: Record<
  string,
  { en: string; zh: string; ja: string }
> = {};
export const timeZones: TimeZone[] = [];

Object.values(countries).forEach((country) => {
  const isoCode = country.id;
  const names = {
    en: i18n.getName(isoCode, "en") || country.name,
    zh: i18n.getName(isoCode, "zh") || country.name,
    ja: i18n.getName(isoCode, "ja") || country.name,
  };

  countryNames[isoCode] = names;

  // Get calling code safely
  let callingCode = "";
  try {
    callingCode = `+${getCountryCallingCode(isoCode)}`;
  } catch (error) {
    console.warn(`Failed to get calling code for ${isoCode}:`, error);
  }

  country.timezones.forEach((tzName: string) => {
    const tz = getTimezone(tzName);
    if (!tz) return;

    timeZones.push({
      id: `${country.id}-${nanoid()}`, // Unique combination
      country: isoCode,
      countryName: names.zh,
      utc: getUtcOffsetString(tz.utcOffset),
      code: callingCode,
      timeZone: tz.name, // Populate timeZone
      startTime: "09:00",
      endTime: "17:00",
    });
  });
});

// Date calculation functions
export function parseUTCOffset(utc: string) {
  const match = utc.match(/UTC([+-])(\d{2}):(\d{2})/);
  if (!match) return null;

  return {
    sign: match[1] === "+" ? 1 : -1,
    hours: parseInt(match[2], 10),
    minutes: parseInt(match[3], 10),
  };
}

export function computeZoneTime(utc: string, referenceDate: Date): Date {
  const offset = parseUTCOffset(utc);
  if (!offset) return new Date(NaN);

  const totalMinutes = (offset.hours * 60 + offset.minutes) * offset.sign;
  const adjustedTime = new Date(referenceDate.getTime() + totalMinutes * 60000);
  return adjustedTime;
}

export function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

// Status calculation with proper type safety
interface StatusResult {
  label: string;
  colorClass: string;
}

export function getStatus(zone: TimeZone, referenceDate: Date): StatusResult {
  try {
    const localDate = computeZoneTime(zone.utc, referenceDate);
    if (isNaN(localDate.getTime())) return invalidDateResult();

    const currentMinutes = localDate.getHours() * 60 + localDate.getMinutes();
    const startMinutes = parseTimeToMinutes(zone.startTime);
    const endMinutes = parseTimeToMinutes(zone.endTime);

    // Check weekend
    const isWeekend = localDate.getDay() % 6 === 0;

    // Check holidays
    const hd = new Holidays(zone.country);
    const holidays = hd.getHolidays(localDate.getFullYear());
    const isHoliday = holidays.some(
      (h) => h.date === localDate.toISOString().split("T")[0]
    );

    // Determine status
    if (isHoliday) return holidayResult();
    if (isWeekend) return weekendResult(localDate);

    return calculateWorkStatus(currentMinutes, startMinutes, endMinutes);
  } catch (error) {
    console.error("Error calculating status:", error);
    return { label: "Error", colorClass: "bg-gray-500 text-white" };
  }
}

// Helper functions for status calculation
function invalidDateResult(): StatusResult {
  return { label: "Invalid Time", colorClass: "bg-gray-500 text-white" };
}

function holidayResult(): StatusResult {
  return { label: "Holiday", colorClass: "bg-purple-500 text-white" };
}

function weekendResult(date: Date): StatusResult {
  return {
    label: date.getDay() === 0 ? "Sunday" : "Saturday",
    colorClass: "bg-red-500 text-white",
  };
}

function calculateWorkStatus(
  current: number,
  start: number,
  end: number
): StatusResult {
  const isWorking =
    start < end
      ? current >= start && current < end
      : current >= start || current < end;

  if (isWorking) {
    const timeLeft = end - current;
    return timeLeft <= 30
      ? { label: "About to finish", colorClass: "bg-yellow-500 text-white" }
      : { label: "Working", colorClass: "bg-green-500 text-white" };
  }

  const timeUntil = start - current;
  return timeUntil <= 30 && timeUntil > 0
    ? { label: "About to start", colorClass: "bg-blue-500 text-white" }
    : { label: "Closed", colorClass: "bg-gray-500 text-white" };
}
