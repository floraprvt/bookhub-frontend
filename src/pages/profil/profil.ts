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
  isUpdating = signal(false);
  updateSuccess = signal(false);
  updateError = signal<string | false>(false);

  showPasswordForm = signal(false);
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  isChangingPassword = signal(false);
  passwordSuccess = signal(false);
  passwordError = signal<string | false>(false);

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
        email: loggedInUser.email || '',
        phone: loggedInUser.phone || ''
      });
    }
  }

  loadMockBooks() {
    this.borrows.set([
      { id: 1, title: "La Nuit des Temps", author: "René Barjavel", coverUrl: "assets/livre.jpeg", dueDate: new Date('2025-03-03'), isOverdue: true },
      { id: 2, title: "Dune", author: "Frank Herbert", coverUrl: "assets/livre.jpeg", dueDate: new Date(new Date().setDate(new Date().getDate() + 5)), isOverdue: false, daysRemaining: 5 }
    ]);

    this.reservations.set([
      { id: 1, title: "Fondation", author: "Isaac Asimov", coverUrl: "assets/livre.jpeg", currentRank: 4, totalRank: 5 }
    ]);

    this.history.set([
      { id: 1, title: "1984", author: "George Orwell", coverUrl: "assets/livre.jpeg", returnedDate: new Date('2023-11-16'), rating: 4 },
      { id: 2, title: "Le Seigneur des Anneaux", author: "J.R.R. Tolkien", coverUrl: "assets/livre.jpeg", returnedDate: new Date('2022-05-10'), rating: 5 }
    ]);
  }

  updateProfile() {
    const { firstName, lastName, phone } = this.user();
    this.isUpdating.set(true);
    this.updateSuccess.set(false);
    this.updateError.set(false);

    this.authService.updateProfile({ firstName, lastName, phone: phone || '' }).subscribe({
      next: () => {
        this.isUpdating.set(false);
        this.updateSuccess.set(true);
      },
      error: (err) => {
        this.isUpdating.set(false);
        const fieldLabels: Record<string, string> = {
          firstName: 'Prénom',
          lastName: 'Nom',
          phone: 'Téléphone',
        };
        this.updateError.set(
          err.error && typeof err.error === 'object'
            ? Object.entries(err.error)
                .map(([key, msg]) => `${fieldLabels[key] ?? key} : ${msg}`)
                .join(' | ')
            : 'Une erreur est survenue, réessayez.'
        );
      }
    });
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.isChangingPassword.set(true);
    this.passwordSuccess.set(false);
    this.passwordError.set(false);

    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.isChangingPassword.set(false);
        this.passwordSuccess.set(true);
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.isChangingPassword.set(false);
        this.passwordError.set(
          err.error && typeof err.error === 'object'
            ? Object.values(err.error).join(' | ')
            : err.error?.message ?? 'Une erreur est survenue, réessayez.'
        );
      }
    });
  }

  deleteAccount() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return;

    this.authService.deleteAccount().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => alert(err.error?.message ?? 'Une erreur est survenue, réessayez.')
    });
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