import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [NgIf],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(Auth);

  logout(): void {
    this.authService.logout();
  }
}
