import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, BehaviorSubject, startWith } from 'rxjs';
import { Appointment, TimeSlot } from 'src/app/models/appointment.model';
import { AppointmentService } from 'src/app/services/appointment.service';
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
  appointmentInTime$: Observable<TimeSlot[]> = new BehaviorSubject<TimeSlot[]>(
    []
  );
  constructor(
    private dialog: MatDialog,
    private appointmentService: AppointmentService
  ) {
    this.selectedDateChanges$.subscribe(() => this.updateCalendar());
    this.appointmentInTime$ =
      this.appointmentService.getAppointmentsForSelectedDay();
  }

  ngOnInit(): void {
    this.updateCalendar();
  }

  updateCalendar() {
    this.times = this.appointmentService.getTimes();
    const selectedDateValue = this.selectedDate.value || new Date();
    this.appointmentService.updateSelectedDay(selectedDateValue);
  }

  addAppointment(time?: TimeSlot) {
    const dialogRef = this.dialog.open(AddAppointmentDialogComponent, {
      width: '500px',
      data: {
        times: this.times,
        startTime: time?.time ?? '',
        endTime: time ? this.times[this.times.indexOf(time.time) + 1] : '',
        date: this.selectedDate,
      },
    });

    dialogRef.afterClosed().subscribe((result: Appointment) => {
      if (result) {
        console.log(result);
        this.appointmentService.addAppointment(result);
        this.updateCalendar();
      }
    });
  }

  openDeleteConfirmationDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this appointment?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.deleteAppointment(id);
      }
    });
  }

  deleteAppointment(id: string) {
    this.appointmentService.deleteAppointment(id);
    this.updateCalendar();
  }

  moveTimeAppointment(appointment: CdkDragDrop<TimeSlot[]>) {
    const prevIndex = appointment.previousIndex;
    const newIndex = appointment.currentIndex;
    if (prevIndex !== newIndex) {
      const eventsForNewDate = this.appointmentService.getAppointmentsValue();
      const appointment = eventsForNewDate.find(
        (appointment) => appointment.startTime == this.times[prevIndex]
      );

      const eventPrevEndT = this.times.indexOf(appointment?.endTime ?? '');
      if (appointment) {
        this.appointmentService.updateAppointment({
          id: appointment.id,
          title: appointment.title,
          date: appointment.date,
          startTime: this.times[newIndex],
          endTime: this.times[newIndex + (eventPrevEndT - prevIndex)],
          description: appointment.description,
        });
        this.updateCalendar();
      }
    }
  }
}
