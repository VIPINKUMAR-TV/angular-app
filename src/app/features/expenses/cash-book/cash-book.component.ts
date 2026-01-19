import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Day } from '../../../shared/models/day';

import { CategoryService } from '../../../core/services/category.service';
import { DayService } from '../../../core/services/day.service';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddNewDayComponent } from '../add-new-day/add-new-day.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ResolveStart } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from '../../../shared/models/category';

@Component({
  selector: 'app-cash-book',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    ConfirmDialogComponent,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './cash-book.component.html',
  styleUrl: './cash-book.component.css'
})
export class CashBookComponent implements OnInit {
  cashBookForm: FormGroup;
  days: any[] = [];


  // Master categories (static or fetched from API)
  categories: Category[] = [];

  constructor(private fb: FormBuilder, private dialog: MatDialog,
    private dayService: DayService,
    private categoryService: CategoryService,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar
    ) {
    this.cashBookForm = this.fb.group({
      days: this.fb.array([])
    });
  }
  ngOnInit(): void {
    //this.loadDays();
    this.loadCategories();

    // Fetch
    // Load previously saved days
    console.log('fetching dayService--getAllDays');

    this.dayService.getAllDays().subscribe(days => {
      this.daysArray.clear();
      //days.forEach(day => console.log('4 calls loadDay', day));
      days.forEach(day => this.loadDay(day));
    });
  }
  //========
  loadDays(): void {
    this.dayService.getAllDays().subscribe({
      next: (res) => (
        this.days = res),
      error: (err) => console.error('Error loading days', err)
    });
  }
    //load days from db
  loadDay(day: Day) {
    // this.categories=day.categories
    console.log('day=',day);
    const dayForm = this.fb.group({
      day_id: day.dayId,
      day_date: day.date,
      categories: this.fb.array(
        day.categories.map(cat =>
          this.fb.group({
            cat_id: cat.catId,
            cat_name: cat.catName,
            amounts: this.fb.array(
              cat.amounts.map(a => new FormControl(a)) // load saved amounts into form
              //console.log(amounts);
            )
          })
        )
      )
    });

    // Insert day into correct sorted position
  this.insertDaySorted(dayForm);
    //this.daysArray.push(dayForm); append day
   // this.daysArray.insert(0, dayForm);//prepend day
    this.cd.detectChanges();
  }

  insertDaySorted(dayForm: FormGroup) {
  const newDate = new Date(dayForm.get('day_date')?.value).getTime();

  // Find correct index
  let insertIndex = 0;

  for (let i = 0; i < this.daysArray.length; i++) {
    const existingDate = new Date(
      this.daysArray.at(i).get('day_date')?.value
    ).getTime();

    // If new date is older, move down
    if (existingDate > newDate) {
      insertIndex = i + 1;
    } else {
      break;
    }
  }

  this.daysArray.insert(insertIndex, dayForm);
}

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => (

        console.log('categories===', res),
        this.categories = res

      ),
      error: (err) => console.error('Error loading categories', err)
    });
  }


  addCategoryToDay(dayId: number, catId: number): void {
    this.dayService.addCategoryToDay(dayId, catId).subscribe({
      next: (updatedDay) => {
        console.log('Category linked successfully=', updatedDay);
       // this.loadDay(day); // reload updated data
       // Find the category object returned from backend
      const newCategory = updatedDay.categories.find(c => c.catId === catId);
      this.appendCategoryToForm(dayId, newCategory);
      this.cd.detectChanges();

      },
      error: (err) => console.error('Error linking category:', err)
    });
  }

  private appendCategoryToForm(dayId: number, newCat: any) {
  const dayForm = this.daysArray.controls.find(
    d => d.get('day_id')?.value === dayId
  ) as FormGroup;

  if (!dayForm) return;

  const categories = dayForm.get('categories') as FormArray;

  categories.push(
    this.fb.group({
      cat_id: newCat.catId,
      cat_name: newCat.catName,
      amounts: this.fb.array([])
    })
  );
}
  //==========

  // Days FormArray
  get daysArray(): FormArray<FormGroup> {
    return this.cashBookForm.get('days') as FormArray<FormGroup>;
  }

  // Get all categories for a given day by its DB ID
  getCategoriesByDayId(dayId: number): FormArray<FormGroup> {
    const dayForm = this.daysArray.controls.find(d => d.get('day_id')?.value === dayId) as FormGroup;
    return dayForm?.get('categories') as FormArray<FormGroup>;
  }

  // Get all inputs for a given category under a specific day (by DB IDs)
  getInputsById(dayId: number, catId: number): FormArray<FormControl> {
    const categories = this.getCategoriesByDayId(dayId);
    const categoryForm = categories.controls.find(c => c.get('cat_id')?.value === catId) as FormGroup;
    return categoryForm?.get('amounts') as FormArray<FormControl>;
  }
  getCategoryName(catId: number): string {
    const cat = this.categories.find(c => c.catId === catId);
    return cat ? cat.catName : 'Unknown';
  }
  getCategoryTotalById(dayId: number, catId: number): number {
    const inputs = this.getInputsById(dayId, catId);
    return inputs?.value.reduce((sum: number, val: number) => sum + (Number(val) || 0), 0);
  }
  getDayTotalById(dayId: number): number {
    const categories = this.getCategoriesByDayId(dayId);
    return categories.controls.reduce((sum: number, cat) => {
      const catId = cat.get('cat_id')?.value;
      return sum + this.getCategoryTotalById(dayId, catId);
    }, 0);
  }
  // Grand total (all days)
  getGrandTotal(): number {
    return this.daysArray.controls.reduce((sum: number, day) => {
      const dayId = day.get('day_id')?.value;
      return sum + this.getDayTotalById(dayId);
    }, 0);
  }

  // ---------- CRUD ACTIONS ----------
  addInputById(dayId: number, catId: number) {
    const inputs = this.getInputsById(dayId, catId);
    inputs.push(new FormControl(0));
  }
  removeInputById(dayId: number, catId: number, inputIndex: number) {
    const inputs = this.getInputsById(dayId, catId);
    inputs.removeAt(inputIndex);
  }

  // removeDayById(dayId: number) {
  //   const index = this.daysArray.controls.findIndex(d => d.get('day_id')?.value === dayId);
  //   if (index >= 0) this.daysArray.removeAt(index);
  // }
  removeDayById(dayId: number) {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: "350px",
    data: { message: "Are you sure you want to delete this day?" }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === "yes") {
      this.deleteDay(dayId);
    }
  });
}

