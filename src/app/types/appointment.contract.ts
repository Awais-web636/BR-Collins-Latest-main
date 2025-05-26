export enum AppointmentType {
  HALF_DAY_MORNING = "half-day-morning", // 8AM to 12PM
  HALF_DAY_AFTERNOON = "half-day-afternoon", // 1PM to 5PM
  FULL_DAY = "full-day", // 8AM to 5PM
}

export interface IAppointment {
  id: string;
  _id: string;
  courseId: string;
  location: {
    venueName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    additionalInfo?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  date: Date;
  appointmentType: AppointmentType;
  maxParticipants: number;
  price?: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "rescheduled";
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentCreatePayload = Omit<IAppointment, "id" | "_id" | "status" | "createdAt" | "updatedAt">;

export type AppointmentUpdatePayload = Partial<AppointmentCreatePayload>;
