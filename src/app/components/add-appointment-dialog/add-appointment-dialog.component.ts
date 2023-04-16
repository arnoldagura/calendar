import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-appointment-dialog',
  templateUrl: './add-appointment-dialog.component.html',
  styleUrls: ['./add-appointment-dialog.component.css'],
})
export class AddAppointmentDialogComponent implements OnInit {
  appointmentForm!: FormGroup;
  times: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
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
      date: [this.data.date || '', Validators.required],
      startTime: [this.data.startTime || '', Validators.required],
      endTime: [this.data.endTime || '', Validators.required],
      description: [''],
    });
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
