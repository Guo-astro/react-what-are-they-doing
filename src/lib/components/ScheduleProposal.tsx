import { TimeZone } from "@/lib/types";
import {
  computeZoneTime,
  countryNames,
  parseTimeToMinutes,
  timeZones,
} from "@/lib/constants";

interface ScheduleProposalProps {
  candidateDates: Date[];
  timeZones: TimeZone[];
  referenceDate: Date;
  language: "en" | "zh" | "ja";
}

const TimelineSlot = ({
  time,
  zones,
  date,
}: {
  time: string;
  zones: string[];
  date: Date;
}) => {
  const baseDate = new Date(date);
  const [hour] = time.split(":").map(Number);
  baseDate.setHours(hour);

  return (
    <div className="relative h-12 border-b">
      <div className="absolute left-0 -ml-14 w-12 text-right text-sm">
        {time}
      </div>
      {zones.map((zone, i) => (
        <div
          key={i}
          className="absolute h-full bg-green-100 opacity-75"
          style={{
            left: `${(i * 100) / zones.length}%`,
            width: `${100 / zones.length}%`,
          }}
        >
          <span className="text-xs pl-1">
            {computeZoneTime(timeZones[i].utc, baseDate)}
          </span>
        </div>
      ))}
    </div>
  );
};

export function ScheduleProposal({
  candidateDates,
  timeZones,
  referenceDate,
  language,
}: ScheduleProposalProps) {
  const getLocaleOptions = () => ({
    weekday: "short" as const,
    month: "short" as const,
    day: "numeric" as const,
  });

  return (
    <div className="space-y-8">
      {candidateDates.map((date, dateIndex) => {
        const currentDate = new Date(date);
        return (
          <div
            key={dateIndex}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
          >
            <h3 className="text-lg font-semibold mb-4">
              {new Intl.DateTimeFormat(language, getLocaleOptions()).format(
                currentDate
              )}
            </h3>

            <div className="flex">
              <div className="w-24 pr-4 space-y-4">
                {timeZones.map((zone) => (
                  <div key={zone.country} className="h-12 flex items-center">
                    <span className="text-sm">
                      {countryNames[zone.country]?.[language] || zone.country}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex-1 relative">
                {[...Array(24)].map((_, hour) => {
                  const slotDate = new Date(currentDate);
                  slotDate.setHours(hour);
                  return (
                    <TimelineSlot
                      key={hour}
                      time={`${hour.toString().padStart(2, "0")}:00`}
                      zones={timeZones.map((zone) =>
                        computeZoneTime(zone.utc, slotDate)
                      )}
                      date={currentDate}
                    />
                  );
                })}

                <div
                  className="absolute left-0 right-0 h-px bg-red-500"
                  style={{
                    top: `${
                      ((referenceDate.getHours() * 60 +
                        referenceDate.getMinutes()) /
                        1440) *
                      100
                    }%`,
                  }}
                >
                  <div className="absolute -top-2 -ml-2 text-xs text-red-500">
                    {new Intl.DateTimeFormat(language, {
                      hour: "numeric",
                      minute: "numeric",
                    }).format(referenceDate)}
                  </div>
                </div>

                {timeZones.map((zone, zoneIndex) => {
                  const start = parseTimeToMinutes(zone.startTime);
                  const end = parseTimeToMinutes(zone.endTime);
                  const isSameDay =
                    currentDate.toDateString() === new Date().toDateString();

                  return (
                    <div
                      key={zoneIndex}
                      className="absolute bg-green-200 opacity-50 rounded"
                      style={{
                        left: `${(zoneIndex * 100) / timeZones.length}%`,
                        width: `${100 / timeZones.length}%`,
                        top: `${(start / 1440) * 100}%`,
                        height: `${((end - start) / 1440) * 100}%`,
                        border: isSameDay ? "1px solid #4CAF50" : "none",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <button className="btn-primary">
                {language === "en"
                  ? "Suggest"
                  : language === "zh"
                  ? "建议"
                  : "提案"}
              </button>
              <button className="btn-outline">
                {language === "en"
                  ? "Compare"
                  : language === "zh"
                  ? "比较"
                  : "比較"}
              </button>
              <button className="btn-outline">
                {language === "en"
                  ? "Add to Calendar"
                  : language === "zh"
                  ? "添加到日历"
                  : "カレンダーに追加"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
