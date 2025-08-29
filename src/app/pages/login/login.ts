import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  authService = inject(Auth);
  router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  onSubmit(): void {
    const rawForm = this.loginForm.getRawValue();

    this.authService.login(rawForm.email, rawForm.password).subscribe((result) => {
      if (result.error) {
        console.error('Login error:', result.error);
      } else {
        this.router.navigateByUrl('/home');
      }
    });
  }
}
