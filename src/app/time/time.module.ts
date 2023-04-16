import { NgModule } from '@angular/core';
import { TimeComponent } from './time.component';

import { AddAppointmentDialogComponent } from '../components/add-appointment-dialog/add-appointment-dialog.component';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TimeRoutingModule } from './time-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    TimeComponent,
    AddAppointmentDialogComponent,
    ConfirmationDialogComponent,
  ],
  imports: [CommonModule, SharedModule, TimeRoutingModule],
})
export class TimeModule {}
