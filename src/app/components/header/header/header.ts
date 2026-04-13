import { Component, inject, input, InputSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // Utilisation d'un InputSignal pour recevoir le titre depuis le composant parent
  title: InputSignal<string> = input('Header');

  // Injection de services
  private readonly authService = inject(AuthService);

  // Utilisation des signals
  isLoggedIn = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;

}
