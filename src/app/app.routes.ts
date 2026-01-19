import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home/home.component';
import { DashboardComponent } from './features/expenses/dashboard/dashboard.component';
import { CashBookComponent } from './features/expenses/cash-book/cash-book.component';


import { MainComponent } from './core/layout/main/main.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { loginGuard } from './core/guards/guard/login.guard';
import { authGuard } from './core/guards/guard/auth.guard';



export const routes: Routes = [
    
    { path: '', component: MainComponent,
         children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },

      // AUTH
      { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [loginGuard] },

      // HOME
      { path: 'home', component: HomeComponent, canActivate: [authGuard] },

      // EXPENSES
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    ], 
    },
     { path: '**', redirectTo: '' },
];
