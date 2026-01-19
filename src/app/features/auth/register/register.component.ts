import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card'; // ✅ Add this import
import { MatInputModule } from '@angular/material/input'; // optional, if using matInput
import { MatButtonModule } from '@angular/material/button'; // optional, if using mat-button
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, 
    FormsModule,
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
   username = '';
  email = '';
  password = '';
  message = '';
 registerForm!: FormGroup;
  hidePassword = signal(true);
  hideConfirm = signal(true);
  constructor(private fb: FormBuilder,private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      agree: [false, Validators.requiredTrue]
    }, { validators: this.passwordsMatch });
  }

  private passwordsMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit() {

   
  }
  register(): void {
      if (this.registerForm.invalid) return;

    const { name, email, password } = this.registerForm.value;
    const payload = { username: name, email, password };

    console.log('📤 Sending payload:', payload);

    this.auth.register(payload).subscribe({
      next: () => {
        alert('✅ Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('❌ Registration failed:', err);
        alert('Registration failed. Try again.');
      }
    });
  
    // console.log('inside register method');
    // const payload = {
    //   username: this.username,
    //   email: this.email,
    //   password: this.password
    // };
    // console.log('payload check=',payload);
    //  if (this.registerForm.valid) {
    //   console.log('✅ Registration Data:', this.registerForm.value);
    //   this.auth.register(payload).subscribe({
    //   next: () => {
    //     this.message = '✅ Registration successful!llllll';
    //     setTimeout(() => this.router.navigate(['/login']), 1500);
    //   },
    //   error: (err) => {
    //     console.error('Registration failed', err);
    //     this.message = '❌ Registration failed. Try again.';
    //   }
    // });
    
    //   alert('Registration Successful!....');
    // } else {
    //   this.registerForm.markAllAsTouched();
    // } 
  }
}
