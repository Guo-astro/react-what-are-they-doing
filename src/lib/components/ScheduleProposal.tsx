// src/components/ScheduleProposal.tsx

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  DragEndEvent,
} from "@dnd-kit/core";
import { TimeZone, computeZoneTime, countryNames } from "../constants";

interface ScheduleProposalProps {
  timeZones: TimeZone[];
  referenceDate?: Date; // Made optional to default to local time
  language: "en" | "zh" | "ja";
  onTimeChange?: (newTime: string) => void;
}

const ScheduleProposal: React.FC<ScheduleProposalProps> = ({
  timeZones,
  referenceDate = new Date(), // Default to current local time
  language,
  onTimeChange,
}) => {
  const [selectedTime, setSelectedTime] = useState<string>("12:00"); // Default selected time
  const timelineRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  // Obtain user's local time zone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Calculate the position for the draggable marker
  const calculateMarkerPosition = useCallback(() => {
    if (timelineRef.current) {
      const timelineWidth = timelineRef.current.offsetWidth;
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;
      const position = (totalMinutes / (24 * 60)) * timelineWidth;
      return position;
    }
    return 0;
  }, [selectedTime]);

  const [markerX, setMarkerX] = useState<number>(calculateMarkerPosition());

  useEffect(() => {
    setMarkerX(calculateMarkerPosition());
  }, [selectedTime, referenceDate, calculateMarkerPosition]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (timelineRef.current) {
      const timelineWidth = timelineRef.current.offsetWidth;
      let newMarkerX = markerX + event.delta.x;

      // Clamp the marker's position within the timeline
      newMarkerX = Math.max(0, Math.min(newMarkerX, timelineWidth));

      // Calculate the new time based on the clamped position
      const newTotalMinutes = Math.round(
        (newMarkerX / timelineWidth) * 24 * 60
      );
      const newHours = Math.floor(newTotalMinutes / 60);
      const newMinutes = newTotalMinutes % 60;
      const newTime = `${newHours.toString().padStart(2, "0")}:${newMinutes
        .toString()
        .padStart(2, "0")}`;

      setSelectedTime(newTime);
      if (onTimeChange) onTimeChange(newTime);
    }
  };

  useEffect(() => {
    if (onTimeChange) {
      onTimeChange(selectedTime);
    }
  }, [selectedTime, onTimeChange]);

  // Draggable Marker using @dnd-kit
  const DraggableMarker = () => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: "draggable-marker",
    });

    const timelineWidth = timelineRef.current?.offsetWidth || 0;
    const currentMarkerX = transform ? markerX + transform.x : markerX;

    // Clamp the marker's position within the timeline
    const clampedX = Math.max(0, Math.min(currentMarkerX, timelineWidth));

    return (
      <div
        ref={setNodeRef}
        style={{
          transform: `translateX(${clampedX}px)`,
        }}
        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 cursor-pointer"
        aria-valuemin={0}
        aria-valuemax={24}
        aria-valuenow={parseInt(selectedTime.split(":")[0])}
        aria-label="Selected Meeting Time"
        {...listeners}
        {...attributes}
      >
        {/* Inverted Triangle Handle */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div
            className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-red-500"
            style={{ transform: "rotate(180deg)" }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative overflow-x-auto pb-4">
      {/* Timeline Header with Time Zone Label */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {language === "en"
            ? `Timeline (${userTimeZone})`
            : language === "zh"
            ? `时间线 (${userTimeZone})`
            : `タイムライン (${userTimeZone})`}
        </span>
      </div>
      <div className="w-full" ref={timelineRef}>
        {/* Horizontal Timeline */}
        <div className="flex items-center border-b bg-gray-50 dark:bg-gray-800 relative">
          <div className="w-32 flex-shrink-0"></div>
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 text-center p-2 border-l text-xs text-gray-500 truncate"
            >
              {`${i.toString().padStart(2, "0")}:00`}
            </div>
          ))}
        </div>

        {/* Time Zones Columns */}
        <div className="flex">
          <div className="w-32 flex-shrink-0"></div>
          {timeZones.map((zone) => {
            const [hours, minutes] = selectedTime.split(":").map(Number);
            const localDate = computeZoneTime(zone.utc, referenceDate);
            localDate.setHours(hours, minutes);

            const formattedTime = localDate.toLocaleTimeString(language, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: language === "en",
              timeZone: zone.timeZone || "UTC", // Ensure computeZoneTime considers timeZone
            });

            return (
              <div
                key={zone.id}
                className="flex-1 border-l dark:border-gray-700 relative"
              >
                {/* Time Zone Label */}
                <div className="absolute top-0 left-0 w-full text-center p-2 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {countryNames[zone.country]?.[language] || zone.country}
                </div>

                {/* Local Time Display */}
                <div className="mt-8 text-center text-sm text-gray-800 dark:text-gray-200">
                  {formattedTime} ({zone.countryName})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Draggable Timeline Marker using @dnd-kit */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <DraggableMarker />
      </DndContext>

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
          <span className="text-gray-700 dark:text-gray-300">
            {language === "en"
              ? "Selected Time"
              : language === "zh"
              ? "选定时间"
              : "選択した時間"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleProposal;
