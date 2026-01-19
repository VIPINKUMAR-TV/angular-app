import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ 
    CommonModule,
    ReactiveFormsModule,
    FormsModule, 
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = signal(true);
  darkMode = signal(false);
  loginForm: any;

  //constructor(private fb: FormBuilder,private auth: AuthService, private router: Router) {}

  constructor(private fb: FormBuilder,private auth: AuthService, private router: Router) {
    // Theme toggle effect
    effect(() => {
      const dark = this.darkMode();
      document.body.classList.toggle('dark-theme', dark);
    });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

   // getter + setter for ngModel two-way binding
  get darkModeValue() {
    return this.darkMode();
  }
  set darkModeValue(value: boolean) {
    this.darkMode.set(value);
  }

  onSubmit() {
    const { email, password } = this.loginForm.value;
    const payload = {email, password };
    if (this.loginForm.valid) {
      console.log('✅ Login Data:', this.loginForm.value);
      
    this.auth.login(payload).subscribe({
      next:  (res: any) => {
        //alert('✅ Login successful!');
         this.auth.saveToken(res.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('❌ Registration failed:', err);
        alert('Login failed. Try again.');
      }
    });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

