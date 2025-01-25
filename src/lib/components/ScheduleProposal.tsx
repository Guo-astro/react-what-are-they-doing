// src/components/ScheduleProposal.tsx

import React, { useState, useRef, useEffect } from "react";
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
  referenceDate: Date;
  language: "en" | "zh" | "ja";
  onTimeChange?: (newTime: string) => void;
}

const ScheduleProposal: React.FC<ScheduleProposalProps> = ({
  timeZones,
  referenceDate,
  language,
  onTimeChange,
}) => {
  const [selectedTime, setSelectedTime] = useState<string>("12:00"); // Default selected time
  const timelineRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  // Calculate the position for the draggable marker
  const calculateMarkerPosition = () => {
    if (timelineRef.current) {
      const timelineWidth = timelineRef.current.offsetWidth;
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;
      const position = (totalMinutes / (24 * 60)) * timelineWidth;
      return position;
    }
    return 0;
  };

  const [markerX, setMarkerX] = useState<number>(calculateMarkerPosition());

  useEffect(() => {
    setMarkerX(calculateMarkerPosition());
  }, [selectedTime, referenceDate]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (timelineRef.current) {
      const timelineWidth = timelineRef.current.offsetWidth;
      const { delta } = event;
      const minutesChange = Math.round((delta.x / timelineWidth) * 24 * 60);
      let [hours, minutes] = selectedTime.split(":").map(Number);
      let totalMinutes = hours * 60 + minutes + minutesChange;

      // Clamp between 0 and 1440 minutes (24 hours)
      totalMinutes = Math.max(0, Math.min(totalMinutes, 1440));

      const newHours = Math.floor(totalMinutes / 60);
      const newMinutes = totalMinutes % 60;
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

    const style = {
      transform: transform
        ? `translate(${transform.x}px, ${transform.y}px)`
        : `translate(${markerX}px, 0px)`,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="absolute top-0 h-full w-2 bg-red-500 opacity-75 cursor-pointer"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={24}
        aria-valuenow={parseInt(selectedTime.split(":")[0])}
        aria-label="Selected Meeting Time"
        tabIndex={0}
        {...listeners}
        {...attributes}
      />
    );
  };

  return (
    <div className="relative overflow-x-auto pb-4">
      <div className="inline-block min-w-full" ref={timelineRef}>
        {/* Time Slots Header */}
        <div className="flex border-b bg-gray-50 dark:bg-gray-800">
          <div className="w-32" />
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 text-center p-2 border-l text-xs text-gray-500"
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
            >
              {`${i.toString().padStart(2, "0")}:00`}
            </div>
          ))}
        </div>

        {/* Time Zones Rows */}
        {timeZones.map((zone, index) => {
          const [hours, minutes] = selectedTime.split(":").map(Number);
          const localDate = computeZoneTime(zone.utc, referenceDate);
          localDate.setHours(hours, minutes);

          const formattedTime = localDate.toLocaleTimeString(language, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: language === "en",
          });

          return (
            <div
              key={zone.id}
              className="border-b dark:border-gray-700 relative"
            >
              <div className="flex">
                <div className="w-32 p-2 bg-gray-50 dark:bg-gray-800 border-r dark:border-gray-700">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                    {countryNames[zone.country]?.[language] || zone.country}
                  </h4>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    UTC{zone.utc}
                  </div>
                </div>

                <div className="flex-1 relative">
                  <div className="grid grid-cols-24 gap-1">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div
                        key={i}
                        className={`p-2 text-center border ${
                          i < hours || (i === hours && minutes === 0)
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }`}
                      >
                        {`${i.toString().padStart(2, "0")}:00`}
                      </div>
                    ))}
                  </div>

                  {/* Label for Selected Time */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                    {formattedTime} ({zone.countryCode})
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* UTC Row */}
        <div className="flex border-b bg-gray-50 dark:bg-gray-800">
          <div className="w-32 p-2 bg-gray-50 dark:bg-gray-800 border-r dark:border-gray-700">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
              UTC
            </h4>
          </div>
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 text-center p-2 border-l dark:border-gray-700 text-xs text-gray-500"
            >
              {`${i.toString().padStart(2, "0")}:00`}
            </div>
          ))}
        </div>
      </div>

      {/* Draggable Timeline Marker using @dnd-kit */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <DraggableMarker />
      </DndContext>

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500" />
          <span className="text-gray-700 dark:text-gray-300">
            {language === "en"
              ? "Selected Time"
              : language === "zh"
              ? "选定时间"
              : "選択した時間"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-100" />
          <span className="text-gray-700 dark:text-gray-300">
            {language === "en"
              ? "Past dates"
              : language === "zh"
              ? "过去日期"
              : "過去の日付"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleProposal;
