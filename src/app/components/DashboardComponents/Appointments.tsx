"use client";
import React, { useState, useRef, useEffect } from "react";
import { ViewIcon, ArrowLeftIcon, ArrowRightIcon, CalendarIcon, TableIcon } from "./Icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import { showToast } from "@/app/utils/toast";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CustomDataTable from "./CustomDataTable";
import ActionIcons from "@/components/ActionIcons";
import { IAppointment, AppointmentType } from "@/app/types/appointment.contract";
import { ICourse } from "@/app/types/course.contract";
import ViewAppointmentModal from "./ViewAppointmentModal";
import { useRouter } from "next/navigation";
import AppointmentStatusMenu from "./AppointmentStatusMenu";
import { useAppSelector } from "@/app/store/hooks";
import { getRefreshToken, selectUser } from "@/app/store/features/users/userSlice";
import { IUser } from "@/app/types/user.contract";
import { IAdminOffDay } from "@/app/types/admin.contract";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light-border.css";
import AdminOffDayModal from "./AdminOffDayModal";
import ViewOffDayModal from "./ViewOffDayModal";

const fetchAppointments = async (refreshToken: string): Promise<{ data: IAppointment[] }> => {
  const response = await api.get("/appointments?populate=courseId", {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  return response.data;
};

const fetchOffDays = async (refreshToken: string): Promise<{ data: IAdminOffDay[] }> => {
  const response = await api.get("/admin-off-days", {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  return response.data;
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

const Appointments = () => {
  const [view, setView] = useState<"table" | "calendar">("table");
  const [calendarView, setCalendarView] = useState(() => {
    const savedView = localStorage.getItem("preferredCalendarView");
    return savedView || "dayGridMonth";
  });
  const [isScrollable, setIsScrollable] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const router = useRouter();
  const user = useAppSelector(selectUser) as IUser;
  const refreshToken = useAppSelector(getRefreshToken);
  const queryClient = useQueryClient();
  const [isOffDayModalOpen, setIsOffDayModalOpen] = useState(false);
  const [isViewOffDayModalOpen, setIsViewOffDayModalOpen] = useState(false);
  const [selectedOffDayDate, setSelectedOffDayDate] = useState<Date | null>(null);
  const [selectedOffDay, setSelectedOffDay] = useState<IAdminOffDay | null>(null);

  const {
    data: appointments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => fetchAppointments(refreshToken!),
    select: (data) => data.data,
  });

  const { data: adminOffDays = [] } = useQuery({
    queryKey: ["adminOffDays"],
    queryFn: () => fetchOffDays(refreshToken!),
    select: (data) => data.data,
    enabled: !!refreshToken,
    initialData: { data: [] },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({
      appointmentId,
      status,
      data,
    }: {
      appointmentId: string;
      status: "scheduled" | "in-progress" | "completed" | "cancelled" | "rescheduled";
      data?: { newDate?: string; newTime?: string; reason?: string };
    }) => {
      const response = await api.patch(
        `/appointments/${appointmentId}`,
        { status, ...data },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      // showToast("Appointment status updated successfully", "success");
    },
    onError: (error: any) => {
      // const message = error.response?.data?.message || "Failed to update appointment status";
      // showToast(message, "error");
      console.error("Error updating appointment status:", error);
      throw error;
    },
  });

  const addOffDayMutation = useMutation({
    mutationFn: async (data: any) => {
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
      setIsOffDayModalOpen(false);
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
      setIsViewOffDayModalOpen(false);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete off day";
      showToast(message, "error");
    },
  });

  useEffect(() => {
    const checkScrollable = () => {
      if (tableContainerRef.current) {
        const { scrollWidth, clientWidth } = tableContainerRef.current;
        setIsScrollable(scrollWidth > clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [appointments]);

  useEffect(() => {
    // Add custom styles for FullCalendar on mobile
    const style = document.createElement("style");
    style.innerHTML = `
      @media (max-width: 640px) {
        .fc .fc-toolbar {
          flex-direction: column;
          gap: 1rem;
        }
        .fc .fc-toolbar-title {
          font-size: 1.2rem;
        }
        .fc .fc-button {
          padding: 0.4em 0.65em;
          font-size: 0.9em;
        }
        .fc .fc-toolbar-chunk {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }
        .fc .fc-view-harness {
          min-height: 400px;
        }
        .fc .fc-timegrid-slot {
          height: 2.5em;
        }
        .fc .fc-daygrid-day-number {
          font-size: 0.9em;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const isDateDisabled = (date: Date) => {
    return adminOffDays?.some((offDay) => {
      const offDayDate = new Date(offDay.date);
      const isSameDay =
        date.getDate() === offDayDate.getDate() &&
        date.getMonth() === offDayDate.getMonth() &&
        date.getFullYear() === offDayDate.getFullYear();

      if (offDay.isRecurring) {
        return date.getDay() === new Date(offDay.date).getDay();
      }

      return isSameDay;
    });
  };

  const isSlotDisabled = (date: Date, startTime: string, endTime: string) => {
    const matchingOffDay = adminOffDays.find((offDay) => {
      const offDayDate = new Date(offDay.date);
      const isSameDay =
        date.getDate() === offDayDate.getDate() &&
        date.getMonth() === offDayDate.getMonth() &&
        date.getFullYear() === offDayDate.getFullYear();

      if (offDay.isRecurring) {
        return date.getDay() === new Date(offDay.date).getDay();
      }

      return isSameDay;
    });

    if (!matchingOffDay) return false;

    // If no specific slots are disabled, the entire day is off
    if (!matchingOffDay.disabledSlots?.length) return true;

    return matchingOffDay.disabledSlots.some((slot) => slot === "half-day-morning" || slot === "half-day-afternoon");
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
    ...(appointments?.map((appointment) => {
      const { startTime, endTime } = getAppointmentTimes(appointment);
      return {
        id: appointment._id,
        title: `${(appointment.courseId as unknown as ICourse).title}`,
        start: startTime,
        end: endTime,
        backgroundColor: getStatusColor(appointment.status),
        borderColor: getStatusColor(appointment.status),
        textColor: "#ffffff",
        extendedProps: {
          location: appointment.location,
          maxParticipants: appointment.maxParticipants,
          status: appointment.status,
          isAppointment: true,
          type: appointment.appointmentType,
        },
      };
    }) || []),
    ...adminOffDays.flatMap((offDay) => {
      const events = [];
      const startDate = new Date(offDay.date);

      if (offDay.isRecurring) {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 6);

        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const isMorning = offDay.disabledSlots?.includes("half-day-morning");
          const isAfternoon = offDay.disabledSlots?.includes("half-day-afternoon");
          const fullDay = isMorning && isAfternoon;

          events.push({
            id: `off-day-${offDay._id}-${currentDate.toISOString()}`,
            title: `🔄 ${offDay.reason || "Recurring Off Day"}: ${
              fullDay ? "Full Day" : isMorning ? "Morning" : "Afternoon"
            }`,
            start: fullDay
              ? new Date(new Date(currentDate).setHours(8, 0, 0, 0))
              : isMorning
              ? new Date(new Date(currentDate).setHours(8, 0, 0, 0))
              : new Date(new Date(currentDate).setHours(13, 0, 0, 0)),
            end: fullDay
              ? new Date(new Date(currentDate).setHours(17, 0, 0, 0))
              : isMorning
              ? new Date(new Date(currentDate).setHours(12, 0, 0, 0))
              : new Date(new Date(currentDate).setHours(17, 0, 0, 0)),
            allDay: false,
            display: fullDay ? "background" : "auto",
            backgroundColor: offDay.disabledSlots?.length ? "rgba(251, 146, 60, 0.3)" : "rgba(239, 68, 68, 0.3)",
            borderColor: offDay.disabledSlots?.length ? "rgba(251, 146, 60, 0.3)" : "rgba(239, 68, 68, 0.3)",
            textColor: "#6B7280",
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
        const isMorning = offDay.disabledSlots?.includes("half-day-morning");
        const isAfternoon = offDay.disabledSlots?.includes("half-day-afternoon");
        const fullDay = isMorning && isAfternoon;

        events.push({
          id: `off-day-${offDay._id}`,
          title: `${offDay.reason || "Off Day"}: ${fullDay ? "Full Day" : isMorning ? "Morning" : "Afternoon"}`,
          start: fullDay
            ? new Date(new Date(startDate).setHours(8, 0, 0, 0))
            : isMorning
            ? new Date(new Date(startDate).setHours(8, 0, 0, 0))
            : new Date(new Date(startDate).setHours(13, 0, 0, 0)),
          end: fullDay
            ? new Date(new Date(startDate).setHours(17, 0, 0, 0))
            : isMorning
            ? new Date(new Date(startDate).setHours(12, 0, 0, 0))
            : new Date(new Date(startDate).setHours(17, 0, 0, 0)),
          allDay: false,
          display: fullDay ? "background" : "auto",
          backgroundColor: offDay.disabledSlots?.length ? "rgba(251, 146, 60, 0.3)" : "rgba(239, 68, 68, 0.3)",
          borderColor: offDay.disabledSlots?.length ? "rgba(251, 146, 60, 0.3)" : "rgba(239, 68, 68, 0.3)",
          textColor: "#6B7280",
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

  const handleEventClick = (info: any) => {
    const appointment = appointments?.find((a) => a._id === info.event.id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsViewModalOpen(true);
    }
  };

  const handleViewAppointment = (appointment: IAppointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleEditAppointment = (appointment: IAppointment) => {
    router.push(`/dashboard?item=addAppointment&edit=${appointment._id}`);
  };

  const handleDeleteAppointment = (appointment: IAppointment) => {
    console.log("Delete appointment:", appointment);
    // TODO: Implement delete appointment functionality
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleStatusChange = async (
    appointmentId: string,
    status: "scheduled" | "in-progress" | "completed" | "cancelled" | "rescheduled",
    data?: { newDate?: string; newTime?: string; reason?: string }
  ) => {
    updateAppointmentMutation.mutate({ appointmentId, status, data });
  };

  const handleCalendarDateClick = (info: any) => {
    // setSelectedOffDayDate(info.date);
    const [year, month, day] = info.dateStr.split("-").map(Number);
    // JS months are 0-indexed
    const localDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    console.log(localDate);
    setSelectedOffDayDate(localDate);
    setIsOffDayModalOpen(true);
  };

  const handleOffDayEventClick = (info: any) => {
    if (info.event.extendedProps.isOffDay) {
      const originalId = info.event.extendedProps.originalId;
      const offDay = adminOffDays.find((day) => day._id === originalId);
      if (offDay) {
        setSelectedOffDay(offDay);
        setIsViewOffDayModalOpen(true);
      }
    } else {
      handleEventClick(info);
    }
  };

  const handleOffDayModalSubmit = (data: any) => {
    addOffDayMutation.mutate(data);
  };

  const handleDeleteOffDay = (offDayId: string) => {
    deleteOffDayMutation.mutate(offDayId);
  };

  const columns = [
    {
      name: "Course",
      selector: (row: IAppointment) => (row.courseId as unknown as ICourse).title,
      sortable: true,
      grow: 1.5,
      minWidth: "200px",
      cell: (row: IAppointment) => (
        <div
          className={`text-sm text-left text-neutral-900 truncate${row.status === "cancelled" ? " line-through" : ""}`}
          title={(row.courseId as unknown as ICourse).title}
        >
          {(row.courseId as unknown as ICourse).title}
        </div>
      ),
    },
    {
      name: "Location",
      selector: (row: IAppointment) => row.location.venueName,
      sortable: true,
      grow: 1.5,
      cell: (row: IAppointment) => (
        <div
          className={`text-sm text-left text-neutral-900 truncate${row.status === "cancelled" ? " line-through" : ""}`}
          title={row.location.venueName}
        >
          {row.location.venueName}
        </div>
      ),
    },
    {
      name: "Date",
      selector: (row: IAppointment) => new Date(row.date).toLocaleDateString(),
      sortable: true,
      grow: 1,
      cell: (row: IAppointment) => (
        <div className="text-sm text-left text-neutral-900">{new Date(row.date).toLocaleDateString()}</div>
      ),
    },
    {
      name: "Time",
      selector: (row: IAppointment) => {
        const { startTime, endTime } = getAppointmentTimes(row);
        return startTime.toLocaleTimeString();
      },
      sortable: true,
      grow: 1,
      minWidth: "200px",
      cell: (row: IAppointment) => {
        const { startTime, endTime } = getAppointmentTimes(row);
        return (
          <div className={`text-sm text-left text-neutral-900${row.status === "cancelled" ? " line-through" : ""}`}>
            {startTime.toLocaleTimeString()} - {endTime.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      name: "Max Participants",
      selector: (row: IAppointment) => row.maxParticipants,
      sortable: true,
      grow: 1,
      cell: (row: IAppointment) => <div className="text-sm text-left text-neutral-900">{row.maxParticipants}</div>,
    },
    {
      name: "Status",
      accessorKey: "status",
      header: "Status",
      minWidth: "200px",
      cell: (row: IAppointment) => (
        <AppointmentStatusMenu
          status={row.status}
          onStatusChange={(status) => handleStatusChange(row._id, status)}
          role={user.role}
          originalAppointmentType={row.appointmentType}
        />
      ),
    },
    {
      name: "Actions",
      cell: (row: IAppointment) => (
        <ActionIcons
          onView={() => handleViewAppointment(row)}
          onEdit={() => handleEditAppointment(row)}
          viewTooltip="View Appointment Details"
          editTooltip="Edit Appointment"
          disabled={{
            edit: row.status === "cancelled" || row.status === "completed",
          }}
        />
      ),
      grow: 0.5,
    },
  ];

  if (error) {
    showToast("Failed to fetch appointments", "error");
  }

  return (
    <section className="flex-1 p-2 sm:p-5 rounded-xl bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900">Appointments</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setView("table")}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto ${
              view === "table" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <TableIcon className="w-5 h-5" />
            <span>Table View</span>
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto ${
              view === "calendar" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
            <span>Calendar View</span>
          </button>
        </div>
      </div>

      {view === "table" ? (
        <div className="relative">
          {isScrollable && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          )}
          <div
            ref={tableContainerRef}
            className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <CustomDataTable
              columns={columns}
              data={appointments || []}
              isLoading={isLoading}
              error={error}
              noDataMessage="No appointments found"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <div className="h-[600px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600">Loading appointments...</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-[600px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-500 mb-2">Failed to load appointments</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[600px] bg-white rounded-lg shadow-sm overflow-x-auto">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={calendarView}
                headerToolbar={{
                  left: "prev,next",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                views={{
                  timeGridWeek: {
                    titleFormat: { year: "numeric", month: "short", day: "numeric" },
                    dayHeaderFormat: { weekday: "short", day: "numeric", omitCommas: true },
                  },
                  timeGridDay: {
                    titleFormat: { year: "numeric", month: "short", day: "numeric" },
                  },
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
                eventClick={handleOffDayEventClick}
                eventTimeFormat={{
                  hour: "numeric",
                  minute: "2-digit",
                  meridiem: "short",
                }}
                selectConstraint={{
                  start: "00:00",
                  end: "24:00",
                  daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                }}
                selectMirror={true}
                selectable={true}
                selectOverlap={false}
                selectAllow={(selectInfo) => {
                  return !isDateDisabled(selectInfo.start);
                }}
                dateClick={handleCalendarDateClick}
                eventContent={(eventInfo) => {
                  if (eventInfo.event.extendedProps.isOffDay) {
                    const title = eventInfo.event.title;
                    const isRecurring = title.includes("🔄");

                    const [recurringIcon, ...restTitle] = isRecurring
                      ? [title.slice(0, 2), title.slice(2)]
                      : ["", title];

                    return (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 font-medium p-1">
                        <div className="w-full flex items-center gap-1 overflow-hidden">
                          {isRecurring && <span className="flex-shrink-0">{recurringIcon}</span>}
                          <span className="truncate text-xs sm:text-sm">{isRecurring ? restTitle : title}</span>
                        </div>
                      </div>
                    );
                  }

                  const isMobile = window.innerWidth < 640;
                  const isCancelled = eventInfo.event.extendedProps.status === "cancelled";
                  return (
                    <div className="w-full p-1">
                      <div className={`font-semibold text-xs sm:text-sm truncate${isCancelled ? " line-through" : ""}`}>
                        {eventInfo.event.title}
                      </div>
                      {!isMobile && (
                        <>
                          <div className="text-xs opacity-90 truncate">
                            {eventInfo.timeText} • {eventInfo.event.extendedProps.location.venueName}
                          </div>
                          <div className="text-xs mt-0.5 inline-block px-1.5 py-0.5 rounded-full bg-white/20">
                            {eventInfo.event.extendedProps.status}
                          </div>
                        </>
                      )}
                    </div>
                  );
                }}
                eventDidMount={(info) => {
                  if (info.event.extendedProps.isOffDay) {
                    tippy(info.el, {
                      content: `
                        <div class="p-3 min-w-[280px]">
                          <div class="font-semibold text-base mb-2">${info.event.title}</div>
                          <div class="space-y-2">
                            <div class="flex items-center gap-2">
                              <span class="text-gray-500">Date:</span>
                              <span>${new Date(info.event.start!).toLocaleDateString()}</span>
                            </div>
                            <div class="flex items-center gap-2">
                              <span class="text-gray-500">Time:</span>
                              <span>${
                                info.event.extendedProps.slots?.includes("half-day-morning") &&
                                info.event.extendedProps.slots?.includes("half-day-afternoon")
                                  ? "Full Day (8 AM - 5 PM)"
                                  : info.event.extendedProps.slots?.includes("half-day-morning")
                                  ? "Morning (8 AM - 12 PM)"
                                  : "Afternoon (1 PM - 5 PM)"
                              }</span>
                            </div>
                            ${
                              info.event.extendedProps.isRecurring
                                ? `
                                <div class="flex items-center gap-2 mt-1 pt-2 border-t border-gray-200">
                                  <span class="text-gray-500">Recurring:</span>
                                  <span>Every ${info.event.extendedProps.recurringDay}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                  <span class="text-gray-500">First Set:</span>
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
                      animation: "shift-away",
                    });
                    return;
                  }

                  tippy(info.el, {
                    content: `
                      <div class="p-3 min-w-[280px]">
                        <div class="font-semibold text-base mb-2">${info.event.title}</div>
                        <div class="space-y-2">
                          <div class="flex items-center gap-2">
                            <span class="text-gray-500">Time:</span>
                            <span>${info.timeText}</span>
                          </div>
                          <div class="flex items-center gap-2">
                            <span class="text-gray-500">Location:</span>
                            <span>${info.event.extendedProps.location.venueName}</span>
                          </div>
                          <div class="flex items-center gap-2">
                            <span class="text-gray-500">Participants:</span>
                            <span>${info.event.extendedProps.maxParticipants}</span>
                          </div>
                          <div class="flex items-center gap-2">
                            <span class="text-gray-500">Date:</span>
                            <span>${
                              info.event.extendedProps.type === AppointmentType.HALF_DAY_MORNING
                                ? "Morning (8:00 AM - 12:00 PM)"
                                : info.event.extendedProps.type === AppointmentType.HALF_DAY_AFTERNOON
                                ? "Afternoon (1:00 PM - 5:00 PM)"
                                : "Full Day (8:00 AM - 5:00 PM)"
                            }</span>
                          </div>

                          <div class="flex items-center gap-2 mt-1 pt-2 border-t border-gray-200">
                            <span class="text-gray-500">Status:</span>
                            <span class="px-2 py-0.5 rounded-full text-xs font-medium" style="background-color: ${getStatusColor(
                              info.event.extendedProps.status
                            )}20; color: ${getStatusColor(info.event.extendedProps.status)}">
                              ${info.event.extendedProps.status}
                            </span>
                          </div>
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
                    animation: "shift-away",
                  });
                }}
                dayMaxEvents={3}
                moreLinkContent={(args) => `+${args.num} more`}
                nowIndicator={true}
                slotMinTime="08:00:00"
                slotMaxTime="18:00:00"
                businessHours={{
                  daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                  startTime: "08:00",
                  endTime: "18:00",
                }}
                slotDuration="00:30:00"
                snapDuration="00:15:00"
                allDaySlot={false}
                weekends={true}
                firstDay={1}
                scrollTime="08:00:00"
                datesSet={({ view }) => {
                  setCalendarView(view.type);
                }}
              />
            </div>
          )}
        </div>
      )}

      <ViewAppointmentModal appointment={selectedAppointment} isOpen={isViewModalOpen} onClose={handleCloseViewModal} />
      <AdminOffDayModal
        isOpen={isOffDayModalOpen}
        onClose={() => setIsOffDayModalOpen(false)}
        selectedDate={selectedOffDayDate}
        onSubmit={handleOffDayModalSubmit}
        appointmentSlotsForDate={(() => {
          if (!selectedOffDayDate) return { morning: false, afternoon: false };
          // Find appointments for this date, ignoring cancelled ones
          const morningBooked = !!appointments?.some((appt) => {
            if (appt.status === "cancelled") return false;
            const apptDate = new Date(appt.date);
            return (
              apptDate.getFullYear() === selectedOffDayDate.getFullYear() &&
              apptDate.getMonth() === selectedOffDayDate.getMonth() &&
              apptDate.getDate() === selectedOffDayDate.getDate() &&
              (appt.appointmentType === AppointmentType.HALF_DAY_MORNING ||
                appt.appointmentType === AppointmentType.FULL_DAY)
            );
          });
          const afternoonBooked = !!appointments?.some((appt) => {
            if (appt.status === "cancelled") return false;
            const apptDate = new Date(appt.date);
            return (
              apptDate.getFullYear() === selectedOffDayDate.getFullYear() &&
              apptDate.getMonth() === selectedOffDayDate.getMonth() &&
              apptDate.getDate() === selectedOffDayDate.getDate() &&
              (appt.appointmentType === AppointmentType.HALF_DAY_AFTERNOON ||
                appt.appointmentType === AppointmentType.FULL_DAY)
            );
          });
          return { morning: morningBooked, afternoon: afternoonBooked };
        })()}
      />
      <ViewOffDayModal
        isOpen={isViewOffDayModalOpen}
        onClose={() => setIsViewOffDayModalOpen(false)}
        offDay={selectedOffDay}
        onDelete={handleDeleteOffDay}
      />
    </section>
  );
};

export default Appointments;
