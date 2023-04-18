import { NgModule } from '@angular/core';
import { TimeComponent } from './time.component';
import { AddAppointmentDialogComponent } from '../components/add-appointment-dialog/add-appointment-dialog.component';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog.component';
import { CalendarComponent } from '../components/calendar/calendar.component';

import { TimeRoutingModule } from './time-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    TimeComponent,
    CalendarComponent,
    AddAppointmentDialogComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    TimeRoutingModule,
  ],
  providers: [
    AppointmentService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class TimeModule {}
