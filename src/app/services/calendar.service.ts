import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {
  CalendarDayEvents,
  CalendarEvent,
} from '../models/calendar-event.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private events: BehaviorSubject<CalendarEvent[]> = new BehaviorSubject<
    CalendarEvent[]
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

  private readonly eventsStorageKey = 'calendar-events';

  constructor() {
    this.loadEventsFromStorage();
  }

  private loadEventsFromStorage() {
    const storedEvents = localStorage.getItem(this.eventsStorageKey);
    if (storedEvents) {
      this.events.next(JSON.parse(storedEvents));
    } else {
      this.events.next([]);
    }
  }

  private saveEventsToStorage() {
    localStorage.setItem(
      this.eventsStorageKey,
      JSON.stringify(this.events.getValue())
    );
  }

  getEventsValue(): CalendarEvent[] {
    return this.events.getValue();
  }

  getEvents(): Observable<CalendarEvent[]> {
    return this.events.asObservable();
  }

  getTimes(): string[] {
    return this.times;
  }

  getEventsForDate(date: Date): Observable<CalendarEvent[]> {
    return this.events
      .asObservable()
      .pipe(
        map((events) =>
          events.filter((event) => event.date.getTime() === date.getTime())
        )
      );
  }

  addEvent(event: CalendarEvent): void {
    const currentEvents = this.events.getValue();
    this.events.next([...currentEvents, event]);
    this.saveEventsToStorage();
  }

  updateEvent(updatedEvent: CalendarEvent): void {
    const currentEvents = this.events.getValue();
    const index = currentEvents.findIndex(
      (event) =>
        event.title === updatedEvent.title && event.date === updatedEvent.date
    );
    if (index !== -1) {
      currentEvents[index] = updatedEvent;
      this.events.next([...currentEvents]);
      this.saveEventsToStorage();
    }
  }

  deleteEvent(event: CalendarEvent): void {
    const currentEvents = this.events.getValue();
    const index = currentEvents.findIndex((e) => e === event);
    if (index !== -1) {
      currentEvents.splice(index, 1);
      this.events.next([...currentEvents]);
      this.saveEventsToStorage();
    }
  }

  moveEvent(event: CalendarEvent, newStartDate: Date) {
    const currentEvents = this.events.getValue();
    const index = currentEvents.findIndex((e) => e === event);
    if (index < 0) {
      return;
    }

    const updatedEvent: CalendarEvent = {
      ...event,
      date: newStartDate,
    };

    currentEvents[index] = updatedEvent;
    this.events.next([...currentEvents]);
    this.saveEventsToStorage();

    return updatedEvent;
  }

  getEventsForDay(month: Date): Observable<CalendarDayEvents[]> {
    month.setHours(0, 0, 0, 0);
    return this.events.asObservable().pipe(
      map((events) =>
        this.times.map((time) => {
          const event = events.find(
            (e) =>
              new Date(e.date) >= month &&
              new Date(e.date) <= month &&
              e.startTime === time
          );
          return { time, event };
        })
      )
    );
  }
}
