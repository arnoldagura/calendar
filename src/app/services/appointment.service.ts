import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Appointment, TimeSlot } from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointments$: BehaviorSubject<Appointment[]> = new BehaviorSubject<
    Appointment[]
  >([]);
  private timeSlots$: BehaviorSubject<TimeSlot[]> = new BehaviorSubject<
    TimeSlot[]
  >([]);

  times: string[] = [
    '12:00 AM',
    '1:00 AM',
    '2:00 AM',
    '3:00 AM',
    '4:00 AM',
    '5:00 AM',
    '6:00 AM',
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
    '10:00 PM',
    '11:00 PM',
  ];

  private readonly appointmentsStorageKey = 'calendar-appointments';

  constructor() {
    this.loadAppointmentsFromStorage();
  }

  private loadAppointmentsFromStorage() {
    const storedAppointments = localStorage.getItem(
      this.appointmentsStorageKey
    );
    if (storedAppointments) {
      this.appointments$.next(JSON.parse(storedAppointments));
    } else {
      this.appointments$.next([]);
    }
  }

  private saveAppointmentsToStorage() {
    localStorage.setItem(
      this.appointmentsStorageKey,
      JSON.stringify(this.appointments$.getValue())
    );
  }

  getAppointmentsValue(): Appointment[] {
    return this.appointments$.getValue();
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointments$.asObservable();
  }

  getAppointmentsForSelectedDay(): Observable<TimeSlot[]> {
    return this.timeSlots$.asObservable();
  }

  getTimes(): string[] {
    return this.times;
  }

  generateId(): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    const id = `${timestamp}-${random}`;
    return id;
  }

  addAppointment(appointment: Appointment): void {
    const currentAppointments = this.appointments$.getValue();
    appointment.id = this.generateId();
    this.appointments$.next([...currentAppointments, appointment]);
    this.saveAppointmentsToStorage();
  }

  getAppointmentById(id: string): Appointment {
    const appointment = this.appointments$.value.find((a) => a.id === id);

    if (!appointment) {
      throw new Error(`Appointment with id ${id} not found.`);
    }

    return appointment;
  }
  updateAppointment(updatedAppointment: Appointment): void {
    const currentAppointments = this.appointments$.getValue();
    const index = currentAppointments.findIndex(
      (appointment) => appointment.id === updatedAppointment.id
    );
    if (index !== -1) {
      currentAppointments[index] = updatedAppointment;
      this.appointments$.next([...currentAppointments]);
      this.saveAppointmentsToStorage();
    }
  }

  deleteAppointment(id: string): void {
    const currentAppointments = this.appointments$.getValue();
    const index = currentAppointments.findIndex(
      (appointment) => appointment.id === id
    );
    if (index !== -1) {
      currentAppointments.splice(index, 1);
      this.appointments$.next([...currentAppointments]);
      this.saveAppointmentsToStorage();
    }
  }

  moveAppointment(appointment: Appointment) {
    const currentAppointments = this.appointments$.getValue();
    const index = currentAppointments.findIndex((e) => e === appointment);
    if (index < 0) {
      return;
    }

    const updatedAppointment: Appointment = {
      ...appointment,
    };

    currentAppointments[index] = updatedAppointment;
    this.appointments$.next([...currentAppointments]);
    this.saveAppointmentsToStorage();

    return updatedAppointment;
  }

  updateSelectedDay(month: Date) {
    month.setHours(0, 0, 0, 0);
    this.appointments$
      .asObservable()
      .pipe(
        map((appointments) =>
          this.times.map((time) => {
            const appointment = appointments.find(
              (e) =>
                new Date(e.date) >= month &&
                new Date(e.date) <= month &&
                e.startTime === time
            );
            return { time, appointment };
          })
        )
      )
      .subscribe((appointments) => {
        this.timeSlots$.next(appointments);
      });
  }
}
