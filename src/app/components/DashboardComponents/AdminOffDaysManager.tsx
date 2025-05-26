"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import { showToast } from "@/app/utils/toast";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { IAdminOffDay } from "@/app/types/admin.contract";
import { useAppSelector } from "@/app/store/hooks";
import { getRefreshToken } from "@/app/store/features/users/userSlice";
import AdminOffDayModal from "./AdminOffDayModal";
import ViewOffDayModal from "./ViewOffDayModal";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light-border.css";
import { IAppointment, AppointmentType } from "@/app/types/appointment.contract";
import { ICourse } from "@/app/types/course.contract";

interface OffDayFormData {
  date: Date;
  reason?: string;
  isRecurring: boolean;
  recurringUntil?: Date;
  disabledSlots: ("half-day-morning" | "half-day-afternoon")[];
}

const fetchOffDays = async (refreshToken: string): Promise<{ data: IAdminOffDay[] }> => {
  const response = await api.get("/admin-off-days", {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  return response.data;
};

const fetchAppointments = async (refreshToken: string): Promise<{ data: IAppointment[] }> => {
  const response = await api.get("/appointments?populate=courseId&showCancelled=false", {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  return response.data;
};

const AdminOffDaysManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedOffDay, setSelectedOffDay] = useState<IAdminOffDay | null>(null);
  const queryClient = useQueryClient();
  const refreshToken = useAppSelector(getRefreshToken);

  // Add custom styles for mobile
  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media (max-width: 640px) {
        .fc .fc-toolbar {
          flex-direction: column;
          gap: 1rem;
        }
        .fc .fc-toolbar-title {
          font-size: 1.2rem;
          text-align: center;
        }
        .fc .fc-button {
          padding: 0.4em 0.65em;
          font-size: 0.9em;
        }
        .fc .fc-toolbar-chunk {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          width: 100%;
        }
        .fc .fc-view-harness {
          min-height: 400px;
        }
        .fc .fc-daygrid-day-number {
          font-size: 0.9em;
          padding: 4px;
        }
        .fc .fc-daygrid-day-top {
          justify-content: center;
        }
        .fc .fc-daygrid-day-frame {
          min-height: 5em;
        }
        .fc .fc-day-header {
          font-size: 0.9em;
          padding: 4px 2px !important;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          padding: 2px;
        }
        .fc-daygrid-event {
          padding: 2px 4px !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const { data: offDays = [], isLoading } = useQuery({
    queryKey: ["adminOffDays"],
    queryFn: () => fetchOffDays(refreshToken!),
    select: (data) => data.data,
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => fetchAppointments(refreshToken!),
    select: (data) => data.data,
    enabled: !!refreshToken,
    initialData: { data: [] },
  });

  const addOffDayMutation = useMutation({
    mutationFn: async (data: OffDayFormData) => {
      const response = await api.post("/admin-off-days", data, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOffDays"] });
      showToast("Off day added successfully", "success");
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to add off day";
      showToast(message, "error");
    },
  });

  const deleteOffDayMutation = useMutation({
    mutationFn: async (offDayId: string) => {
      const response = await api.delete(`/admin-off-days/${offDayId}`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOffDays"] });
      showToast("Off day deleted successfully", "success");
      setIsViewModalOpen(false);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete off day";
      showToast(message, "error");
    },
  });

  const handleDateClick = (info: DateClickArg) => {
    // info.dateStr is in 'YYYY-MM-DD' format
    const [year, month, day] = info.dateStr.split("-").map(Number);
    // JS months are 0-indexed
    const localDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    console.log(localDate);
    setSelectedDate(localDate);
    setIsModalOpen(true);
  };

  const handleEventClick = (info: any) => {
    const originalId = info.event.extendedProps.originalId;
    const offDay = offDays.find((day) => day._id === originalId);
    if (offDay) {
      setSelectedOffDay(offDay);
      setIsViewModalOpen(true);
    }
  };

  const handleModalSubmit = (data: OffDayFormData) => {
    console.log(data);
    addOffDayMutation.mutate(data);
  };

  const handleDelete = (offDayId: string) => {
    deleteOffDayMutation.mutate(offDayId);
  };

  const getAppointmentTimes = (appointment: IAppointment) => {
    const date = new Date(appointment.date);
    let startTime = new Date(date);
    let endTime = new Date(date);
    switch (appointment.appointmentType) {
      case AppointmentType.HALF_DAY_MORNING:
        startTime.setHours(8, 0, 0, 0);
        endTime.setHours(12, 0, 0, 0);
        break;
      case AppointmentType.HALF_DAY_AFTERNOON:
        startTime.setHours(13, 0, 0, 0);
        endTime.setHours(17, 0, 0, 0);
        break;
      case AppointmentType.FULL_DAY:
        startTime.setHours(8, 0, 0, 0);
        endTime.setHours(17, 0, 0, 0);
        break;
    }
    return { startTime, endTime };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "#3B82F6"; // blue
      case "in-progress":
        return "#10B981"; // green
      case "completed":
        return "#059669"; // darker green
      case "cancelled":
        return "#EF4444"; // red
      case "rescheduled":
        return "#F59E0B"; // amber
      default:
        return "#6B7280"; // gray
    }
  };

  const calendarEvents = [
    // Appointments as events
    ...(appointments?.map((appointment) => {
      const { startTime, endTime } = getAppointmentTimes(appointment);
      return {
        id: appointment._id,
        title: `${(appointment.courseId as unknown as ICourse).title}`,
        start: startTime,
        end: endTime,
        allDay: false,
        backgroundColor: getStatusColor(appointment.status),
        borderColor: getStatusColor(appointment.status),
        textColor: "#ffffff",
        classNames: ["cursor-not-allowed"],
        extendedProps: {
          type: appointment.appointmentType,
          location: appointment.location,
          maxParticipants: appointment.maxParticipants,
          status: appointment.status,
          isAppointment: true,
        },
      };
    }) || []),
    // Off days as events
    ...offDays.flatMap((offDay) => {
      const events = [];
      const startDate = new Date(offDay.date);
      if (offDay.isRecurring) {
        let endDate: Date;
        if (offDay.recurringUntil) {
          endDate = new Date(offDay.recurringUntil);
        } else {
          endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + 6);
        }
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          events.push({
            id: `off-day-${offDay._id}-${currentDate.toISOString()}`,
            title: offDay.reason || "Recurring Off Day",
            start: offDay.disabledSlots.includes("half-day-morning")
              ? new Date(new Date(currentDate).setHours(8, 0, 0, 0))
              : offDay.disabledSlots.includes("half-day-afternoon")
              ? new Date(new Date(currentDate).setHours(13, 0, 0, 0))
              : new Date(currentDate),
            end: offDay.disabledSlots.includes("half-day-morning")
              ? new Date(new Date(currentDate).setHours(12, 0, 0, 0))
              : offDay.disabledSlots.includes("half-day-afternoon")
              ? new Date(new Date(currentDate).setHours(17, 0, 0, 0))
              : new Date(currentDate),
            backgroundColor: offDay.disabledSlots?.length ? "#FDA4AF" : "#F43F5E",
            borderColor: offDay.disabledSlots?.length ? "#FDA4AF" : "#F43F5E",
            textColor: "#ffffff",
            classNames: ["cursor-pointer"],
            extendedProps: {
              originalId: offDay._id,
              slots: offDay.disabledSlots,
              isRecurring: offDay.isRecurring,
              recurringDay: currentDate.toLocaleDateString("en-US", { weekday: "long" }),
              originalDate: startDate.toISOString(),
              isOffDay: true,
            },
          });
          currentDate.setDate(currentDate.getDate() + 7);
        }
      } else {
        events.push({
          id: `off-day-${offDay._id}`,
          title: offDay.reason || "Off Day",
          start: offDay.disabledSlots.includes("half-day-morning")
            ? new Date(startDate.setHours(8, 0, 0, 0))
            : offDay.disabledSlots.includes("half-day-afternoon")
            ? new Date(startDate.setHours(13, 0, 0, 0))
            : startDate,
          end: offDay.disabledSlots.includes("half-day-morning")
            ? new Date(startDate.setHours(12, 0, 0, 0))
            : offDay.disabledSlots.includes("half-day-afternoon")
            ? new Date(startDate.setHours(17, 0, 0, 0))
            : startDate,
          backgroundColor: offDay.disabledSlots?.length ? "#FDA4AF" : "#F43F5E",
          borderColor: offDay.disabledSlots?.length ? "#FDA4AF" : "#F43F5E",
          textColor: "#ffffff",
          classNames: ["cursor-pointer"],
          extendedProps: {
            originalId: offDay._id,
            slots: offDay.disabledSlots,
            isRecurring: offDay.isRecurring,
            isOffDay: true,
          },
        });
      }
      return events;
    }),
  ];

  console.log(calendarEvents);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 mb-4 sm:mb-6">Manage Off Days</h2>

      {isLoading ? (
        <div className="h-[400px] sm:h-[600px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading off days...</p>
          </div>
        </div>
      ) : (
        <div className="h-[400px] sm:h-[600px] overflow-x-auto">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth",
            }}
            views={{
              dayGridMonth: {
                titleFormat: { year: "numeric", month: "long" },
                dayHeaderFormat: { weekday: "short" },
              },
            }}
            height="auto"
            contentHeight="auto"
            aspectRatio={1.35}
            handleWindowResize={true}
            stickyHeaderDates={true}
            expandRows={true}
            events={calendarEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventContent={(eventInfo) => {
              if (eventInfo.event.extendedProps.isAppointment) {
                const isMobile = window.innerWidth < 640;
                return (
                  <div className="w-full p-1">
                    <div className="font-semibold text-xs sm:text-sm truncate">{eventInfo.event.title}</div>
                    {!isMobile && (
                      <div className="text-xs mt-0.5 inline-block px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Appointment
                      </div>
                    )}
                  </div>
                );
              }
              // Off day event rendering (match Appointments.tsx style)
              const isRecurring = eventInfo.event.extendedProps.isRecurring;
              const slots = eventInfo.event.extendedProps.slots || [];
              let slotLabel = "Full Day";
              let slotTime = "8 AM - 5 PM";
              if (slots.length === 1) {
                if (slots.includes("half-day-morning")) {
                  slotLabel = "Morning";
                  slotTime = "8 AM - 12 PM";
                } else if (slots.includes("half-day-afternoon")) {
                  slotLabel = "Afternoon";
                  slotTime = "1 PM - 5 PM";
                }
              }
              const isMobile = window.innerWidth < 640;
              return (
                <div className="w-full p-1 flex flex-col items-start">
                  <div className="font-semibold text-xs sm:text-sm truncate flex items-center gap-1">
                    {isRecurring && <span>🔄</span>}
                    <span>{eventInfo.event.title}</span>
                  </div>
                  {!isMobile && (
                    <div className="text-xs opacity-90 truncate mt-0.5">
                      {slotLabel} <span className="mx-1">•</span> {slotTime}
                    </div>
                  )}
                </div>
              );
            }}
            eventDidMount={(info) => {
              const isRecurring = info.event.extendedProps.isRecurring;
              const slots = info.event.extendedProps.slots || [];
              let slotLabel = "Full Day";
              let slotTime = "8 AM - 5 PM";
              if (slots.length === 1) {
                if (slots.includes("half-day-morning")) {
                  slotLabel = "Morning";
                  slotTime = "8 AM - 12 PM";
                } else if (slots.includes("half-day-afternoon")) {
                  slotLabel = "Afternoon";
                  slotTime = "1 PM - 5 PM";
                }
              }
              tippy(info.el, {
                content: `
                  <div class=\"p-3 min-w-[280px]\">
                    <div class=\"font-semibold text-base mb-2\">${isRecurring ? "🔄 " : ""}${info.event.title}</div>
                    <div class=\"space-y-2\">
                      <div class=\"flex items-center gap-2\">
                        <span class=\"text-gray-500\">Date:</span>
                        <span>${new Date(info.event.start!).toLocaleDateString()}</span>
                      </div>
                      <div class=\"flex items-center gap-2\">
                        <span class=\"text-gray-500\">Type:</span>
                        <span>${slotLabel}</span>
                      </div>
                      <div class=\"flex items-center gap-2\">
                        <span class=\"text-gray-500\">Time:</span>
                        <span>${slotTime}</span>
                      </div>
                      ${
                        isRecurring
                          ? `
                        <div class=\"flex items-center gap-2 mt-1 pt-2 border-t border-gray-200\">
                          <span class=\"text-gray-500\">Recurring:</span>
                          <span>Every ${info.event.extendedProps.recurringDay}</span>
                        </div>
                        <div class=\"flex items-center gap-2\">
                          <span class=\"text-gray-500\">First Set:</span>
                          <span>${new Date(info.event.extendedProps.originalDate).toLocaleDateString()}</span>
                        </div>
                      `
                          : ""
                      }
                    </div>
                  </div>
                `,
                allowHTML: true,
                placement: "top",
                arrow: true,
                theme: "light-border",
                delay: [200, 0],
                interactive: true,
                maxWidth: 320,
              });
            }}
          />
        </div>
      )}

      <AdminOffDayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSubmit={handleModalSubmit}
        appointmentSlotsForDate={(() => {
          if (!selectedDate) return { morning: false, afternoon: false };
          // Find appointments for this date
          const morningBooked = appointments.some((appt) => {
            const apptDate = new Date(appt.date);
            return (
              apptDate.getFullYear() === selectedDate.getFullYear() &&
              apptDate.getMonth() === selectedDate.getMonth() &&
              apptDate.getDate() === selectedDate.getDate() &&
              (appt.appointmentType === AppointmentType.HALF_DAY_MORNING ||
                appt.appointmentType === AppointmentType.FULL_DAY)
            );
          });
          const afternoonBooked = appointments.some((appt) => {
            const apptDate = new Date(appt.date);
            return (
              apptDate.getFullYear() === selectedDate.getFullYear() &&
              apptDate.getMonth() === selectedDate.getMonth() &&
              apptDate.getDate() === selectedDate.getDate() &&
              (appt.appointmentType === AppointmentType.HALF_DAY_AFTERNOON ||
                appt.appointmentType === AppointmentType.FULL_DAY)
            );
          });
          return { morning: morningBooked, afternoon: afternoonBooked };
        })()}
      />

      <ViewOffDayModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        offDay={selectedOffDay}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminOffDaysManager;
