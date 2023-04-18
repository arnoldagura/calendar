export interface IAppointment {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  description?: string;
}

export class Appointment implements IAppointment {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  description?: string;

  constructor(data: IAppointment) {
    this.id = data.id;
    this.title = data.title;
    this.date = data.date;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.description = data.description;
  }

  get isValid(): boolean {
    if (
      this.id &&
      this.title &&
      this.date &&
      this.startTime &&
      this.endTime &&
      new Date(`01/01/2021 ${this.startTime}`) <
        new Date(`01/01/2021 ${this.endTime}`)
    ) {
      return true; // Appointment is valid
    } else {
      return false; // Appointment is invalid
    }
  }
}

export interface ITimeSlot {
  time: string;
  appointment?: IAppointment;
}
