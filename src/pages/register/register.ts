import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../app/services/auth';
import { Registered } from '../../app/models/user';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
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
    phone: ''
  };

  onSubmit(registerForm: any) {
    if (registerForm.valid) {
      this.authService.register(this.user);
      console.log('Inscription réussie');
      this.router.navigate(['/login']);
    }
  }
}