showUndoSnackbar(dayId: number) {
  let snack = this.snackbar.open("Day deleted", "UNDO", { duration: 5000 });

  snack.onAction().subscribe(() => {
    this.undoDelete(dayId);
  });
}

undoDelete(dayId: number) {
  this.dayService.undoDeleteDay(dayId).subscribe({
    next: (dayRecovered) => {
      console.log('recovered day=',dayRecovered);
      this.loadDay(dayRecovered); // OR insert only restored day
    },
    error: err => console.error("Undo failed", err)
  });
}
deleteDay(dayId: number) {
  this.dayService.softDeleteDay(dayId).subscribe({
    next: () => {
      // Remove from UI
      const index = this.daysArray.controls.findIndex(
        d => d.get('day_id')?.value === dayId
      );
      if (index >= 0) {
        this.daysArray.removeAt(index);
      }

      // Show undo snackbar
      this.showUndoSnackbar(dayId);
    },
    error: err => console.error("Delete failed", err)
  });
}
  
  //Add New Category
  addNewCategory() {
    console.log('trying to create a new category');
    //this.categoryService.createCategory().
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh category list after adding
        this.categoryService.getAllCategories().subscribe((data) => {
          console.log('Updated categories', data);
          // update categories in your form here
          this.categories = data;
        });
      }
    });

  }
  
  //add new Day
  openAddDayDialog(): void {
    const dialogRef = this.dialog.open(AddNewDayComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((newDay) => {
      if (newDay) {
         this.loadDay(newDay);
        this.cd.detectChanges();
      }
    });
  }
  getCategoriesById(dayId: number) {
  const day = this.daysArray.controls.find(d => d.get('day_id')?.value === dayId);
  if (!day) return [];
  return (day.get('categories') as FormArray).controls;
}
  // Get Categories of a Day
  getCategories(dayIndex: number): FormArray<FormGroup> {
    //console.log('dayIndex==='+dayIndex);
    return this.daysArray.at(dayIndex).get('categories') as FormArray<FormGroup>;
  }

  // Get Inputs for Category
  getInputs(dayIndex: number, catIndex: number): FormArray<FormControl> {
    return this.getCategories(dayIndex).at(catIndex).get('amounts') as FormArray<FormControl>;
  }

  // Add Input (amount)
  addInput(dayIndex: number, catIndex: number) {
    this.getInputs(dayIndex, catIndex).push(new FormControl(0));
  }

  // Remove Input
  removeInput(dayIndex: number, catIndex: number, inputIndex: number) {
    this.getInputs(dayIndex, catIndex).removeAt(inputIndex);
  }

  // Category total
  getCategoryTotal(dayIndex: number, catIndex: number): number {
    return this.getInputs(dayIndex, catIndex).value.reduce(
      (a: number, b: number) => a + Number(b || 0),
      0
    );
  }

  // Day total
  getDayTotal(dayIndex: number): number {
    return this.getCategories(dayIndex).controls
      .map((_, catIndex) => this.getCategoryTotal(dayIndex, catIndex))
      .reduce((a, b) => a + b, 0);
  }

  updateAmount(dayId: number, catId: number, inputIndex: number) {
    const amount = this.getInputsById(dayId, catId).at(inputIndex).value;

    if (amount === null || amount === '' || isNaN(amount)) {
      console.warn('Skipping empty or invalid amount');
      return;
    }

    this.dayService.updateAmount(dayId, catId, amount).subscribe(
      res => console.log('✅ Updated amount in DB:', res),
      err => console.error('❌ Error updating amount', err)
    );
  }

}