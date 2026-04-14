import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleEnum, User } from '../../app/interface';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
})
export class AdminDashboard implements OnInit {
  users = signal<User[]>([])
  searchQuery = signal<string>('')
  librarianName = signal<string>('Ahmed')
  private router = inject(Router);

  ngOnInit() {
    this.users.set([
      { id: 1, firstName: 'Romain', lastName: 'Montassier', email: 'romain.m@eni.fr', phone:'0669696969', role: RoleEnum.USER },
      { id: 2, firstName: 'Valentin', lastName: 'CHAMBOREDON', email: 'valentin.c@eni.fr', phone:'0669696969', role: RoleEnum.LIBRARIAN },
      { id: 3, firstName: 'Flora', lastName: 'PREUVOT', email: 'flora.p@eni.fr', phone:'0669696969', role: RoleEnum.LIBRARIAN },
    ])
  }

  editUser(id: string | number) {
    this.router.navigate(['/admin/edit-user', id])
  }
}
