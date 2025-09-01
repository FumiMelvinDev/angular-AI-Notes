import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('notes-app');

  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {
    this.authService.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in');
        this.authService.currentUser.set({
          email: session?.user.email!,
          name: session?.user.user_metadata['name'],
        });
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        this.router.navigate(['/login']);
      }
      console.log('!!', event, session);
    });
  }
}
