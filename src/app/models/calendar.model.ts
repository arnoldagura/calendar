interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
  appointments: CalendarAppointment[];
}

interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
}

interface CalendarAppointment {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
}
