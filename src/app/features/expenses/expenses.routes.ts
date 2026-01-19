import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AddCategoryComponent } from './add-category/add-category.component';
import { ExpenseBookComponent } from './expense-book/expense-book.component';
import { CashBookComponent } from './cash-book/cash-book.component';
import { AddNewDayComponent } from './add-new-day/add-new-day.component';

export const EXPENSE_ROUTES: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'days/new', component: AddNewDayComponent },
  { path: 'categories/new', component: AddCategoryComponent },
  { path: 'expense-book', component: ExpenseBookComponent },
  { path: 'cash-book', component: CashBookComponent },
];