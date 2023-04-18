import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-add-appointment-dialog',
  templateUrl: './add-appointment-dialog.component.html',
  styleUrls: ['./add-appointment-dialog.component.css'],
})
export class AddAppointmentDialogComponent implements OnInit {
  appointmentForm!: FormGroup;
  times: string[] = [];
  errorMessages = {
    required: 'This field is required.',
    startEnd: 'End time must be after start time.',
    submit: 'Submit',
    cancel: 'Cancel',
  };

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddAppointmentDialogComponent>,
    private appointmentService: AppointmentService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      startTime: string;
      endTime: string;
      times: string[];
      date: Date;
    }
  ) {
    this.times = data.times;
  }

  ngOnInit() {
    this.appointmentForm = this.formBuilder.group({
      title: ['', Validators.required],
      date: [this.data.date || null, Validators.required],
      startTime: [this.data.startTime || '', Validators.required],
      endTime: [this.data.endTime || '', [Validators.required]],
      description: [''],
    });

    // if (this.data.appointmentId) {
    //   const appointment = this.appointmentService.getAppointmentById(
    //     this.data.appointmentId
    //   );
    //   this.appointmentForm.patchValue({
    //     title: appointment.title,
    //     date: appointment.date,
    //     startTime: appointment.startTime,
    //     endTime: appointment.endTime,
    //     description: appointment.description,
    //   });
    // }

    this.appointmentForm.get('endTime')?.addValidators((control) => {
      const startTime = new Date(`01/01/2021 ${this.startTimeControl.value}`);
      const endTime = new Date(`01/01/2021 ${control.value}`);
      if (endTime <= startTime) {
        return { startEnd: true };
      }

      return null;
    });
  }

  get titleControl(): FormControl {
    return this.appointmentForm.get('title') as FormControl;
  }

  get dateControl(): FormControl {
    return this.appointmentForm.get('date') as FormControl;
  }

  get startTimeControl(): FormControl {
    return this.appointmentForm.get('startTime') as FormControl;
  }

  get endTimeControl(): FormControl {
    return this.appointmentForm.get('endTime') as FormControl;
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      this.dialogRef.close(this.appointmentForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
