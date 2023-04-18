import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, BehaviorSubject, startWith } from 'rxjs';
import { IAppointment, ITimeSlot } from 'src/app/models/appointment.model';
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
  appointmentInTime$: Observable<ITimeSlot[]> = new BehaviorSubject<
    ITimeSlot[]
  >([]);
  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private appointmentService: AppointmentService
  ) {
    this.selectedDateChanges$.subscribe(() => this.updateCalendar());
  }

  ngOnInit(): void {
    this.appointmentInTime$ =
      this.appointmentService.getAppointmentsForSelectedDay();
    this.updateCalendar();
  }

  updateCalendar() {
    this.times = this.appointmentService.getTimes();
    const selectedDateValue = this.selectedDate.value || new Date();
    this.appointmentService.updateSelectedDay(selectedDateValue);
  }

  addAppointment(time?: ITimeSlot) {
    const dialogRef = this.dialog.open(AddAppointmentDialogComponent, {
      width: '500px',
      data: {
        times: this.times,
        startTime: time?.time ?? '',
        endTime: time ? this.times[this.times.indexOf(time.time) + 1] : '',
        date: this.selectedDate.value,
      },
    });

    dialogRef.afterClosed().subscribe((result: IAppointment) => {
      if (result) {
        this.appointmentService.addAppointment(result).subscribe((ev) =>
          this._snackBar.open(ev, 'close', {
            duration: 3000,
          })
        );
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
    this.appointmentService.deleteAppointment(id).subscribe((ev) =>
      this._snackBar.open(ev, 'close', {
        duration: 3000,
      })
    );
    this.updateCalendar();
  }

  moveTimeAppointment(appointment: CdkDragDrop<ITimeSlot[]>) {
    const prevIndex = appointment.previousIndex;
    const newIndex = appointment.currentIndex;
    if (prevIndex !== newIndex) {
      const eventsForNewDate = this.appointmentService.getAppointmentsValue();
      const appointment = eventsForNewDate.find(
        (appointment) => appointment.startTime == this.times[prevIndex]
      );

      const eventPrevEndT = this.times.indexOf(appointment?.endTime ?? '');
      if (appointment) {
        this.appointmentService
          .updateAppointment({
            id: appointment.id,
            title: appointment.title,
            date: appointment.date,
            startTime: this.times[newIndex],
            endTime: this.times[newIndex + (eventPrevEndT - prevIndex)],
            description: appointment.description,
          })
          .subscribe((ev) => {
            this._snackBar.open(ev, 'close', {
              duration: 3000,
            });
            this.updateCalendar();
            this.appointmentInTime$ =
              this.appointmentService.getAppointmentsForSelectedDay();
          });
      }
    }
  }
}
