"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import { showToast } from "@/app/utils/toast";
import FormField from "./FormField";
import { AppointmentCreatePayload, IAppointment, AppointmentType } from "@/app/types/appointment.contract";
import { ICourse } from "@/app/types/course.contract";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/app/store/hooks";
import { IAdminOffDay } from "@/app/types/admin.contract";
import { getRefreshToken } from "@/app/store/features/users/userSlice";

interface AvailableSlot {
  date: string;
  availableSlots: ("half-day-morning" | "half-day-afternoon" | "full-day")[];
}

const fetchCourses = async (): Promise<{ data: ICourse[] }> => {
  const response = await api.get("/courses?showBlocked=false");
  return response.data;
};

const fetchAppointment = async (id: string): Promise<{ data: IAppointment }> => {
  const response = await api.get(`/appointments/${id}`);
  return response.data;
};

const fetchAvailableSlots = async (date: Date, refreshToken: string): Promise<AvailableSlot[]> => {
  // Check if the month is previous to current month
  const currentDate = new Date();
  const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const selectedMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  if (selectedMonth < currentMonth) {
    return [];
  }

  // Only fetch slots for the current month being displayed
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const startDate = firstDayOfMonth.toISOString().split("T")[0];
  const endDate = lastDayOfMonth.toISOString().split("T")[0];

  // Fetch both regular and recurring off days
  const [slotsResponse, offDaysResponse] = await Promise.all([
    api.get(`/appointments/available-slots?startDate=${startDate}&endDate=${endDate}`),
    api.get("/admin-off-days", {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }),
  ]);

  const regularSlots = slotsResponse.data.data;
  const adminOffDays = offDaysResponse.data.data;

  // Process regular slots and add recurring off days
  const allSlots: AvailableSlot[] = [...regularSlots];

  // Process each day in the month
  let currentDay = new Date(firstDayOfMonth);
  while (currentDay <= lastDayOfMonth) {
    const dateStr = currentDay.toISOString().split("T")[0];
    let slotIndex = allSlots.findIndex((slot) => slot.date === dateStr);

    // Check for recurring off days
    const recurringOffDays = adminOffDays.filter((offDay: IAdminOffDay) => {
      if (!offDay.isRecurring) return false;
      const offDayDate = new Date(offDay.date);
      return currentDay.getDay() === offDayDate.getDay();
    });

    // Check for regular off days
    const regularOffDays = adminOffDays.filter((offDay: IAdminOffDay) => {
      if (offDay.isRecurring) return false;
      const offDayDate = new Date(offDay.date);
      return (
        offDayDate.getDate() === currentDay.getDate() &&
        offDayDate.getMonth() === currentDay.getMonth() &&
        offDayDate.getFullYear() === currentDay.getFullYear()
      );
    });

    const offDays = [...recurringOffDays, ...regularOffDays];

    if (offDays.length > 0) {
      const unavailableSlots = new Set<string>();

      offDays.forEach((offDay: IAdminOffDay) => {
        offDay.disabledSlots.forEach((slot: "half-day-morning" | "half-day-afternoon") => {
          if (slot === "half-day-morning") {
            unavailableSlots.add("half-day-morning");
            unavailableSlots.add("full-day");
          }
          if (slot === "half-day-afternoon") {
            unavailableSlots.add("half-day-afternoon");
            unavailableSlots.add("full-day");
          }
        });
      });

      if (slotIndex === -1) {
        // Create new slot if it doesn't exist
        allSlots.push({
          date: dateStr,
          availableSlots: ["half-day-morning", "half-day-afternoon", "full-day"].filter(
            (slot) => !unavailableSlots.has(slot)
          ) as ("half-day-morning" | "half-day-afternoon" | "full-day")[],
        });
      } else {
        // Update existing slot
        allSlots[slotIndex].availableSlots = allSlots[slotIndex].availableSlots.filter(
          (slot) => !unavailableSlots.has(slot)
        );
      }
    }

    currentDay.setDate(currentDay.getDate() + 1);
  }

  return allSlots;
};

const appointmentSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  location: z.object({
    venueName: z.string().min(1, "Venue name is required"),
    streetAddress: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP code is required"),
    additionalInfo: z.string().optional(),
    coordinates: z
      .object({
        latitude: z.number(),
        longitude: z.number(),
      })
      .optional(),
  }),
  date: z.string().min(1, "Date is required"),
  appointmentType: z.nativeEnum(AppointmentType, {
    required_error: "Appointment type is required",
  }),
  maxParticipants: z
    .number({
      required_error: "Maximum participants is required",
      invalid_type_error: "Maximum participants must be a number",
    })
    .min(1, "Maximum participants is required"),
  notes: z.string().min(1, "Notes are required"),
});

type AppointmentFormData = Omit<z.infer<typeof appointmentSchema>, "price">;

