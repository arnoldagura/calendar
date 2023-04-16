import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, BehaviorSubject, startWith } from 'rxjs';
import {
  CalendarDayEvents,
  CalendarEvent,
} from 'src/app/models/calendar-event.model';
import { CalendarService } from 'src/app/services/calendar.service';
import { AddAppointmentDialogComponent } from '../components/add-appointment-dialog/add-appointment-dialog.component';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-times',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css'],
})
export class TimeComponent {
  times: string[] = [];
  times$: string[] = [];
  selectedDate = new FormControl(new Date());
  selectedDateChanges$ = this.selectedDate.valueChanges.pipe(
    startWith(this.selectedDate.value)
  );
  eventsInTime$: Observable<CalendarDayEvents[]> = new BehaviorSubject<
    CalendarDayEvents[]
  >([]);
  constructor(
    private dialog: MatDialog,
    private calendarService: CalendarService
  ) {
    this.selectedDateChanges$.subscribe(() => this.updateCalendar());
  }

  ngOnInit(): void {
    this.updateCalendar();
  }

  updateCalendar() {
    this.times = this.calendarService.getTimes();
    const selectedDateValue = this.selectedDate.value || new Date();
    this.eventsInTime$ =
      this.calendarService.getEventsForDay(selectedDateValue);
  }

  addEvent(time?: CalendarDayEvents) {
    const dialogRef = this.dialog.open(AddAppointmentDialogComponent, {
      width: '500px',
      data: {
        times: this.times,
        startTime: time?.time ?? '',
        endTime: time ? this.times[this.times.indexOf(time.time) + 1] : '',
        date: this.selectedDate,
      },
    });

    dialogRef.afterClosed().subscribe((result: CalendarEvent) => {
      if (result) {
        this.calendarService.addEvent(result);
        this.updateCalendar();
      }
    });
  }

  openDeleteConfirmationDialog(event: CalendarEvent) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this event?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.deleteEvent(event);
      }
    });
  }

  deleteEvent(event?: CalendarEvent) {
    if (event) {
      this.calendarService.deleteEvent(event);
      this.updateCalendar();
    }
  }

  moveTimeEvent(event: CdkDragDrop<CalendarDayEvents[]>) {
    const prevIndex = event.previousIndex;
    const newIndex = event.currentIndex;
    if (prevIndex !== newIndex) {
      const eventsForNewDate = this.calendarService.getEventsValue();
      const event = eventsForNewDate.find(
        (event) => event.startTime == this.times[prevIndex]
      );

      const eventPrevEndT = this.times.indexOf(event?.endTime ?? '');
      if (event) {
        this.calendarService.updateEvent({
          title: event.title,
          date: event.date,
          startTime: this.times[newIndex],
          endTime: this.times[newIndex + (eventPrevEndT - prevIndex)],
          description: event.description,
        });
        this.updateCalendar();
      }
    }
  }
}
