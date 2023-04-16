export interface CalendarEvent {
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  description?: string;
}

export interface CalendarEvents {
  date: Date;
  events: CalendarEvent[];
}

export interface CalendarDayEvents {
  time: string;
  event?: CalendarEvent;
}
