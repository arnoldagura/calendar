import { NgModule } from '@angular/core';
import { TimeComponent } from './time.component';

import { TimeRoutingModule } from './time-routing.module';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../services/appointment.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [TimeComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatSnackBarModule,
    DragDropModule,
    TimeRoutingModule,
  ],
  providers: [AppointmentService],
})
export class TimeModule {}
