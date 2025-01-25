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
  countryName: string; // Localized country name

  country: string;
  utc: string;
  code: string;
  startTime: string;
  endTime: string;
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

export function getStatus(
  zone: TimeZone,
  current: string
): { label: string; colorClass: string } {
  const currentMinutes = parseTimeToMinutes(current);
  const startMinutes = parseTimeToMinutes(zone.startTime);
  const endMinutes = parseTimeToMinutes(zone.endTime);
  let isWorking = false;
  if (startMinutes < endMinutes) {
    isWorking = currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    isWorking = currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
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
    if (aboutToFinish) {
      return {
        label: "About to finish",
        colorClass: "bg-yellow-500 text-white",
      };
    }
    return { label: "Working", colorClass: "bg-green-500 text-white" };
  } else {
    if (aboutToStart) {
      return { label: "About to start", colorClass: "bg-blue-500 text-white" };
    }
    return { label: "Sleeping", colorClass: "bg-gray-500 text-white" };
  }
}