export default function AddAppointment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState(false);
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const refreshToken = useAppSelector(getRefreshToken);

  // Add query for available slots
  const { data: availableSlots = [], isLoading: isLoadingSlots } = useQuery({
    queryKey: ["availableSlots", currentMonth],
    queryFn: () => fetchAvailableSlots(currentMonth, refreshToken!),
    enabled: currentMonth >= new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  });

  // Add query for admin off days
  const { data: adminOffDays = [] } = useQuery({
    queryKey: ["adminOffDays"],
    queryFn: async () => {
      const response = await api.get("/admin-off-days", {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      return response.data.data;
    },
    select: (data) => data.data,
    enabled: !!refreshToken,
    initialData: { data: [] },
  });

  const {
    data: courses,
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    select: (data) => data.data,
  });

  const {
    data: appointment,
    isLoading: isLoadingAppointment,
    error: appointmentError,
  } = useQuery({
    queryKey: ["appointment", editId],
    queryFn: () => fetchAppointment(editId!),
    select: (data) => data.data,
    enabled: isEditMode,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentCreatePayload) => {
      const response = await api.post("/appointments", data, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      showToast("Appointment added successfully", "success");
      setSuccess(true);
      router.push("/dashboard?item=viewAppointments");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to add appointment";
      showToast(message, "error");
      console.error("Error adding appointment:", error);
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentCreatePayload) => {
      const response = await api.put(`/appointments/${editId}`, data);
      return response.data;
    },
    onSuccess: () => {
      showToast("Appointment updated successfully", "success");
      setSuccess(true);
      router.push("/dashboard?item=viewAppointments");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update appointment";
      showToast(message, "error");
      console.error("Error updating appointment:", error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    if (appointment && courses && !isLoadingCourses) {
      const formattedDate = new Date(appointment.date).toISOString().split("T")[0];
      reset({
        courseId: appointment.courseId,
        location: appointment.location,
        date: formattedDate,
        appointmentType: appointment.appointmentType,
        maxParticipants: appointment.maxParticipants,
        notes: appointment.notes,
      });
    }
  }, [appointment, courses, isLoadingCourses, reset]);

  // Watch the date field
  const selectedDate = watch("date");

  // Function to check if a slot is available
  const isSlotAvailable = (date: Date, appointmentType: AppointmentType) => {
    const dateStr = date.toISOString().split("T")[0];

    // First check regular slots
    const slot = availableSlots.find((slot: AvailableSlot) => slot.date === dateStr);

    // Convert AppointmentType to slot type
    let slotType: "half-day-morning" | "half-day-afternoon" | "full-day";
    switch (appointmentType) {
      case AppointmentType.HALF_DAY_MORNING:
        slotType = "half-day-morning";
        break;
      case AppointmentType.HALF_DAY_AFTERNOON:
        slotType = "half-day-afternoon";
        break;
      case AppointmentType.FULL_DAY:
        slotType = "full-day";
        break;
      default:
        return false;
    }

    // If slot exists in availableSlots, check its availability
    if (slot) {
      return slot.availableSlots.includes(slotType);
    }

    // If no slot found, check if the date is blocked by recurring off days
    const isBlockedByRecurringOffDay = (adminOffDays || [])?.some((offDay: IAdminOffDay) => {
      if (!offDay.isRecurring) return false;

      const offDayDate = new Date(offDay.date);
      const isSameDay = date.getDay() === offDayDate.getDay();

      if (!isSameDay) return false;

      // Check if the specific slot type is blocked
      return offDay.disabledSlots.some((slot: "half-day-morning" | "half-day-afternoon") => {
        if (slot === "half-day-morning" && (slotType === "half-day-morning" || slotType === "full-day")) {
          return true;
        }
        if (slot === "half-day-afternoon" && (slotType === "half-day-afternoon" || slotType === "full-day")) {
          return true;
        }
        return false;
      });
    });

    // If blocked by recurring off day, return false
    if (isBlockedByRecurringOffDay) {
      return false;
    }

    // If not found in slots and not blocked by recurring off days, assume it's available
    return true;
  };

  const onSubmit = async (data: AppointmentFormData) => {
    const selectedDate = new Date(data.date);

    if (!isSlotAvailable(selectedDate, data.appointmentType)) {
      showToast("Selected time slot is not available", "error");
      return;
    }

    // Convert form data to AppointmentCreatePayload
    const appointmentData: AppointmentCreatePayload = {
      ...data,
      date: new Date(data.date),
    };

    if (isEditMode) {
      updateAppointmentMutation.mutate(appointmentData);
    } else {
      createAppointmentMutation.mutate(appointmentData);
    }
  };

  if (isLoadingAppointment) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading appointment data...</p>
        </div>
      </div>
    );
  }

  if (appointmentError) {
    showToast("Failed to load appointment data", "error");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-neutral-900 mb-8">
        {isEditMode ? "Edit Appointment" : "Add New Appointment"}
      </h2>

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
          {isEditMode ? "Appointment updated successfully!" : "Appointment added successfully!"}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-neutral-900">Location Information</h3>

          <FormField
            label="Venue Name *"
            description="Name of the meeting venue or location"
            {...register("location.venueName")}
            error={errors.location?.venueName?.message}
            required
            placeholder="e.g., Client Office, Conference Center, Hotel Name"
          />

          <FormField
            label="Street Address *"
            description="Street address of the location"
            {...register("location.streetAddress")}
            error={errors.location?.streetAddress?.message}
            required
            placeholder="e.g., 123 Main Street"
          />

          <FormField
            label="City *"
            description="City name"
            {...register("location.city")}
            error={errors.location?.city?.message}
            required
            placeholder="e.g., New York"
          />

          <FormField
            label="State *"
            description="State or province"
            {...register("location.state")}
            error={errors.location?.state?.message}
            required
            placeholder="e.g., NY"
          />

          <FormField
            label="ZIP Code *"
            description="Postal code"
            {...register("location.zipCode")}
            error={errors.location?.zipCode?.message}
            required
            placeholder="e.g., 10001"
          />

          <FormField
            label="Additional Location Details"
            description="Any additional information about the location"
            {...register("location.additionalInfo")}
            error={errors.location?.additionalInfo?.message}
            placeholder="e.g., Floor number, suite number, parking instructions"
            textarea
          />
        </div>

        <FormField
          label="Course *"
          description="Select the course for the appointment"
          {...register("courseId")}
          error={errors.courseId?.message}
          select
          required
          options={[
            { value: "", label: isLoadingCourses ? "Loading courses..." : "Select a course" },
            ...(courses?.map((course) => ({
              value: course._id,
              label: course.title,
            })) || []),
          ]}
        />

        {isLoadingCourses && <div className="text-sm text-gray-500">Loading courses...</div>}
        {coursesError && <div className="text-sm text-red-500">Error loading courses. Please try again later.</div>}

        <FormField
          label="Date *"
          description="Select the date for the appointment"
          {...register("date")}
          error={errors.date?.message}
          type="date"
          required
          onChange={(e) => {
            register("date").onChange(e);
            // Reset appointment type when date changes
            setValue("appointmentType", "" as AppointmentType);
            // Update current month for fetching available slots
            const selectedDate = new Date(e.target.value);
            setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
          }}
          min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
        />

        <FormField
          label="Appointment Type *"
          description="Select the type of appointment"
          {...register("appointmentType")}
          error={errors.appointmentType?.message}
          select
          required
          options={[
            { value: "", label: "Select appointment type" },
            {
              value: AppointmentType.HALF_DAY_MORNING,
              label: "Half Day Morning (8AM - 12PM)",
              disabled: selectedDate
                ? !isSlotAvailable(new Date(selectedDate), AppointmentType.HALF_DAY_MORNING)
                : false,
            },
            {
              value: AppointmentType.HALF_DAY_AFTERNOON,
              label: "Half Day Afternoon (1PM - 5PM)",
              disabled: selectedDate
                ? !isSlotAvailable(new Date(selectedDate), AppointmentType.HALF_DAY_AFTERNOON)
                : false,
            },
            {
              value: AppointmentType.FULL_DAY,
              label: "Full Day (8AM - 5PM)",
              disabled: selectedDate ? !isSlotAvailable(new Date(selectedDate), AppointmentType.FULL_DAY) : false,
            },
          ]}
        />

        {selectedDate && (
          <div className="mt-2 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Availability Status:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {!isSlotAvailable(new Date(selectedDate), AppointmentType.HALF_DAY_MORNING) && (
                <>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Half Day Morning is already booked
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Full Day is unavailable (morning is booked)
                  </li>
                </>
              )}
              {!isSlotAvailable(new Date(selectedDate), AppointmentType.HALF_DAY_AFTERNOON) && (
                <>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Half Day Afternoon is already booked
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Full Day is unavailable (afternoon is booked)
                  </li>
                </>
              )}
              {!isSlotAvailable(new Date(selectedDate), AppointmentType.FULL_DAY) &&
                isSlotAvailable(new Date(selectedDate), AppointmentType.HALF_DAY_MORNING) &&
                isSlotAvailable(new Date(selectedDate), AppointmentType.HALF_DAY_AFTERNOON) && (
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Full Day is already booked
                  </li>
                )}
              {isSlotAvailable(new Date(selectedDate), AppointmentType.HALF_DAY_MORNING) &&
                isSlotAvailable(new Date(selectedDate), AppointmentType.HALF_DAY_AFTERNOON) &&
                isSlotAvailable(new Date(selectedDate), AppointmentType.FULL_DAY) && (
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    All time slots are available
                  </li>
                )}
            </ul>
          </div>
        )}

        <FormField
          label="Maximum Participants *"
          description="Maximum number of participants"
          {...register("maxParticipants", { valueAsNumber: true })}
          error={errors.maxParticipants?.message}
          placeholder="e.g., 10"
          type="number"
          required
        />

        <FormField
          label="Notes"
          description="Add any additional notes for the appointment"
          placeholder="Enter notes..."
          {...register("notes")}
          error={errors.notes?.message}
          textarea
        />

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={createAppointmentMutation.isPending || updateAppointmentMutation.isPending}
            className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {createAppointmentMutation.isPending || updateAppointmentMutation.isPending
              ? isEditMode
                ? "Updating Appointment..."
                : "Adding Appointment..."
              : isEditMode
              ? "Update Appointment"
              : "Add Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
}
