import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/services/auth';


@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user = { email: '', password: '' };
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  onSubmit(loginForm: any) {
    if (!loginForm.valid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.user.email, this.user.password).subscribe({
      next: () => {
        this.router.navigate(['/profil']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMessage.set('Email ou mot de passe incorrect');
        } else if (err.error && typeof err.error === 'object') {
          const messages = Object.values(err.error).join(' | ');
          this.errorMessage.set(messages);
        } else {
          this.errorMessage.set('Une erreur est survenue, réessayez plus tard');
        }
      }
    });
  }
}
