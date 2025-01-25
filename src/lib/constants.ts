import i18n from "i18n-iso-countries";
import iso_en from "i18n-iso-countries/langs/en.json";
import iso_zh from "i18n-iso-countries/langs/zh.json";
import iso_ja from "i18n-iso-countries/langs/ja.json";
import { getAllCountries, getTimezone } from "countries-and-timezones";
import { getCountryCallingCode } from "libphonenumber-js";

i18n.registerLocale(iso_en);
i18n.registerLocale(iso_zh);
i18n.registerLocale(iso_ja);

const getUtcOffsetString = (offsetMinutes: number): string => {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absMinutes = Math.abs(offsetMinutes);
  return `UTC${sign}${Math.floor(absMinutes / 60)
    .toString()
    .padStart(2, "0")}:${(absMinutes % 60).toString().padStart(2, "0")}`;
};

const countries = getAllCountries();
const countryNames: Record<string, { en: string; zh: string; ja: string }> = {};
const timeZones: TimeZone[] = [];

Object.values(countries).forEach((country) => {
  const isoCode = country.id;
  const en = i18n.getName(isoCode, "en") || country.name;
  const zh = i18n.getName(isoCode, "zh") || en;
  const ja = i18n.getName(isoCode, "ja") || en;

  // Get calling code
  let callingCode = "";
  try {
    callingCode = `+${getCountryCallingCode(isoCode)}`;
  } catch {
    callingCode = "";
  }

  countryNames[isoCode] = { en, zh, ja };

  country.timezones.forEach((tzName: string) => {
    const tz = getTimezone(tzName);
    if (!tz) return;

    timeZones.push({
      country: isoCode,
      countryName: zh,
      utc: getUtcOffsetString(tz.utcOffset),
      code: callingCode,
      startTime: "09:00",
      endTime: "17:00",
    });
  });
});

export { countryNames, timeZones };

export interface TimeZone {
  country: string; // ISO country code
  countryName: string; // Localized name
  utc: string;
  code: string;
  startTime: string;
  endTime: string;
  isHoliday?: boolean;
  holidayName?: string;
}

// Utility functions
export function parseUTCOffset(
  utc: string
): { sign: number; hours: number; minutes: number } | null {
  const match = utc.match(/UTC([+-])(\d{2}):(\d{2})/);
  if (!match) return null;
  const sign = match[1] === "+" ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3], 10);
  return { sign, hours, minutes };
}

export function computeZoneTime(utc: string, referenceDate: Date): string {
  const offset = parseUTCOffset(utc);
  if (!offset) return "Invalid UTC";
  const utcTime = new Date(
    referenceDate.getTime() + referenceDate.getTimezoneOffset() * 60000
  );
  utcTime.setHours(utcTime.getHours() + offset.sign * offset.hours);
  utcTime.setMinutes(utcTime.getMinutes() + offset.sign * offset.minutes);
  const hours = utcTime.getHours().toString().padStart(2, "0");
  const minutes = utcTime.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

import Holidays from "date-holidays";

export function getStatus(
  zone: TimeZone,
  currentTime: string,
  referenceDate: Date
): { label: string; colorClass: string } {
  // Convert to local time in the timezone
  const localDate = new Date(
    referenceDate.toLocaleString("en-US", {
      timeZone: zone.utc.replace("UTC", ""),
    })
  );

  // Check weekend first
  const isWeekend = localDate.getDay() === 0 || localDate.getDay() === 6; // 0 = Sunday, 6 = Saturday

  // Check holidays
  const hd = new Holidays(zone.country);
  const holiday = hd.isHoliday(localDate);

  // Existing time calculation
  const currentMinutes = parseTimeToMinutes(currentTime);
  const startMinutes = parseTimeToMinutes(zone.startTime);
  const endMinutes = parseTimeToMinutes(zone.endTime);

  // Determine working status
  let isWorking = false;
  if (startMinutes < endMinutes) {
    isWorking = currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    isWorking = currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }

  // Status priority: Holiday > Weekend > Working status
  if (holiday) {
    return {
      label: holiday[0].name || "Holiday",
      colorClass: "bg-purple-500 text-white",
    };
  }

  if (isWeekend) {
    return {
      label: localDate.getDay() === 0 ? "Sunday" : "Saturday",
      colorClass: "bg-red-500 text-white",
    };
  }

  // Existing working status logic
  const aboutToStart =
    (startMinutes - currentMinutes >= 0 &&
      startMinutes - currentMinutes <= 30) ||
    (startMinutes < endMinutes &&
      currentMinutes < startMinutes &&
      startMinutes - currentMinutes <= 30);
  const aboutToFinish =
    (currentMinutes - endMinutes >= 0 && currentMinutes - endMinutes <= 30) ||
    (startMinutes > endMinutes &&
      currentMinutes < endMinutes &&
      endMinutes - currentMinutes <= 30);

  if (isWorking) {
    return aboutToFinish
      ? { label: "About to finish", colorClass: "bg-yellow-500 text-white" }
      : { label: "Working", colorClass: "bg-green-500 text-white" };
  }

  return aboutToStart
    ? { label: "About to start", colorClass: "bg-blue-500 text-white" }
    : { label: "Closed", colorClass: "bg-gray-500 text-white" };
}
