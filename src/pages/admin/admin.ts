import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from '../../app/interface';

const API_URL = 'http://localhost:8080';

interface UsersResponse {
  content: User[];
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
})
export class AdminDashboard implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  users = signal<User[]>([]);

  private _searchQuery = signal('');
  get searchQuery() { return this._searchQuery(); }
  set searchQuery(v: string) { this._searchQuery.set(v); }

  filteredUsers = computed(() => {
    const q = this._searchQuery().toLowerCase().trim();
    if (!q) return this.users();
    return this.users().filter(u =>
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.http.get<UsersResponse>(`${API_URL}/api/users`).subscribe({
      next: (res) => this.users.set(res.content)
    });
  }

  editUser(id: string | number | undefined) {
    if (!id) return;

    this.router.navigate(['/admin/edit-user', id]);
  }
}
