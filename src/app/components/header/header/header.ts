import { Component, inject, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  title: InputSignal<string> = input('Header');

  private readonly authService = inject(AuthService);

  isLoggedIn = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;
  isLibrarian = this.authService.isLibrarian;
  isAdmin = this.authService.isAdmin;
}
