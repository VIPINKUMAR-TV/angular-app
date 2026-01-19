import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
categoryForm: FormGroup;
  

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCategoryComponent>,
    private categoryService: CategoryService,
    private auth: AuthService
  ) {
    this.categoryForm = this.fb.group({
    cat_name: ['', [Validators.required, Validators.minLength(2)]],
    cat_status: ['Active', Validators.required],
    userId: [{ value: '', disabled: true }]
  });

    const user = this.auth.currentUser();
    if (user) {
      this.categoryForm.patchValue({ userId: user.userId.toString() });
    }
  }

  save() {
    if (this.categoryForm.invalid) return;
    console.log('trying to save new category--save()');

    const payload = {
      catName: this.categoryForm.get('cat_name')?.value,
      catStatus: this.categoryForm.get('cat_status')?.value,
      userId: this.auth.currentUser()?.userId
    };
    console.log('payload',payload);

    this.categoryService.createCategory(payload).subscribe({
      next: () => {
        alert('Category added successfully!');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        alert('Error adding category');
      }
    });
  }
  cancel() {
    this.dialogRef.close(false);
  }
}
