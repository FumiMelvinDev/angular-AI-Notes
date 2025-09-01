import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    const rawForm = this.registerForm.getRawValue();
    if (rawForm.password !== rawForm.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    this.authService.register(rawForm.name, rawForm.email, rawForm.password).subscribe((result) => {
      if (result.error) {
        console.error('Registration error:', result.error);
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }
}
