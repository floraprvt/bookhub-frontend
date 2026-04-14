import { Component, signal, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/services/auth';
import { Router } from '@angular/router';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface BorrowedBook {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  dueDate: Date;
  isOverdue: boolean;
  daysRemaining?: number;
}

export interface ReservedBook {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  currentRank: number;
  totalRank: number;
}

export interface HistoryBook {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  returnedDate: Date;
  rating: number;
}

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})

export class Profil implements OnInit {
  private authService = inject(AuthService);

  user = signal<UserProfile>({
    firstName: '', lastName: '', email: ''
  });

  borrows = signal<BorrowedBook[]>([]);
  reservations = signal<ReservedBook[]>([]);
  history = signal<HistoryBook[]>([]);

  starsArray = [1, 2, 3, 4, 5];

  ngOnInit() {
    this.loadUserData();
    this.loadMockBooks();
  }

  loadUserData() {
    const loggedInUser = this.authService.currentUser();

    if (loggedInUser) {
      this.user.set({
        firstName: loggedInUser.firstName || '',
        lastName: loggedInUser.lastName || '',
        email: loggedInUser.email || ''
      });
    }
  }

  loadMockBooks() {
    this.borrows.set([
      { id: 1, title: "La Nuit des Temps", author: "René Barjavel", coverUrl: "assets/livre.webp", dueDate: new Date('2025-03-03'), isOverdue: true },
      { id: 2, title: "Dune", author: "Frank Herbert", coverUrl: "assets/livre.webp", dueDate: new Date(new Date().setDate(new Date().getDate() + 5)), isOverdue: false, daysRemaining: 5 }
    ]);

    this.reservations.set([
      { id: 1, title: "Fondation", author: "Isaac Asimov", coverUrl: "assets/livre.webp", currentRank: 4, totalRank: 5 }
    ]);

    this.history.set([
      { id: 1, title: "1984", author: "George Orwell", coverUrl: "assets/livre.webp", returnedDate: new Date('2023-11-16'), rating: 4 },
      { id: 2, title: "Le Seigneur des Anneaux", author: "J.R.R. Tolkien", coverUrl: "assets/livre.webp", returnedDate: new Date('2022-05-10'), rating: 5 }
    ]);
  }

  updateProfile() {
    const currentUserInfo = this.authService.currentUser();

    if (currentUserInfo) {
      const updatedUser = {
        ...currentUserInfo,
        ...this.user()
      };

      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    }

    alert("Vos informations ont été mises à jour !");
  }

  deleteAccount() {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
    if (confirmDelete) {
      this.authService.logout();
    }
  }

  cancelReservation(id: number) {
    this.reservations.update(res => res.filter(r => r.id !== id));
  }

  rateBook(id: number, rating: number) {
    this.history.update(hist =>
      hist.map(book => book.id === id ? { ...book, rating } : book)
    );
  }

 private readonly router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}