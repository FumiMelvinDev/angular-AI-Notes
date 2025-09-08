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
    // Restore session from localStorage if available
    const savedSession = localStorage.getItem('supabaseSession');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      if (session?.user) {
        this.authService.currentUser.set({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata['name'],
        });
      }
    } else {
      this.router.navigate(['/login']);
    }

    this.authService.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in');
        this.authService.currentUser.set({
          id: session?.user.id!,
          email: session?.user.email!,
          name: session?.user.user_metadata['name'],
        });
        this.authService.setSession(session);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        this.authService.setSession(null);
        this.router.navigate(['/login']);
      }
      console.log('!!', event, session);
    });
  }
}
