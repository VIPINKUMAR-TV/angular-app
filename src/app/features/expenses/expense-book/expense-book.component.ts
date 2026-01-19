import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayModel } from '../../../shared/models/day-model';
import { CategoryModel } from '../../../shared/models/category-model';


@Component({
  selector: 'app-expense-book',
  imports: [CommonModule],
  templateUrl: './expense-book.component.html',
  styleUrl: './expense-book.component.css'
})
export class ExpenseBookComponent {
  days: DayModel[] = [];
  year = 2025;
  month = 7; // August (0-based → Jan=0)

  constructor(){
    //this.generateDays(2025, 8);
    this.generateDaysWithCategories();
  }

  generateDaysWithCategories() {
    const totalDays = new Date(this.year, this.month + 1, 0).getDate();

    // Define base categories
    const baseCategories: CategoryModel[] = [
      { cat_id: 1, cat_name: 'Food', cat_status: 'Active' },
      { cat_id: 2, cat_name: 'Transport', cat_status: 'Active' },
      { cat_id: 3, cat_name: 'Bills', cat_status: 'Inactive' }
    ];

    // Build days with categories
    this.days = Array.from({ length: totalDays }, (_, i) => ({
      dayNumber: i + 1,
      categories: baseCategories.map(cat => ({
        ...cat,
        inputs: [],
        counter: 0
      }))
    }));
  }
  addInput(category: CategoryModel) {
    if (category.inputs && category.counter !== undefined) {
      category.counter++;
      category.inputs.push(category.counter);
    }
  }

  removeInput(category: CategoryModel, id: number) {
    if (category.inputs) {
      category.inputs = category.inputs.filter(inputId => inputId !== id);
    }
  }
  
}
