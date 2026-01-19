import { Component } from '@angular/core';
import { ExpenseBookComponent } from '../expense-book/expense-book.component';
import { CashBookComponent } from '../cash-book/cash-book.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
   standalone: true,
  imports: [RouterOutlet,ExpenseBookComponent,CashBookComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
