import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { DayService } from '../../../core/services/day.service';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-add-new-day',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule
  ],
  templateUrl: './add-new-day.component.html',
  styleUrl: './add-new-day.component.css'
})
export class AddNewDayComponent implements OnInit{
addDayForm!: FormGroup;
  userId!: number;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddNewDayComponent>,
    private dayService: DayService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.auth.currentUser();
    this.userId = currentUser?.userId ?? 0;

    this.addDayForm = this.fb.group({
      date: ['', Validators.required],
      userId: [{ value: this.userId, disabled: true }]
    });
  }
  save(): void {
    if (this.addDayForm.invalid) return;

     const rawDate = this.addDayForm.get('date')!.value;

  // Ensure it's a Date object
  const d = rawDate instanceof Date ? rawDate : new Date(rawDate);

    // normalize to yyyy-MM-dd in local time (no timezone)
  const day_date = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

    const payload = {
      date: day_date,
      userId: this.userId,
      categories: []
    };

    this.dayService.createDay(payload).subscribe({
      next: (newDay) => {
        console.log('✅ Day added successfully',payload);
        this.dialogRef.close(newDay);
      },
      error: (err) => {
        console.error('❌ Error adding day', err);
        alert('Error adding day. Please try again.');
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
