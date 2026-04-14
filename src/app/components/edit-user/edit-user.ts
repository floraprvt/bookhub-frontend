import { Component, signal, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { User } from '../../interface';

const API_URL = 'http://localhost:8080';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.html'
})
export class EditUser implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  user = signal<User | null>(null);
  selectedRole = '';
  availableRoles = ['USER', 'LIBRARIAN', 'ADMIN'];
  errorMessage = '';

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.http.get<User>(`${API_URL}/api/users/${userId}`).subscribe({
        next: (user) => {
          this.user.set(user);
          this.selectedRole = user.role as string;
        }
      });
    }
  }

  saveChanges() {
    const user = this.user();
    if (!user) return;

    this.http.put(`${API_URL}/api/users/${user.id}/role`, { role: this.selectedRole }).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: (err) => this.errorMessage = err.error?.message ?? 'Une erreur est survenue.'
    });
  }

  cancel() {
    this.router.navigate(['/admin']);
  }
}
