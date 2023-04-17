export interface Appointment {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  description?: string;
}

export interface TimeSlot {
  time: string;
  appointment?: Appointment;
}
