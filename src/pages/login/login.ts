import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../app/models/user';
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

  user: User = {
    email: '',
    password: '',
  };

  onSubmit(loginForm: any) {
    if (loginForm.valid && this.user.email && this.user.password) {
      // Vérification des identifiants
      if (
        this.authService.validateCredentials(
          this.user.email,
          this.user.password
        )
      ) {
        this.authService.login(this.user.email, this.user.password);
        console.log('Connexion réussie');
        this.router.navigate(['/profil']);
      } else {
        console.error('Identifiants incorrects');
        // Ici vous pourriez afficher un message d'erreur
      }
    }
  }
}
