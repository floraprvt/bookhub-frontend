import { Component, inject } from '@angular/core';

import { DatePipe } from '@angular/common';
import { AuthService } from '../../app/services/auth';

@Component({
  selector: 'app-profil',
  imports: [DatePipe],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {
  private readonly authService = inject(AuthService);

  // Utilisation des signals
  currentUser = this.authService.currentUser;
  today = new Date();
}
