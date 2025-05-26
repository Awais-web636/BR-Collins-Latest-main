import * as React from "react";

// type SlotType = "full-day" | "half-day-morning" | "half-day-afternoon";
type SlotType = "full-day" | "half-day-morning" | "half-day-afternoon";

interface TimeSlotsProps {
  onSelect: (slot: string) => void;
  selectedSlot: string;
  courseDuration: "half-day" | "full-day";
  availableSlots: {
    date: string;
    availableSlots: SlotType[];
  }[];
  selectedDate: Date;
}

export const TimeSlots: React.FC<TimeSlotsProps> = ({
  onSelect,
  selectedSlot,
  courseDuration,
  availableSlots,
  selectedDate,
}) => {
  const timeSlots = [
    {
      label: "Morning Slot",
      value: "Morning, 8:00 AM - 12:00 PM",
      time: "8:00 AM - 12:00 PM",
      slotType: "half-day-morning" as SlotType,
    },
    {
      label: "Afternoon Slot",
      value: "Afternoon, 1:00 PM - 5:00 PM",
      time: "1:00 PM - 5:00 PM",
      slotType: "half-day-afternoon" as SlotType,
    },
  ];

  const fullDaySlot = "Full Day, 8:00 AM - 5:00 PM";

  // Check if a slot is available for the selected date
  const isSlotAvailable = (slotType: SlotType) => {
    if (!selectedDate || !availableSlots.length) {
      return false;
    }

    const selectedDateObj = new Date(selectedDate);
    const formattedDate = selectedDateObj.toISOString().split("T")[0];
    const dateSlots = availableSlots.find((slot) => {
      return slot.date === formattedDate;
    });
    return dateSlots?.availableSlots?.includes(slotType) || false;
  };

  return (
    <div className="flex flex-col mt-5 max-w-full text-neutral-900">
      <div className="flex max-md:flex-col gap-5 w-full">
        <h2 className="text-2xl font-bold w-[280px] shrink-0">Choose Time Slot(s):</h2>
        <div className="flex flex-col justify-start text-lg flex-grow">
          {courseDuration === "full-day" ? (
            <div className="flex items-center gap-3">
              <div className={`flex gap-2.5 items-center ${!isSlotAvailable("full-day") ? "opacity-50" : ""}`}>
                <span>Full Day:</span>
                <span className="font-bold">8:00 AM - 5:00 PM</span>
                {!isSlotAvailable("full-day") && (
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block ml-1" title="Unavailable"></span>
                )}
              </div>
            </div>
          ) : (
            timeSlots.map((slot) => {
              const isAvailable = isSlotAvailable(slot.slotType);
              return (
                <label
                  key={slot.value}
                  className={`flex items-start gap-3 ${
                    isAvailable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="timeSlot"
                    checked={selectedSlot === slot.value}
                    onChange={() => isAvailable && onSelect(slot.value)}
                    disabled={!isAvailable}
                    className="w-5 h-5 mt-1 text-sky-500 border-gray-300 focus:ring-sky-500 cursor-pointer"
                  />
                  <div className="flex flex-wrap gap-2.5 items-center">
                    <span>{slot.label}:</span>
                    <span className="font-bold">{slot.time}</span>
                    {!isAvailable && (
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block ml-1" title="Unavailable"></span>
                    )}
                  </div>
                </label>
              );
            })
          )}
        </div>
      </div>
      {/* Note about red dot meaning */}
      <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
        <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
        <span>Indicates unavailable slot</span>
      </div>
    </div>
  );
};
