import { Component, computed, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy{
 isLoggedIn = computed(() => this.authService.isLoggedIn());
  user1 = computed(() => this.authService.currentUser());
   user: any;
  private sub!: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    console.log('constructor called--Header Component');
  }
  ngOnInit(): void {
    console.log('ngOnInit() called--Header Component');
    // 👇 Reactively listen to user changes
    this.sub = this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
   ngOnDestroy(): void {
    console.log('ngOnDestroy() called--Header Component');
    this.sub.unsubscribe();
  }
}
