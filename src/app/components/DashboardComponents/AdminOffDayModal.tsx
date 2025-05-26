import React from "react";
import { Dialog } from "@headlessui/react";
import { IDisabledSlot } from "@/app/types/admin.contract";
import { useForm, Controller } from "react-hook-form";
import { toZonedTime, format } from "date-fns-tz";

interface FormData {
  date: Date;
  reason: string;
  isRecurring: string;
  recurringUntil?: Date;
  disabledSlots: string[];
}

interface OffDayFormData {
  date: Date;
  reason?: string;
  isRecurring: boolean;
  recurringUntil?: Date;
  disabledSlots: ("half-day-morning" | "half-day-afternoon")[];
}

interface AdminOffDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onSubmit: (data: OffDayFormData) => void;
  appointmentSlotsForDate?: { morning: boolean; afternoon: boolean };
}

const timeSlots = [
  { label: "Morning (8:00 AM - 12:00 PM)", value: "half-day-morning" },
  { label: "Afternoon (1:00 PM - 5:00 PM)", value: "half-day-afternoon" },
];

const AdminOffDayModal: React.FC<AdminOffDayModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSubmit,
  appointmentSlotsForDate,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      date: selectedDate || new Date(),
      reason: "",
      isRecurring: "false",
      recurringUntil: undefined,
      disabledSlots: [],
    },
  });

  const selectedSlots = watch("disabledSlots") || [];
  const isRecurringRaw = watch("isRecurring");
  const isRecurring = isRecurringRaw === "true";
  const recurringUntil = watch("recurringUntil");

  const bothBooked = appointmentSlotsForDate?.morning && appointmentSlotsForDate?.afternoon;

  const onSubmitForm = (formData: FormData) => {
    // Convert form data to JSON format

    // Convert selectedDate and recurringUntil to US time zone and format as ISO string (with offset)
    const dateWithOffset = selectedDate?.toISOString();
    const recurringUntilWithOffset = recurringUntil?.toISOString();
    const jsonData: OffDayFormData = {
      date: dateWithOffset as any, // Cast as any to match OffDayFormData, backend should expect string
      reason: formData.reason || undefined,
      isRecurring: formData.isRecurring === "true",
      recurringUntil: recurringUntilWithOffset as any,
      disabledSlots: formData.disabledSlots as ("half-day-morning" | "half-day-afternoon")[],
    };

    console.log(jsonData);

    onSubmit(jsonData);
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Add Off Day - {selectedDate?.toLocaleDateString()}
          </Dialog.Title>

          {bothBooked ? (
            <div className="text-red-500 text-center font-medium py-8">
              Both slots already have appointments. You cannot add an off day for this date.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
                <input
                  {...register("reason")}
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Enter reason for off day"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recurring</label>
                <select {...register("isRecurring")} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                  <option value="false">One-time off day</option>
                  <option value="true">Weekly recurring</option>
                </select>
              </div>

              {isRecurring ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recurring Until</label>
                  <input
                    type="date"
                    {...register("recurringUntil", { required: isRecurring })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    min={selectedDate ? selectedDate.toISOString().split("T")[0] : undefined}
                  />
                  {errors.recurringUntil && (
                    <p className="text-red-500 text-sm mt-1">Please select an end date for recurrence</p>
                  )}
                </div>
              ) : null}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disabled Slots</label>
                <div className="space-y-2">
                  <Controller
                    name="disabledSlots"
                    control={control}
                    rules={{ required: true, minLength: 1 }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        {timeSlots.map((slot) => {
                          const isBooked =
                            slot.value === "half-day-morning"
                              ? appointmentSlotsForDate?.morning
                              : appointmentSlotsForDate?.afternoon;
                          return (
                            <label
                              key={slot.label}
                              className={`flex items-center space-x-2 ${isBooked ? "opacity-50" : ""}`}
                            >
                              <input
                                type="checkbox"
                                value={slot.value}
                                checked={value?.includes(slot.value)}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const newValue = checked
                                    ? [...(value || []), slot.value]
                                    : (value || []).filter((v) => v !== slot.value);
                                  onChange(newValue);
                                }}
                                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                disabled={isBooked}
                              />
                              <span>{slot.label}</span>
                              {isBooked && <span className="text-xs text-red-400 ml-2">(Booked)</span>}
                            </label>
                          );
                        })}
                      </>
                    )}
                  />
                  {errors.disabledSlots && (
                    <p className="text-red-500 text-sm mt-1">Please select at least one time slot</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedSlots.length === 0}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                    selectedSlots.length === 0
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-primary hover:bg-primary-hover"
                  }`}
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AdminOffDayModal;
