import { Component, computed, OnDestroy, OnInit } from '@angular/core';
import { DashboardComponent } from '../../expenses/dashboard/dashboard.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoginComponent } from '../../auth/login/login.component';
import { RegisterComponent } from '../../auth/register/register.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,DashboardComponent,LoginComponent,RegisterComponent,RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{
//curr_user = computed(() => this.authService.currentUser());
user: any;
  private sub!: Subscription;

constructor(private authService: AuthService, private router: Router) {
  console.log('constructor called--home component');
}
ngOnInit(): void {
  console.log('ngOnInit called--home component');
    this.sub = this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }
   ngOnDestroy(): void {
    console.log('ngOnDestroy called--home component');
    this.sub.unsubscribe();
  }
}
