import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { CalendarDay } from '../models/calendar.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private selectedDate$: BehaviorSubject<Date> = new BehaviorSubject(
    new Date()
  );
  private currentMonth$: BehaviorSubject<Date> = new BehaviorSubject(
    new Date()
  );
  private appointments$: BehaviorSubject<Appointment[]> = new BehaviorSubject<
    Appointment[]
  >([]);
  private calendarDays$: BehaviorSubject<CalendarDay[]> = new BehaviorSubject<
    CalendarDay[]
  >([]);
  constructor() {
    this.initializeCalendarDays();
  }

  getSelectedDate(): Observable<Date> {
    return this.selectedDate$.asObservable();
  }

  setSelectedDate(selectedDate: Date): void {
    this.selectedDate$.next(selectedDate);
  }

  getCurrentMonth(): Observable<Date> {
    return this.currentMonth$.asObservable();
  }

  setCurrentMonth(currentMonth: Date): void {
    this.currentMonth$.next(currentMonth);
    this.initializeCalendarDays();
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointments$.asObservable();
  }

  setAppointments(appointments: Appointment[]): void {
    this.appointments$.next(appointments);
    this.initializeCalendarDays();
  }

  getCalendarDays(): Observable<CalendarDay[]> {
    return this.calendarDays$.asObservable();
  }

  private initializeCalendarDays(): void {
    const currentMonth = this.currentMonth$.value;
    const appointments = this.appointments$.value;
    const calendarDays: CalendarDay[] = [];

    // Calculate the number of days in the current month
    const numDaysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();

    // Calculate the starting day of the current month
    const startingDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();

    // Create a calendar day for each day in the current month
    for (let i = 1; i <= numDaysInMonth; i++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        i
      );
      const dayOfWeek = date.getDay();
      const isToday = date.toDateString() === new Date().toDateString();
      const isAppointment = appointments.some(
        (appointment) => appointment.date.toDateString() === date.toDateString()
      );

      //   calendarDays.push({
      //     date,
      //     dayOfWeek,
      //     isToday,
      //     isAppointment,
      //   });
    }

    // // Add blank days to the beginning of the calendar to align with the starting day of the month
    // for (let i = 0; i < startingDay; i++) {
    //   calendarDays.unshift({
    //     date: null,
    //     dayOfWeek: null,
    //     isToday: false,
    //     isAppointment: false,
    //   });
    // }

    this.calendarDays$.next(calendarDays);
  }
}
