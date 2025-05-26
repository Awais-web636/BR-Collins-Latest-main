export interface IDisabledSlot {
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface IAdminOffDay {
  _id: string;
  date: Date;
  reason?: string;
  disabledSlots: ("half-day-morning" | "half-day-afternoon")[]; // If empty, entire day is off
  isRecurring: boolean; // For weekly off days
  dayOfWeek?: number; // 0-6 for recurring days (0 = Sunday)
  createdAt?: Date;
  updatedAt?: Date;
  recurringUntil?: Date;
}

export type AdminOffDayCreatePayload = Omit<IAdminOffDay, "_id" | "createdAt" | "updatedAt">;
