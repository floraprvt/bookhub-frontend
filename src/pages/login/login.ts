import { Component, inject } from '@angular/core';
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

  email ='';
  password ='';
  errorMessage='';
  isLoading=false;

  onSubmit(loginForm: any) {
   if(!loginForm.valid) return;

   this.isLoading = true;
   this.errorMessage='';

   this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/profil']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else {
          this.errorMessage = 'Une erreur est survenue, réessayez plus tard';
        }
      }
    });

  }
}
