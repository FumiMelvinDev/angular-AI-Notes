import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthResponse, createClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  currentUser = signal<{ id: string; email: string; name: string } | null>(null);

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    const promise = this.supabase.auth
      .signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })
      .then(async (res) => {
        if (res.error || !res.data.user) {
          return res;
        }

        const { error: insertError } = await this.supabase.from('User').insert({
          id: res.data.user.id,
          name,
          email,
        });

        if (insertError) {
          console.error('Failed to insert User to database:', insertError.message);
        }

        return res;
      });
    return from(promise);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const promise = this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    return from(promise);
  }

  setSession(session: any) {
    if (session) {
      localStorage.setItem('supabaseSession', JSON.stringify(session));
    } else {
      localStorage.removeItem('supabaseSession');
    }
  }

  logout(): void {
    this.supabase.auth.signOut();
    this.setSession(null);
    this.currentUser.set(null);
  }
}
