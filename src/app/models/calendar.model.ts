export interface CalendarDay {
  date?: Date;
  dayOfWeek?: number;
  events: CalendarEvent[];
  appointments: CalendarAppointment[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
}

export interface CalendarAppointment {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
}
