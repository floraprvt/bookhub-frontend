import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/services/auth';
import { Registered } from '../../app/models/user';
 
@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
 
  user: Registered = {
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    phone: '',
  };
 
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);
 
  onSubmit(registerForm: any) {
    if (registerForm.invalid) return;
 
    this.errorMessage.set(null);
    this.isLoading.set(true);
 
    this.authService.register(this.user).subscribe({
      next: () => {
        this.router.navigate(['/profil']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 409) {
          this.errorMessage.set('Un compte avec cet email existe déjà.');
        } else if (err.error && typeof err.error === 'object') {
          const messages = Object.values(err.error).join(' | ');
          this.errorMessage.set(messages);
        } else {
          this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
        }
      },
    });
  }
}