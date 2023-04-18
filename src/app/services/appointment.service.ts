import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  map,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import {
  Appointment,
  IAppointment,
  ITimeSlot,
} from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointments$: BehaviorSubject<IAppointment[]> = new BehaviorSubject<
    IAppointment[]
  >([]);
  private timeSlots$: BehaviorSubject<ITimeSlot[]> = new BehaviorSubject<
    ITimeSlot[]
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

  getAppointmentsValue(): IAppointment[] {
    return this.appointments$.getValue();
  }

  getAppointments(): Observable<IAppointment[]> {
    return this.appointments$.asObservable();
  }

  getAppointmentsForSelectedDay(): Observable<ITimeSlot[]> {
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

  addAppointment(appointment: IAppointment): Observable<string> {
    const currentAppointments = this.appointments$.getValue();
    const newAppointment = new Appointment({
      ...appointment,
      id: this.generateId(),
    });
    if (!newAppointment.isValid) {
      return throwError(new Error('Invalid appointment data'));
    }
    this.appointments$.next([...currentAppointments, newAppointment]);
    return of('Added Successfully').pipe(
      tap(() => this.saveAppointmentsToStorage())
    );
  }

  // updateAppointment(updatedAppointment: IAppointment): Observable<string> {
  //   return this.appointments$.pipe(
  //     take(1),
  //     map((appointments) => {
  //       const index = appointments.findIndex(
  //         (appointment) => appointment.id === updatedAppointment.id
  //       );
  //       if (index !== -1) {
  //         appointments[index] = updatedAppointment;
  //         return appointments;
  //       }
  //       throw new Error(
  //         `Appointment with id ${updatedAppointment.id} not found.`
  //       );
  //     }),
  //     tap((appointments) => {
  //       this.saveAppointmentsToStorage();
  //     }),
  //     map(() => `Appointment updated successfully.`)
  //   );
  // }
  updateAppointment(updatedAppointment: IAppointment): Observable<string> {
    return this.appointments$.pipe(
      take(1),
      map((appointments) => {
        const index = appointments.findIndex(
          (appointment) => appointment.id === updatedAppointment.id
        );
        if (index !== -1) {
          const updatedAppointments = [...appointments];
          updatedAppointments[index] = updatedAppointment;
          this.appointments$.next(updatedAppointments);
          return `Appointment updated successfully.`;
        }
        throw new Error(
          `Appointment with id ${updatedAppointment.id} not found.`
        );
      }),
      tap(() => {
        this.saveAppointmentsToStorage();
      })
    );
  }

  deleteAppointment(id: string): Observable<string> {
    return this.appointments$.pipe(
      take(1),
      map((appointments) => {
        const index = appointments.findIndex(
          (appointment) => appointment.id === id
        );
        if (index === -1) {
          throw new Error(`Appointment with id ${id} not found.`);
        }
        const updatedAppointments = appointments.filter(
          (appointment) => appointment.id !== id
        );
        return updatedAppointments;
      }),
      tap((updatedAppointments) => {
        this.appointments$.next(updatedAppointments);
        this.saveAppointmentsToStorage();
      }),
      map(() => `Appointment deleted successfully.`)
    );
  }

  updateSelectedDay(selectedDate: Date) {
    const startOfDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate() + 1
    );
    endOfDay.setHours(0, 0, 0, 0);

    this.appointments$
      .pipe(
        map((appointments) =>
          this.times.map((time) => {
            const appointment = appointments.find(
              (e) =>
                new Date(e.date) >= startOfDay &&
                new Date(e.date) < endOfDay &&
                e.startTime === time
            );
            return { time, appointment };
          })
        ),
        tap((appointments) => {
          this.timeSlots$.next(appointments);
        })
      )
      .subscribe();
  }
}
