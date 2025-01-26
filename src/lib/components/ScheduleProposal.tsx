// src/lib/components/ScheduleProposal.tsx
import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  DragEndEvent,
} from "@dnd-kit/core";
import { useDispatch, useSelector } from "react-redux";
import { TimeZone, computeZoneTime, countryNames } from "../constants";
import { RootState } from "../../store/store";
import { setSelectedMeetingTime } from "../../store/slices/timeZoneSlice";

interface ScheduleProposalProps {
  timeZones: TimeZone[];
  referenceDate?: Date;
  language: "en" | "zh" | "ja";
}

const ScheduleProposal: React.FC<ScheduleProposalProps> = ({
  timeZones,
  referenceDate = new Date(),
  language,
}) => {
  const dispatch = useDispatch();
  const selectedMeetingTime = useSelector(
    (state: RootState) => state.timeZone.selectedMeetingTime
  );
  const timelineRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  // Translation dictionary
  const translations = {
    timelineLabel: {
      en: "Timeline",
      zh: "时间线",
      ja: "タイムライン",
    },
    selectedTime: {
      en: "Selected Time",
      zh: "选定时间",
      ja: "選択した時間",
    },
    timezoneLabel: {
      en: "Timezone",
      zh: "时区",
      ja: "タイムゾーン",
    },
    localTime: {
      en: "Local Time",
      zh: "当地時間",
      ja: "現地時間",
    },
  };

  const calculateMarkerPosition = useCallback(() => {
    if (timelineRef.current) {
      const timelineWidth = timelineRef.current.offsetWidth;
      const [hours, minutes] = selectedMeetingTime.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;
      return (totalMinutes / (24 * 60)) * timelineWidth;
    }
    return 0;
  }, [selectedMeetingTime]);

  const [markerX, setMarkerX] = useState<number>(calculateMarkerPosition());

  useEffect(() => {
    setMarkerX(calculateMarkerPosition());
  }, [selectedMeetingTime, referenceDate, calculateMarkerPosition]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (timelineRef.current) {
      const timelineWidth = timelineRef.current.offsetWidth;
      let newMarkerX = markerX + event.delta.x;
      newMarkerX = Math.max(0, Math.min(newMarkerX, timelineWidth));

      const newTotalMinutes = Math.round(
        (newMarkerX / timelineWidth) * 24 * 60
      );
      const newHours = Math.floor(newTotalMinutes / 60);
      const newMinutes = newTotalMinutes % 60;
      const newTime = `${newHours.toString().padStart(2, "0")}:${newMinutes
        .toString()
        .padStart(2, "0")}`;

      dispatch(setSelectedMeetingTime(newTime));
    }
  };

  const DraggableMarker = () => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: "draggable-marker",
    });

    const timelineWidth = timelineRef.current?.offsetWidth || 0;
    const currentMarkerX = transform ? markerX + transform.x : markerX;
    const clampedX = Math.max(0, Math.min(currentMarkerX, timelineWidth));

    return (
      <div
        ref={setNodeRef}
        style={{ transform: `translateX(${clampedX}px)` }}
        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 cursor-pointer group"
        aria-valuemin={0}
        aria-valuemax={24}
        aria-valuenow={parseInt(selectedMeetingTime.split(":")[0])}
        aria-label={translations.selectedTime[language]}
        {...listeners}
        {...attributes}
      >
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="w-0 h-0 border-l-6 border-r-6 border-t-8 border-l-transparent border-r-transparent border-t-red-500 transition-transform duration-150 group-hover:scale-125" />
        </div>
      </div>
    );
  };

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="relative overflow-x-auto pb-4">
      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {`${translations.timelineLabel[language]} (${userTimeZone})`}
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {selectedMeetingTime}
        </div>
      </div>

      {/* Timeline Container */}
      <div className="w-full" ref={timelineRef}>
        {/* Timeline Hours */}
        <div className="flex items-center border-b bg-gray-50 dark:bg-gray-800 relative h-12">
          <div className="w-32 flex-shrink-0 pl-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            {translations.timezoneLabel[language]}
          </div>
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 text-center p-2 border-l text-xs text-gray-500 dark:text-gray-400 truncate flex items-center justify-center"
            >
              {`${i.toString().padStart(2, "0")}:00`}
            </div>
          ))}
        </div>

        {/* Timezone Rows */}
        <div className="space-y-4 mt-4">
          {timeZones.map((zone) => {
            const [hours, minutes] = selectedMeetingTime.split(":").map(Number);
            const localDate = computeZoneTime(zone.utc, referenceDate);
            localDate.setHours(hours, minutes);

            const formattedTime = localDate.toLocaleTimeString(language, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: language === "en",
              timeZone: zone.timeZone || "UTC",
            });

            return (
              <div
                key={zone.id}
                className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
              >
                <div className="w-32 flex-shrink-0 pl-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {countryNames[zone.country]?.[language] || zone.country}
                </div>
                <div className="flex-1 relative h-12 border-l dark:border-gray-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-medium">{formattedTime}</span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        ({translations.localTime[language]})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Draggable Marker */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <DraggableMarker />
      </DndContext>

      {/* Legend */}
      <div className="mt-6 px-2">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
          <span className="text-gray-700 dark:text-gray-300">
            {translations.selectedTime[language]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleProposal;
