import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface UserCatalog {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
})
export class AdminDashboard implements OnInit {
  users = signal<UserCatalog[]>([])
  searchQuery = signal<string>('')
  librarianName = signal<string>('Ahmed')
  private router = inject(Router);

  ngOnInit() {
    this.users.set([
      { id: '1', firstName: 'Romain', lastName: 'Montassier', email: 'romain.m@eni.fr', phone:'0669696969', role: 'user' },
      { id: '2', firstName: 'Valentin', lastName: 'CHAMBOREDON', email: 'valentin.c@eni.fr', phone:'0669696969', role: 'libraire' },
      { id: '3', firstName: 'Flora', lastName: 'PREUVOT', email: 'flora.p@eni.fr', phone:'0669696969', role: 'libraire' },
    ])
  }

  editUser(id: string) {
    this.router.navigate(['/admin/edit-user', id])
  }
}
