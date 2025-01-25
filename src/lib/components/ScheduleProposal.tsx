import { TimeZone } from "@/lib/types";
import { computeZoneTime, countryNames } from "@/lib/constants";
import { useState } from "react";

interface ScheduleProposalProps {
  timeZones: TimeZone[];
  referenceDate: Date;
  language: "en" | "zh" | "ja";
}

const TimeCell = ({
  date,
  zone,
  referenceDate,
  language,
}: {
  date: Date;
  zone: TimeZone;
  referenceDate: Date;
  language: "en" | "zh" | "ja";
}) => {
  const localTime = computeZoneTime(zone.utc, referenceDate);
  const isActive = date.getDate() === localTime.getDate();
  const isPast = date < new Date();

  return (
    <div
      className={`p-2 text-center border ${
        isPast ? "bg-gray-100 dark:bg-gray-700" : ""
      }`}
    >
      <div className={`text-sm ${isActive ? "font-bold text-blue-600" : ""}`}>
        {date.toLocaleDateString(language, {
          day: "numeric",
          month: "short",
        })}
      </div>
      <div className="text-xs text-gray-500">
        {localTime.toLocaleTimeString(language, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
};

export function ScheduleProposal({
  timeZones,
  referenceDate,
  language,
}: ScheduleProposalProps) {
  const [hoveredTime, setHoveredTime] = useState<string | null>(null);

  const timeSlots = Array.from({ length: 24 }).map(
    (_, i) => `${i.toString().padStart(2, "0")}:02`
  );

  const groupedZones = timeZones.reduce((acc, zone) => {
    const region = zone.country.split(" ")[0];
    if (!acc[region]) acc[region] = [];
    acc[region].push(zone);
    return acc;
  }, {} as Record<string, TimeZone[]>);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="inline-block min-w-full">
        <div className="flex border-b">
          <div className="w-32" />
          {timeSlots.map((time) => (
            <div
              key={time}
              className="flex-1 text-center p-2 border-l"
              onMouseEnter={() => setHoveredTime(time)}
              onMouseLeave={() => setHoveredTime(null)}
            >
              {time}
            </div>
          ))}
        </div>

        {Object.entries(groupedZones).map(([region, zones]) => (
          <div key={region} className="border-b">
            <div className="flex">
              <div className="w-32 p-2 bg-gray-50 dark:bg-gray-800 border-r">
                <h4 className="font-medium">
                  {countryNames[region]?.[language] || region}
                </h4>
                <div className="text-xs text-gray-500">UTC{zones[0].utc}</div>
              </div>

              {timeSlots.map((time) => (
                <div
                  key={time}
                  className={`flex-1 grid grid-cols-${zones.length} ${
                    hoveredTime === time ? "bg-blue-50 dark:bg-gray-700" : ""
                  }`}
                >
                  {zones.map((zone) => {
                    const slotDate = new Date(referenceDate);
                    const [hours] = time.split(":").map(Number);
                    slotDate.setHours(hours);

                    return (
                      <TimeCell
                        key={zone.country}
                        date={slotDate}
                        zone={zone}
                        referenceDate={referenceDate}
                        language={language}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex border-b">
          <div className="w-32 p-2 bg-gray-50 dark:bg-gray-800 border-r">
            <h4 className="font-medium">UTC</h4>
          </div>
          {timeSlots.map((time) => {
            const utcDate = new Date(referenceDate);
            const [hours] = time.split(":").map(Number);
            utcDate.setHours(hours);

            return (
              <div key={time} className="flex-1 text-center p-2 border-l">
                <div className="text-sm">
                  {utcDate.toLocaleDateString(language, {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
                <div className="text-xs text-gray-500">
                  {utcDate.toLocaleTimeString(language, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-100" />
          {language === "en"
            ? "Current time"
            : language === "zh"
            ? "当前时间"
            : "現在時刻"}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-100" />
          {language === "en"
            ? "Past dates"
            : language === "zh"
            ? "过去日期"
            : "過去の日付"}
        </div>
      </div>
    </div>
  );
}
